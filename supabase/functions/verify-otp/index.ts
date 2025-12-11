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

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify OTP from database (skip for demo OTP)
    const isDemoOTP = otp === '123456';
    
    if (!isDemoOTP) {
      // Get the latest OTP for this phone number
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
          JSON.stringify({ success: false, error: 'Database error while fetching OTP' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!otpRecord) {
        console.error('No OTP found for phone:', phoneNumber);
        return new Response(
          JSON.stringify({ success: false, error: 'No OTP found. Please request a new OTP.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if OTP is expired
      const now = new Date();
      const expiresAt = new Date(otpRecord.expires_at);

      if (now > expiresAt) {
        return new Response(
          JSON.stringify({ success: false, error: 'OTP has expired. Please request a new one.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify OTP
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
    } else {
      console.log('✅ Demo OTP accepted for:', phoneNumber);
    }

    // Generate email for this phone user
    const userEmail = `${phoneNumber.replace(/\+/g, '')}@phone.user`;
    let userId: string;
    let isNewUser = false;

    // First, check if profile exists with this phone number
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('user_id, first_name, last_name, email')
      .eq('phone', phoneNumber)
      .maybeSingle();

    if (existingProfile?.user_id) {
      userId = existingProfile.user_id;
      isNewUser = !existingProfile.first_name; // If no name set, treat as incomplete profile
      console.log('✅ Found existing profile for user:', userId, 'isNewUser:', isNewUser);
    } else {
      // Try to create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        phone: phoneNumber,
        phone_confirm: true,
        email: userEmail,
        email_confirm: true,
        user_metadata: { 
          phone: phoneNumber,
          phone_verified: true 
        }
      });

      if (createError) {
        console.log('Create user error:', createError.message);
        
        // If user already exists, find them by email
        if (createError.message?.includes('already') || createError.message?.includes('exists')) {
          // List users and find by email or phone
          const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
          
          const existingUser = listData?.users?.find(u => 
            u.phone === phoneNumber || u.email === userEmail
          );
          
          if (existingUser) {
            userId = existingUser.id;
            
            // Check if profile has name
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name')
              .eq('user_id', userId)
              .maybeSingle();
            
            isNewUser = !profile?.first_name;
            console.log('✅ Found existing user:', userId, 'isNewUser:', isNewUser);
          } else {
            // Last resort: create user with different email
            const uniqueEmail = `${phoneNumber.replace(/\+/g, '')}_${Date.now()}@phone.user`;
            const { data: retryUser, error: retryError } = await supabase.auth.admin.createUser({
              phone: phoneNumber,
              phone_confirm: true,
              email: uniqueEmail,
              email_confirm: true,
              user_metadata: { 
                phone: phoneNumber,
                phone_verified: true 
              }
            });
            
            if (retryError || !retryUser.user) {
              console.error('❌ Failed to create user on retry:', retryError);
              return new Response(
                JSON.stringify({ success: false, error: 'Failed to create account. Please try again.' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }
            
            userId = retryUser.user.id;
            isNewUser = true;
            console.log('✅ Created user with unique email:', userId);
            
            // Create profile
            await supabase.from('profiles').insert({
              user_id: userId,
              phone: phoneNumber,
              is_verified: true,
              verification_date: new Date().toISOString()
            });
          }
        } else {
          console.error('❌ Unexpected error creating user:', createError);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to create account' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } else if (newUser?.user) {
        userId = newUser.user.id;
        isNewUser = true;
        console.log('✅ New user created:', userId);

        // Create profile for new user
        await supabase.from('profiles').insert({
          user_id: userId,
          phone: phoneNumber,
          is_verified: true,
          verification_date: new Date().toISOString()
        });
      } else {
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Get the user's email for session generation
    const { data: userData } = await supabase.auth.admin.getUserById(userId);
    const sessionEmail = userData?.user?.email || userEmail;

    // Generate magic link for session
    console.log('📝 Generating session for user:', userId);
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: sessionEmail,
    });

    if (linkError || !linkData) {
      console.error('❌ Failed to generate link:', linkError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Exchange the token for a session
    const hashedToken = linkData.properties.hashed_token;
    const { data: sessionData, error: sessionError } = await supabase.auth.verifyOtp({
      type: 'magiclink',
      token_hash: hashedToken,
    });

    if (sessionError || !sessionData.session) {
      console.error('❌ Failed to create session:', sessionError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ OTP verified successfully. isNewUser:', isNewUser);

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
    console.error('Error in verify-otp function:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
