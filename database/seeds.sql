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

-- Insert sample purchases (menggunakan subquery untuk ambil UUID)
INSERT INTO purchases (product_id, quantity, total_price, admin_name, notes, status) 
SELECT 
    id, 
    2, 
    15000000 * 2, 
    'Admin 1', 
    'Initial stock', 
    'completed'
FROM products WHERE name = 'Laptop Asus ROG Zephyrus';

INSERT INTO purchases (product_id, quantity, total_price, admin_name, notes, status) 
SELECT 
    id, 
    5, 
    12000000 * 5, 
    'Admin 1', 
    'First batch', 
    'completed'
FROM products WHERE name = 'Smartphone Samsung Galaxy S23';

INSERT INTO purchases (product_id, quantity, total_price, admin_name, notes, status) 
SELECT 
    id, 
    3, 
    8500000 * 3, 
    'Admin 2', 
    'Store display', 
    'completed'
FROM products WHERE name = 'TV LED Samsung 55 Inch';

INSERT INTO purchases (product_id, quantity, total_price, admin_name, notes, status) 
SELECT 
    id, 
    1, 
    18000000 * 1, 
    'Admin 1', 
    'For photo studio', 
    'completed'
FROM products WHERE name = 'Camera Mirrorless Sony A7IV';

INSERT INTO purchases (product_id, quantity, total_price, admin_name, notes, status) 
SELECT 
    id, 
    10, 
    3500000 * 10, 
    'Admin 3', 
    'Office equipment', 
    'completed'
FROM products WHERE name = 'Printer Epson L3210';

-- Update stock sesuai purchase (opsional, karena trigger akan update otomatis)
-- Tapi karena trigger mungkin belum aktif, kita update manual
UPDATE stock s
JOIN products p ON p.id = s.product_id
SET s.quantity = 
    CASE 
        WHEN p.name = 'Laptop Asus ROG Zephyrus' THEN 2
        WHEN p.name = 'Smartphone Samsung Galaxy S23' THEN 5
        WHEN p.name = 'TV LED Samsung 55 Inch' THEN 3
        WHEN p.name = 'Camera Mirrorless Sony A7IV' THEN 1
        WHEN p.name = 'Printer Epson L3210' THEN 10
        ELSE 0
    END
WHERE p.name IN (
    'Laptop Asus ROG Zephyrus',
    'Smartphone Samsung Galaxy S23',
    'TV LED Samsung 55 Inch',
    'Camera Mirrorless Sony A7IV',
    'Printer Epson L3210'
);