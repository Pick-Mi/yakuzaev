-- Manually update the payment status for order that was paid but webhook didn't process
UPDATE orders 
SET payment_status = 'completed'
WHERE id = '3bbf1fec-2b4e-4f60-84e3-ec1b8c40a9f8' AND payment_method = 'payu';