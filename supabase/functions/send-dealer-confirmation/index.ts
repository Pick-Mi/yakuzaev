import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DealerConfirmationRequest {
  email: string;
  firstName: string;
  lastName: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName }: DealerConfirmationRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Sending dealer application confirmation to:', email);

    const gmailUser = Deno.env.get('GMAIL_USER');
    const gmailPassword = Deno.env.get('GMAIL_APP_PASSWORD');

    if (!gmailUser || !gmailPassword) {
      console.error('Gmail credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const customerName = firstName && lastName ? `${firstName} ${lastName}` : firstName || 'Valued Partner';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background-color: #22c55e; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="color: white; font-size: 28px;">✓</span>
              </div>
              <h1 style="color: #000000; font-size: 24px; margin: 0;">Application Received!</h1>
              <p style="color: #666666; font-size: 14px; margin-top: 8px;">Thank you for your interest in becoming a Yakuza dealer</p>
            </div>
            
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Dear ${customerName},
            </p>
            
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              We have successfully received your dealer application. Our team is now reviewing your details and will get in touch with you shortly.
            </p>
            
            <div style="background-color: #f8f8f8; border-left: 4px solid #000000; padding: 16px; margin-bottom: 24px;">
              <p style="color: #333333; font-size: 14px; margin: 0;">
                <strong>What happens next?</strong><br><br>
                1. Our team will review your application<br>
                2. We may contact you for additional information<br>
                3. You'll receive a confirmation once approved
              </p>
            </div>
            
            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
              If you have any questions, feel free to reach out to our dealer support team.
            </p>
            
            <p style="color: #333333; font-size: 14px; margin-bottom: 0;">
              Best regards,<br>
              <strong>The Yakuza Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 24px;">
            <p style="color: #999999; font-size: 12px; margin: 0;">
              © 2025 Yakuza. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create SMTP client for Gmail
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: gmailUser,
          password: gmailPassword,
        },
      },
    });

    // Send email
    await client.send({
      from: gmailUser,
      to: email,
      subject: 'Your Dealer Application Has Been Received - Yakuza',
      content: `Dear ${customerName}, Your dealer application has been received. Our team will review and contact you soon.`,
      html: emailHtml,
    });

    await client.close();

    console.log('✅ Dealer confirmation email sent successfully to:', email);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Confirmation email sent successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-dealer-confirmation function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
