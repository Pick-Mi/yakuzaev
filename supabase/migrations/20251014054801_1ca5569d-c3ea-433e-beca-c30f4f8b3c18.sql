-- Update the payment status for this specific order to completed
UPDATE orders 
SET payment_status = 'completed'
WHERE id = '6fccd1f6-2648-497a-85ef-bcf5ab728276';