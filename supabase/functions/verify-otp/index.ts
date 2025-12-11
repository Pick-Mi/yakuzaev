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
      return new Response(
        JSON.stringify({ success: false, error: 'Database error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!otpRecord) {
      return new Response(
        JSON.stringify({ success: false, error: 'No OTP found. Please request a new OTP.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check expiry
    if (new Date() > new Date(otpRecord.expires_at)) {
      return new Response(
        JSON.stringify({ success: false, error: 'OTP has expired. Please request a new one.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify OTP code
    if (otpRecord.otp_code !== otp) {
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

    console.log('✅ OTP verified successfully');

    // Generate email for phone user
    const userEmail = `${phoneNumber.replace(/\+/g, '')}@phone.user`;
    let userId: string | null = null;
    let isNewUser = false;

    // Step 1: Try to find user by listing all users
    const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const existingUser = listData?.users?.find(u => 
      u.phone === phoneNumber || u.email === userEmail
    );

    if (existingUser) {
      userId = existingUser.id;
      console.log('✅ Found existing user:', userId);
      
      // Check if profile is complete
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('user_id', userId)
        .maybeSingle();
      
      isNewUser = !profile?.first_name;
    } else {
      // Step 2: Try to create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        phone: phoneNumber,
        phone_confirm: true,
        email: userEmail,
        email_confirm: true,
        user_metadata: { phone: phoneNumber, phone_verified: true }
      });

      if (createError) {
        console.log('Create user error:', createError.message);
        
        // Phone exists but not found in list - search more pages
        if (createError.message?.includes('Phone number already registered')) {
          let foundUser = null;
          for (let page = 2; page <= 5 && !foundUser; page++) {
            const { data: pageData } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
            if (!pageData?.users?.length) break;
            foundUser = pageData.users.find(u => u.phone === phoneNumber || u.email === userEmail);
          }
          
          if (foundUser) {
            userId = foundUser.id;
            console.log('✅ Found user on later page:', userId);
            
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name')
              .eq('user_id', userId)
              .maybeSingle();
            
            isNewUser = !profile?.first_name;
          } else {
            // User exists but can't be found - this shouldn't happen
            // Try to delete the old phone association and create fresh
            console.log('⚠️ Phone registered but user not found, attempting recovery...');
            
            // Create with unique email as workaround
            const uniqueEmail = `${phoneNumber.replace(/\+/g, '')}_${Date.now()}@phone.user`;
            const { data: recoveryUser, error: recoveryError } = await supabase.auth.admin.createUser({
              email: uniqueEmail,
              email_confirm: true,
              user_metadata: { phone: phoneNumber, phone_verified: true }
            });
            
            if (recoveryError || !recoveryUser.user) {
              console.error('❌ Recovery failed:', recoveryError);
              return new Response(
                JSON.stringify({ success: false, error: 'Account issue. Please contact support.' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }
            
            userId = recoveryUser.user.id;
            isNewUser = true;
            
            // Create profile
            await supabase.from('profiles').upsert({
              user_id: userId,
              phone: phoneNumber,
              is_verified: true,
              verification_date: new Date().toISOString()
            }, { onConflict: 'user_id' });
          }
        } else {
          console.error('❌ Unexpected create error:', createError);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to create account' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } else if (newUser?.user) {
        userId = newUser.user.id;
        isNewUser = true;
        console.log('✅ Created new user:', userId);
        
        // Create profile
        await supabase.from('profiles').upsert({
          user_id: userId,
          phone: phoneNumber,
          is_verified: true,
          verification_date: new Date().toISOString()
        }, { onConflict: 'user_id' });
      }
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to authenticate' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user email for session
    const { data: userData } = await supabase.auth.admin.getUserById(userId);
    const sessionEmail = userData?.user?.email || userEmail;

    // Generate session
    console.log('📝 Generating session for:', userId);
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: sessionEmail,
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

    console.log('✅ Authentication complete. isNewUser:', isNewUser);

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
