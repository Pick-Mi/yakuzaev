import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  variant?: string;
  image?: string;
}

interface OrderDetails {
  orderId: string;
  orderNumber: string | number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  paymentMethod?: string;
  transactionId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderDetails: OrderDetails = await req.json();
    
    const { 
      orderId, 
      orderNumber, 
      customerName, 
      customerEmail, 
      customerPhone,
      items, 
      totalAmount, 
      shippingAddress,
      paymentMethod,
      transactionId
    } = orderDetails;

    if (!customerEmail || !orderId) {
      return new Response(
        JSON.stringify({ error: 'Customer email and order ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Sending order confirmation email for order:', orderId, 'to:', customerEmail);

    // Initialize Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(resendApiKey);

    // Generate order items HTML
    const itemsHtml = items?.length > 0 
      ? items.map(item => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">
              <strong style="color: #333;">${item.name}</strong>
              ${item.variant ? `<br><span style="color: #666; font-size: 13px;">${item.variant}</span>` : ''}
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; color: #666;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; color: #333;">₹${item.price.toLocaleString('en-IN')}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="3" style="padding: 12px; text-align: center; color: #666;">Order details</td></tr>';

    // Generate shipping address HTML
    const addressHtml = shippingAddress 
      ? `
        <div style="background-color: #f8f8f8; border-radius: 8px; padding: 16px; margin-top: 24px;">
          <h3 style="color: #333; font-size: 16px; margin: 0 0 12px 0;">Shipping Address</h3>
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0;">
            ${shippingAddress.street || ''}<br>
            ${shippingAddress.city || ''}${shippingAddress.state ? ', ' + shippingAddress.state : ''} ${shippingAddress.postalCode || ''}<br>
            ${shippingAddress.country || 'India'}
          </p>
        </div>
      `
      : '';

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
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background-color: #22c55e; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h1 style="color: #000000; font-size: 24px; margin: 0;">Order Confirmed!</h1>
              <p style="color: #666666; font-size: 14px; margin-top: 8px;">Thank you for your order, ${customerName || 'valued customer'}!</p>
            </div>
            
            <!-- Order Info -->
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #666; font-size: 14px;">Order Number:</td>
                  <td style="color: #000; font-weight: bold; text-align: right; font-size: 14px;">#${orderNumber || orderId.slice(0, 8).toUpperCase()}</td>
                </tr>
                ${transactionId ? `
                <tr>
                  <td style="color: #666; font-size: 14px; padding-top: 8px;">Transaction ID:</td>
                  <td style="color: #000; text-align: right; font-size: 14px; padding-top: 8px;">${transactionId}</td>
                </tr>
                ` : ''}
                ${paymentMethod ? `
                <tr>
                  <td style="color: #666; font-size: 14px; padding-top: 8px;">Payment Method:</td>
                  <td style="color: #000; text-align: right; font-size: 14px; padding-top: 8px;">${paymentMethod}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <!-- Order Items -->
            <h3 style="color: #333; font-size: 16px; margin: 0 0 16px 0;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
              <thead>
                <tr style="background-color: #f8f8f8;">
                  <th style="padding: 12px; text-align: left; font-size: 13px; color: #666; border-bottom: 2px solid #eee;">Item</th>
                  <th style="padding: 12px; text-align: center; font-size: 13px; color: #666; border-bottom: 2px solid #eee;">Qty</th>
                  <th style="padding: 12px; text-align: right; font-size: 13px; color: #666; border-bottom: 2px solid #eee;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <!-- Total -->
            <div style="border-top: 2px solid #000; padding-top: 16px; margin-top: 16px;">
              <table style="width: 100%;">
                <tr>
                  <td style="font-size: 18px; font-weight: bold; color: #000;">Total Amount</td>
                  <td style="font-size: 18px; font-weight: bold; color: #000; text-align: right;">₹${totalAmount.toLocaleString('en-IN')}</td>
                </tr>
              </table>
            </div>
            
            ${addressHtml}
            
            <!-- Next Steps -->
            <div style="margin-top: 32px; padding: 20px; background-color: #fafafa; border-radius: 8px;">
              <h3 style="color: #333; font-size: 16px; margin: 0 0 12px 0;">What's Next?</h3>
              <ul style="color: #666; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>We're processing your order</li>
                <li>You'll receive a shipping confirmation email with tracking details</li>
                <li>Expected delivery: 5-7 business days</li>
              </ul>
            </div>
            
            <!-- Contact -->
            <p style="color: #999999; font-size: 14px; line-height: 1.6; margin-top: 24px; margin-bottom: 0; text-align: center;">
              Questions about your order? Contact us at<br>
              <a href="mailto:support@yakuza.com" style="color: #000;">support@yakuza.com</a>
            </p>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 24px;">
            <p style="color: #999999; font-size: 12px; margin: 0;">
              © 2025 Yakuza. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const { error: emailError } = await resend.emails.send({
      from: 'Yakuza <onboarding@resend.dev>',
      to: [customerEmail],
      subject: `Order Confirmed - #${orderNumber || orderId.slice(0, 8).toUpperCase()}`,
      html: emailHtml,
    });

    if (emailError) {
      console.error('Email sending error:', emailError);
      return new Response(
        JSON.stringify({ error: 'Failed to send order confirmation email', details: emailError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Order confirmation email sent successfully to:', customerEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order confirmation email sent successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-order-confirmation function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
