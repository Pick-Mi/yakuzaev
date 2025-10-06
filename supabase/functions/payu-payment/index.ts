import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PayUPaymentRequest {
  orderId: string
  amount: number
  productInfo: string
  firstName: string
  email: string
  phone: string
  surl: string
  furl: string
  udf1?: string
  udf2?: string
  udf3?: string
  udf4?: string
  udf5?: string
}

interface PayUResponse {
  mihpayid: string
  mode: string
  status: string
  unmappedstatus: string
  key: string
  txnid: string
  amount: string
  productinfo: string
  firstname: string
  email: string
  phone: string
  udf1: string
  udf2: string
  udf3: string
  udf4: string
  udf5: string
  hash: string
  field1: string
  field2: string
  field3: string
  field4: string
  field5: string
  field6: string
  field7: string
  field8: string
  field9: string
  error: string
  error_Message: string
  net_amount_debit: string
  addedon: string
}

async function generateHash(
  key: string,
  txnid: string,
  amount: string,
  productinfo: string,
  firstname: string,
  email: string,
  udf1: string,
  udf2: string,
  udf3: string,
  udf4: string,
  udf5: string,
  salt: string
): Promise<string> {
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`
  console.log('Hash string:', hashString)
  
  const encoder = new TextEncoder()
  const data = encoder.encode(hashString)
  
  const hashBuffer = await crypto.subtle.digest('SHA-512', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

async function verifyResponseHash(
  salt: string,
  status: string,
  udf5: string,
  udf4: string,
  udf3: string,
  udf2: string,
  udf1: string,
  email: string,
  firstname: string,
  productinfo: string,
  amount: string,
  txnid: string,
  key: string,
  hash: string
): Promise<boolean> {
  // PayU Response Hash Format (Regular Integration):
  // sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
  // Note: 6 empty pipes after status (for additional fields that are not used)
  const hashString = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`
  
  console.log('=== Hash Verification Debug ===')
  console.log('Hash string for verification:', hashString)
  console.log('Received hash from PayU:', hash)
  
  const encoder = new TextEncoder()
  const data = encoder.encode(hashString)
  
  const hashBuffer = await crypto.subtle.digest('SHA-512', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  console.log('Calculated hash:', calculatedHash)
  console.log('Hash match result:', calculatedHash === hash)
  console.log('===========================')
  
  return calculatedHash === hash
}

serve(async (req) => {
  console.log('PayU payment function called:', req.method)

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const merchantKey = Deno.env.get('PAYU_MERCHANT_KEY')
    const salt = Deno.env.get('PAYU_SALT')

    if (!merchantKey || !salt) {
      throw new Error('PayU credentials not configured')
    }

    if (req.method === 'POST') {
      const body = await req.json()
      const action = body.action

      if (action === 'initiate_payment') {
        const paymentData: PayUPaymentRequest = body.paymentData
        console.log('Initiating PayU payment:', paymentData)

        // Validate amount
        if (!paymentData.amount || paymentData.amount <= 0) {
          throw new Error('Invalid payment amount')
        }

        // Generate unique transaction ID (order ID + timestamp)
        const uniqueTxnId = `${paymentData.orderId}_${Date.now()}`
        console.log('Generated unique txnid:', uniqueTxnId)

        // Store the unique txnid in udf2 for reference
        const udf2 = paymentData.orderId // Store original order ID in udf2

        // Generate hash for payment request
        const hash = await generateHash(
          merchantKey,
          uniqueTxnId,
          paymentData.amount.toString(),
          paymentData.productInfo,
          paymentData.firstName,
          paymentData.email,
          paymentData.udf1 || '',
          udf2,
          paymentData.udf3 || '',
          paymentData.udf4 || '',
          paymentData.udf5 || '',
          salt
        )

        // PayU production environment URL
        const payuUrl = 'https://secure.payu.in/_payment'
        
        const paymentParams = {
          key: merchantKey,
          txnid: uniqueTxnId,
          amount: paymentData.amount.toString(),
          productinfo: paymentData.productInfo,
          firstname: paymentData.firstName,
          email: paymentData.email,
          phone: paymentData.phone,
          surl: paymentData.surl,
          furl: paymentData.furl,
          udf1: paymentData.udf1 || '',
          udf2: udf2,
          udf3: paymentData.udf3 || '',
          udf4: paymentData.udf4 || '',
          udf5: paymentData.udf5 || '',
          hash: hash,
          service_provider: 'payu_paisa'
        }

        console.log('PayU payment params generated:', paymentParams)

        return new Response(
          JSON.stringify({ 
            success: true, 
            paymentParams,
            payuUrl 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )

      } else if (action === 'verify_payment') {
        const responseData: PayUResponse = body.responseData
        console.log('Verifying PayU payment response:', responseData)

        // Verify response hash
        const isValidHash = await verifyResponseHash(
          salt,
          responseData.status,
          responseData.udf5,
          responseData.udf4,
          responseData.udf3,
          responseData.udf2,
          responseData.udf1,
          responseData.email,
          responseData.firstname,
          responseData.productinfo,
          responseData.amount,
          responseData.txnid,
          responseData.key,
          responseData.hash
        )

        if (!isValidHash) {
          console.error('Invalid hash in PayU response')
          console.error('Expected hash verification failed for txnid:', responseData.txnid)
          console.error('Response status:', responseData.status)
          console.error('PayU Response data:', JSON.stringify(responseData, null, 2))
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Invalid payment response hash',
              details: 'Hash verification failed - possible tampering detected',
              txnid: responseData.txnid,
              status: responseData.status
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Update order status based on PayU response
        const orderStatus = responseData.status === 'success' ? 'completed' : 'failed'
        const paymentStatus = responseData.status === 'success' ? 'completed' : 'failed'
        
        // Extract order ID from udf2 (we stored it there during initiation)
        const orderId = responseData.udf2
        const userId = responseData.udf1 // user_id stored in udf1
        
        console.log('Updating order:', orderId, 'with payment status:', paymentStatus)

        // Update order with payment details
        const { error: updateError } = await supabaseClient
          .from('orders')
          .update({
            status: orderStatus,
            payment_status: paymentStatus,
            payment_details: {
              method: 'payu',
              mihpayid: responseData.mihpayid,
              mode: responseData.mode,
              status: responseData.status,
              txnid: responseData.txnid,
              net_amount_debit: responseData.net_amount_debit,
              addedon: responseData.addedon
            }
          })
          .eq('id', orderId)

        if (updateError) {
          console.error('Error updating order:', updateError)
          throw updateError
        }

        // Store transaction record with comprehensive PayU payment details
        const { error: transactionError } = await supabaseClient
          .from('transactions')
          .insert({
            user_id: userId,
            amount: parseFloat(responseData.amount),
            currency: 'INR',
            status: paymentStatus,
            payment_id: responseData.mihpayid,
            transaction_id: responseData.txnid,
            product_info: responseData.productinfo,
            customer_name: responseData.firstname,
            customer_email: responseData.email,
            customer_phone: responseData.phone,
            payu_response: {
              mihpayid: responseData.mihpayid,
              mode: responseData.mode,
              status: responseData.status,
              unmappedstatus: responseData.unmappedstatus,
              key: responseData.key,
              txnid: responseData.txnid,
              amount: responseData.amount,
              productinfo: responseData.productinfo,
              firstname: responseData.firstname,
              email: responseData.email,
              phone: responseData.phone,
              net_amount_debit: responseData.net_amount_debit,
              addedon: responseData.addedon,
              order_id: orderId,
              error: responseData.error,
              error_Message: responseData.error_Message
            }
          })

        if (transactionError) {
          console.error('Error creating transaction record:', transactionError)
          // Don't throw error - order update succeeded, just log the transaction error
        }

        console.log('Payment verification completed:', {
          orderId: orderId,
          txnid: responseData.txnid,
          status: responseData.status,
          mihpayid: responseData.mihpayid
        })

        return new Response(
          JSON.stringify({
            success: true,
            paymentStatus: responseData.status,
            orderId: orderId,
            txnid: responseData.txnid,
            mihpayid: responseData.mihpayid
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('PayU payment error:', error)
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
