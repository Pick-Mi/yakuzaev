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

    // Check if it's the demo OTP
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

    // Check if user exists with this phone number or email
    const userEmail = `${phoneNumber.replace(/\+/g, '')}@phone.user`;
    
    // Try to find existing user more thoroughly
    let userWithPhone = null;
    let page = 1;
    const perPage = 1000;
    
    // Search through paginated results
    while (!userWithPhone) {
      const { data: usersPage } = await supabase.auth.admin.listUsers({
        page,
        perPage
      });
      
      if (!usersPage?.users || usersPage.users.length === 0) {
        break; // No more users
      }
      
      userWithPhone = usersPage.users.find(u => 
        u.phone === phoneNumber || u.email === userEmail
      );
      
      if (usersPage.users.length < perPage) {
        break; // Last page
      }
      
      page++;
    }

    let userId: string;

    if (userWithPhone) {
      // User exists
      userId = userWithPhone.id;
      console.log('✅ Existing user found:', userId);
      
      // Update phone number if not set
      if (!userWithPhone.phone) {
        await supabase.auth.admin.updateUserById(userId, {
          phone: phoneNumber,
          phone_confirm: true,
          user_metadata: { 
            phone: phoneNumber,
            phone_verified: true 
          }
        });
      }
    } else {
      // Try to create new user with phone number and temporary email
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

      // If phone already exists, try to find the user again using email
      if (createError?.message?.includes('already registered') || createError?.message?.includes('phone_exists')) {
        console.log('⚠️ Phone already registered, looking up by email:', userEmail);
        
        // Try searching all pages again with better pagination
        let foundUser = null;
        let searchPage = 1;
        
        while (!foundUser && searchPage <= 10) { // Limit to 10 pages for safety
          const { data: usersPage } = await supabase.auth.admin.listUsers({
            page: searchPage,
            perPage: 1000
          });
          
          if (!usersPage?.users || usersPage.users.length === 0) {
            break;
          }
          
          foundUser = usersPage.users.find(u => 
            u.phone === phoneNumber || u.email === userEmail
          );
          
          if (usersPage.users.length < 1000) {
            break; // Last page
          }
          
          searchPage++;
        }
        
        if (foundUser) {
          userId = foundUser.id;
          console.log('✅ Found existing user after retry:', userId);
        } else {
          console.error('❌ Could not find existing user. Phone:', phoneNumber, 'Email:', userEmail);
          return new Response(
            JSON.stringify({ success: false, error: 'Authentication failed. Please try again or contact support.' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } else if (createError || !newUser.user) {
        console.error('❌ Failed to create user:', createError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create user account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        userId = newUser.user.id;
        console.log('✅ New user created:', userId);

        // Create profile for new user
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: userId,
            phone: phoneNumber,
            is_verified: true,
            verification_date: new Date().toISOString()
          });

        if (profileError) {
          console.error('⚠️ Profile creation warning:', profileError);
        }
      }
    }

    // Use the hashed token to create a proper session
    console.log('📝 Generating session for user:', userId);
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userEmail,
    });

    if (linkError || !linkData) {
      console.error('❌ Failed to generate link:', linkError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use the hashed_token to verify and create session
    const hashedToken = linkData.properties.hashed_token;
    console.log('🔑 Using hashed token to create session');

    // Exchange the token for a session
    const { data: sessionData, error: sessionError } = await supabase.auth.verifyOtp({
      type: 'magiclink',
      token_hash: hashedToken,
    });

    if (sessionError || !sessionData.session) {
      console.error('❌ Failed to create session from token:', sessionError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Session created successfully');
    console.log('✅ OTP verified successfully for:', phoneNumber);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP verified successfully',
        userId,
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
