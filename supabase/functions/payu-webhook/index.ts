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
      const orderId = params.order_id
      const status = params.status?.toLowerCase()
      const transactionId = params.txnid
      const paymentId = params.mihpayid
      const amount = parseFloat(params.amount || '0')
      
      console.log('Processing payment:', { orderId, status, transactionId, paymentId, amount })

      if (orderId && status === 'success') {
        // Save transaction to database
        const { error: txnError } = await supabase
          .from('transactions')
          .insert({
            user_id: null, // Will be updated based on order
            payment_id: paymentId,
            transaction_id: transactionId,
            amount: amount,
            status: 'completed',
            product_info: params.productinfo || '',
            customer_name: params.firstname || '',
            customer_email: params.email || '',
            customer_phone: params.phone || '',
            payu_response: params
          })

        if (txnError) {
          console.error('Error saving transaction:', txnError)
        } else {
          console.log('Transaction saved successfully')
        }

        // Update order payment status
        const { error: orderError } = await supabase
          .from('orders')
          .update({ 
            payment_status: 'completed',
            payment_details: params 
          })
          .eq('id', orderId)

        if (orderError) {
          console.error('Error updating order:', orderError)
        } else {
          console.log('Order updated successfully')
        }
      }
      
      // Build redirect URL with all parameters
      const redirectUrl = new URL(
        status === 'success' ? '/payment-success' : '/payment-failure', 
        Deno.env.get('SITE_URL') || 'https://preview--yakuzaev.lovable.app'
      )
      
      // Add all PayU parameters as query params
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          redirectUrl.searchParams.set(key, value)
        }
      })
      
      console.log('Redirecting to:', redirectUrl.toString())
      
      // Redirect to the success/failure page with all parameters
      return new Response(null, {
        status: 302,
        headers: {
          'Location': redirectUrl.toString(),
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
