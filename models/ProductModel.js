const db = require('../config/database');

class ProductModel {
  static async findAll() {
    try {
      const query = `
        SELECT p.*, COALESCE(s.quantity, 0) as stock 
        FROM products p 
        LEFT JOIN stock s ON p.id = s.product_id 
        ORDER BY p.created_at DESC
      `;
      const results = await db.query(query);
      return results || [];
    } catch (error) {
      console.error('ProductModel.findAll error:', error);
      return [];
    }
  }

  static async findById(id) {
    try {
      const query = `
        SELECT p.*, COALESCE(s.quantity, 0) as stock 
        FROM products p 
        LEFT JOIN stock s ON p.id = s.product_id 
        WHERE p.id = ?
      `;
      const results = await db.query(query, [id]);
      return results[0] || null;
    } catch (error) {
      console.error(`ProductModel.findById error for ${id}:`, error);
      return null;
    }
  }

  static async create(productData) {
    try {
      const { name, price, category } = productData;
      const id = db.generateUUID();
      const query = 'INSERT INTO products (id, name, price, category) VALUES (?, ?, ?, ?)';
      await db.query(query, [id, name, price, category]);
      
      // Initialize stock
      await db.query('INSERT INTO stock (product_id, quantity) VALUES (?, 0)', [id]);
      
      return id;
    } catch (error) {
      console.error('ProductModel.create error:', error);
      throw error;
    }
  }

  static async update(id, productData) {
    try {
      const { name, price, category } = productData;
      const query = 'UPDATE products SET name = ?, price = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      return await db.query(query, [name, price, category, id]);
    } catch (error) {
      console.error(`ProductModel.update error for ${id}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM products WHERE id = ?';
      return await db.query(query, [id]);
    } catch (error) {
      console.error(`ProductModel.delete error for ${id}:`, error);
      throw error;
    }
  }

  static async getCategories() {
    try {
      const query = 'SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category';
      return await db.query(query);
    } catch (error) {
      console.error('ProductModel.getCategories error:', error);
      return [];
    }
  }

  static async getTotalCount() {
    try {
      const query = 'SELECT COUNT(*) as total FROM products';
      const result = await db.query(query);
      return result[0] ? result[0].total : 0;
    } catch (error) {
      console.error('ProductModel.getTotalCount error:', error);
      return 0;
    }
  }
}

module.exports = ProductModel;