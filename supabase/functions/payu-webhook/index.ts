import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('PayU Webhook called:', req.method)

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method === 'POST') {
      // Initialize Supabase client
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // PayU sends response as form data
      const formData = await req.formData()
      const params: Record<string, string> = {}
      
      // Extract all form parameters
      for (const [key, value] of formData.entries()) {
        params[key] = value.toString()
      }
      
      console.log('PayU POST Response received:', params)
      
      // Extract key information
      // Order ID is stored in udf2, user ID in udf1
      const orderId = params.udf2 // Order ID from payment initialization
      const userId = params.udf1 // User ID from payment initialization
      const status = params.status?.toLowerCase()
      const transactionId = params.txnid
      const paymentId = params.mihpayid
      const amount = parseFloat(params.amount || '0')
      
      console.log('Processing payment:', { orderId, userId, status, transactionId, paymentId, amount })

      if (orderId && status === 'success') {
        // Save transaction to database with order_id in payu_response
        const { error: txnError } = await supabase
          .from('transactions')
          .insert({
            user_id: userId,
            payment_id: paymentId,
            transaction_id: transactionId,
            amount: amount,
            status: 'success',
            product_info: params.productinfo || '',
            customer_name: params.firstname || '',
            customer_email: params.email || '',
            customer_phone: params.phone || '',
            payu_response: {
              ...params,
              order_id: orderId // Add order_id to payu_response for tracking
            }
          })

        if (txnError) {
          console.error('Error saving transaction:', txnError)
        } else {
          console.log('Transaction saved successfully')
        }

        // Update order payment status to completed
        const { error: orderError } = await supabase
          .from('orders')
          .update({ 
            payment_status: 'completed',
            payment_method: 'payu',
            payment_details: {
              payment_id: paymentId,
              transaction_id: transactionId,
              mode: params.mode || 'UPI',
              bank_ref_num: params.bank_ref_num || '',
              completed_at: new Date().toISOString()
            }
          })
          .eq('id', orderId)

        if (orderError) {
          console.error('Error updating order:', orderError)
        } else {
          console.log('Order payment status updated to completed for order:', orderId)
        }
      } else if (status === 'failure') {
        // Handle failed payment
        console.log('Payment failed for order:', orderId)
        
        if (orderId) {
          const { error: orderError } = await supabase
            .from('orders')
            .update({ 
              payment_status: 'failed',
              payment_details: {
                error: params.error_Message || 'Payment failed',
                failed_at: new Date().toISOString()
              }
            })
            .eq('id', orderId)

          if (orderError) {
            console.error('Error updating failed order:', orderError)
          }
        }
      }
      
      
      // Build redirect URL with order ID from udf2
      const baseUrl = Deno.env.get('SITE_URL') || 'https://preview--yakuzaev.lovable.app'
      const orderIdFromUdf = params.udf2 // Order ID stored in udf2
      
      // Redirect to order details page if order ID is available, otherwise to generic success/failure page
      let redirectPath = status === 'success' ? '/payment-success' : '/payment-failure'
      if (orderIdFromUdf) {
        redirectPath = `/orders/${orderIdFromUdf}`
      }
      
      const redirectUrl = new URL(redirectPath, baseUrl)
      
      // Only add parameters if going to generic payment page (not order details)
      if (!orderIdFromUdf) {
        Object.entries(params).forEach(([key, value]) => {
          if (value) {
            redirectUrl.searchParams.set(key, value)
          }
        })
      }
      
      console.log('Redirecting to:', redirectUrl.toString())
      
      // Return HTML with auto-redirect instead of 302 redirect
      // This ensures browser follows the redirect with query parameters
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Processing Payment...</title>
            <script>
              window.location.href = "${redirectUrl.toString()}";
            </script>
          </head>
          <body>
            <p>Processing payment... Please wait.</p>
            <p>If you are not redirected automatically, <a href="${redirectUrl.toString()}">click here</a>.</p>
          </body>
        </html>
      `
      
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          ...corsHeaders
        }
      })
    }
    
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('PayU webhook error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
