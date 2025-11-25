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

    // Get the latest OTP for this phone number
    const { data: otpRecord, error: fetchError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('phone_number', phoneNumber)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otpRecord) {
      console.error('OTP fetch error:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired OTP' }),
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

    // Check if user exists with this phone number
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const userWithPhone = existingUsers?.users?.find(u => u.phone === phoneNumber);

    let userId: string;
    let userEmail: string;

    if (userWithPhone) {
      // User exists
      userId = userWithPhone.id;
      userEmail = userWithPhone.email || `${phoneNumber.replace(/\+/g, '')}@phone.user`;
      console.log('✅ Existing user found:', userId);
    } else {
      // Create new user with phone number and temporary email
      userEmail = `${phoneNumber.replace(/\+/g, '')}@phone.user`;
      
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

      if (createError || !newUser.user) {
        console.error('❌ Failed to create user:', createError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create user account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

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

    // Generate magic link to get session tokens
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

    console.log('✅ Session link generated successfully');
    console.log('✅ OTP verified successfully for:', phoneNumber);

    // Extract tokens from the action_link
    const actionLink = linkData.properties.action_link;
    const urlParams = new URL(actionLink).hash.substring(1);
    const params = new URLSearchParams(urlParams);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    console.log('🔑 Tokens extracted:', { hasAccess: !!accessToken, hasRefresh: !!refreshToken });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP verified successfully',
        userId,
        verified: true,
        session: {
          access_token: accessToken,
          refresh_token: refreshToken,
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
