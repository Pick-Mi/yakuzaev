import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, otp } = await req.json();

    if (!phoneNumber || !otp) {
      return new Response(
        JSON.stringify({ error: 'Phone number and OTP are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Verifying OTP for phone number:', phoneNumber);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify OTP from database
    const { data: otpRecord, error: fetchError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('phone_number', phoneNumber)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log('OTP lookup result:', { found: !!otpRecord, error: fetchError });

    if (fetchError) {
      console.error('OTP fetch error:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: 'Database error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!otpRecord) {
      console.error('No OTP record found');
      return new Response(
        JSON.stringify({ success: false, error: 'No OTP found. Please request a new OTP.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check expiry
    if (new Date() > new Date(otpRecord.expires_at)) {
      console.error('OTP expired');
      return new Response(
        JSON.stringify({ success: false, error: 'OTP has expired. Please request a new one.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify OTP code
    if (otpRecord.otp_code !== otp) {
      console.error('OTP mismatch:', { expected: otpRecord.otp_code, received: otp });
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid OTP. Please try again.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark OTP as verified
    await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', otpRecord.id);

    console.log('✅ OTP code verified');

    // Generate unique email for phone user
    const baseEmail = `${phoneNumber.replace(/\+/g, '')}@phone.user`;
    let userId: string | null = null;
    let isNewUser = false;
    let userEmail = baseEmail;

    // Step 1: Check if profile exists with this phone
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('user_id, first_name')
      .eq('phone', phoneNumber)
      .maybeSingle();

    if (existingProfile?.user_id) {
      // Verify user still exists in auth
      const { data: userData } = await supabase.auth.admin.getUserById(existingProfile.user_id);
      if (userData?.user) {
        userId = existingProfile.user_id;
        userEmail = userData.user.email || baseEmail;
        isNewUser = !existingProfile.first_name;
        console.log('✅ Found existing user from profile:', userId);
      }
    }

    // Step 2: If not found via profile, search auth users
    if (!userId) {
      const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      const existingUser = listData?.users?.find(u => 
        u.phone === phoneNumber || u.email === baseEmail || u.email?.startsWith(`${phoneNumber.replace(/\+/g, '')}_`)
      );

      if (existingUser) {
        userId = existingUser.id;
        userEmail = existingUser.email || baseEmail;
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('user_id', userId)
          .maybeSingle();
        
        isNewUser = !profile?.first_name;
        console.log('✅ Found existing user from auth:', userId);
      }
    }

    // Step 3: Create new user if not found
    if (!userId) {
      console.log('Creating new user...');
      
      // Try creating with phone first
      let createResult = await supabase.auth.admin.createUser({
        phone: phoneNumber,
        phone_confirm: true,
        email: baseEmail,
        email_confirm: true,
        user_metadata: { phone: phoneNumber, phone_verified: true }
      });

      // If phone_exists error, create without phone (email only)
      if (createResult.error?.message?.includes('Phone number already registered') || 
          createResult.error?.message?.includes('phone_exists')) {
        console.log('Phone exists error, creating with email only...');
        
        // Use unique email to avoid conflicts
        userEmail = `${phoneNumber.replace(/\+/g, '')}_${Date.now()}@phone.user`;
        
        createResult = await supabase.auth.admin.createUser({
          email: userEmail,
          email_confirm: true,
          user_metadata: { phone: phoneNumber, phone_verified: true }
        });
      }

      if (createResult.error || !createResult.data?.user) {
        console.error('❌ Failed to create user:', createResult.error);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create account. Please try again.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      userId = createResult.data.user.id;
      userEmail = createResult.data.user.email || userEmail;
      isNewUser = true;
      console.log('✅ Created new user:', userId);

      // Create profile
      const { error: profileError } = await supabase.from('profiles').upsert({
        user_id: userId,
        phone: phoneNumber,
        is_verified: true,
        verification_date: new Date().toISOString()
      }, { onConflict: 'user_id' });

      if (profileError) {
        console.log('Profile upsert warning:', profileError.message);
      }
    }

    // Generate session
    console.log('📝 Generating session for user:', userId, 'email:', userEmail);
    
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userEmail,
    });

    if (linkError || !linkData) {
      console.error('❌ Link generation failed:', linkError);
      return new Response(
        JSON.stringify({ success: false, error: 'Session creation failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.verifyOtp({
      type: 'magiclink',
      token_hash: linkData.properties.hashed_token,
    });

    if (sessionError || !sessionData.session) {
      console.error('❌ Session creation failed:', sessionError);
      return new Response(
        JSON.stringify({ success: false, error: 'Session creation failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Authentication complete. userId:', userId, 'isNewUser:', isNewUser);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP verified successfully',
        userId,
        isNewUser,
        verified: true,
        session: {
          access_token: sessionData.session.access_token,
          refresh_token: sessionData.session.refresh_token,
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-otp:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
