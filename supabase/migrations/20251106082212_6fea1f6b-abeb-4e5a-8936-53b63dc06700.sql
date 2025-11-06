-- Clear all orders and related data
DELETE FROM order_items;
DELETE FROM orders;

-- Reset the order number sequence
ALTER SEQUENCE orders_order_number_seq RESTART WITH 1;