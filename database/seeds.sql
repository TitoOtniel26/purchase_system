-- Insert 10 sample products
INSERT INTO products (name, price, category) VALUES
('Laptop Asus ROG Zephyrus', 15000000, 'Electronics'),
('Smartphone Samsung Galaxy S23', 12000000, 'Electronics'),
('TV LED Samsung 55 Inch', 8500000, 'Electronics'),
('Camera Mirrorless Sony A7IV', 18000000, 'Electronics'),
('Printer Epson L3210', 3500000, 'Electronics'),
('Meja Kayu Jati Mewah', 4500000, 'Furniture'),
('Kursi Kantor Ergonomis', 2500000, 'Furniture'),
('Lemari Pakaian 3 Pintu', 5500000, 'Furniture'),
('Rak Buku Minimalis', 1800000, 'Furniture'),
('Lampu LED Meja', 450000, 'Electronics');

-- Initialize stock for all products
INSERT INTO stock (product_id, quantity)
SELECT id, 0 FROM products;

-- Insert sample purchases
INSERT INTO purchases (product_id, quantity, total_price, admin_name, notes, status) VALUES
(1, 2, 30000000, 'Admin 1', 'Initial stock', 'completed'),
(2, 5, 60000000, 'Admin 1', 'First batch', 'completed'),
(3, 3, 25500000, 'Admin 2', 'Store display', 'completed'),
(4, 1, 18000000, 'Admin 1', 'For photo studio', 'completed'),
(5, 10, 35000000, 'Admin 3', 'Office equipment', 'completed');