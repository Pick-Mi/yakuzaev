import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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
      // PayU sends response as form data
      const formData = await req.formData()
      const params: Record<string, string> = {}
      
      // Extract all form parameters
      for (const [key, value] of formData.entries()) {
        params[key] = value.toString()
      }
      
      console.log('PayU POST Response received:', params)
      
      // Build redirect URL with all parameters
      const redirectUrl = new URL('/payment/success', Deno.env.get('SITE_URL') || 'https://preview--yakuzaev.lovable.app')
      
      // Add all PayU parameters as query params
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          redirectUrl.searchParams.set(key, value)
        }
      })
      
      console.log('Redirecting to:', redirectUrl.toString())
      
      // Redirect to the success page with all parameters
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
