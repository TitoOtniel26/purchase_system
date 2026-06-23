const db = require('../config/database');

class StockModel {
  static async findByProductId(productId) {
    try {
      const query = 'SELECT * FROM stock WHERE product_id = ?';
      const results = await db.query(query, [productId]);
      return results[0] || null;
    } catch (error) {
      console.error(`StockModel.findByProductId error for ${productId}:`, error);
      throw error;
    }
  }

  static async updateStock(productId, quantity) {
    try {
      console.log(`StockModel.updateStock: product=${productId}, quantity change=${quantity}`);
      
      // Cek stock sekarang
      const currentStock = await this.findByProductId(productId);
      console.log('Current stock:', currentStock);
      
      if (!currentStock) {
        console.log('Stock not found, creating new stock entry');
        // Jika belum ada stock, buat baru
        const id = db.generateUUID();
        const insertQuery = 'INSERT INTO stock (id, product_id, quantity) VALUES (?, ?, ?)';
        await db.query(insertQuery, [id, productId, quantity]);
        console.log('New stock created with quantity:', quantity);
        return;
      }
      
      // Update stock
      const query = `
        UPDATE stock 
        SET quantity = quantity + ?, last_updated = CURRENT_TIMESTAMP 
        WHERE product_id = ?
      `;
      const result = await db.query(query, [quantity, productId]);
      console.log('Stock updated, affected rows:', result.affectedRows);
      
      // Verifikasi setelah update
      const updatedStock = await this.findByProductId(productId);
      console.log('Updated stock:', updatedStock);
      
      return result;
    } catch (error) {
      console.error(`StockModel.updateStock error for ${productId}:`, error);
      throw error;
    }
  }

  static async setStock(productId, quantity) {
    try {
      const query = 'UPDATE stock SET quantity = ?, last_updated = CURRENT_TIMESTAMP WHERE product_id = ?';
      return await db.query(query, [quantity, productId]);
    } catch (error) {
      console.error(`StockModel.setStock error for ${productId}:`, error);
      throw error;
    }
  }

  static async getTotalStock() {
    try {
      const query = 'SELECT COALESCE(SUM(quantity), 0) as total FROM stock';
      const result = await db.query(query);
      return result[0] ? result[0].total : 0;
    } catch (error) {
      console.error('StockModel.getTotalStock error:', error);
      throw error;
    }
  }

  static async getLowStock(threshold = 5) {
    try {
      const query = `
        SELECT p.id, p.name, p.category, s.quantity 
        FROM stock s 
        JOIN products p ON s.product_id = p.id 
        WHERE s.quantity < ? 
        ORDER BY s.quantity ASC
      `;
      return await db.query(query, [threshold]);
    } catch (error) {
      console.error('StockModel.getLowStock error:', error);
      throw error;
    }
  }

  static async getStockValue() {
    try {
      const query = `
        SELECT SUM(p.price * s.quantity) as total_value 
        FROM stock s 
        JOIN products p ON s.product_id = p.id
      `;
      const result = await db.query(query);
      return result[0] ? result[0].total_value : 0;
    } catch (error) {
      console.error('StockModel.getStockValue error:', error);
      throw error;
    }
  }

  static async getProductStock(productId) {
    try {
      const query = `
        SELECT p.name, p.price, s.quantity 
        FROM products p 
        JOIN stock s ON p.id = s.product_id 
        WHERE p.id = ?
      `;
      const results = await db.query(query, [productId]);
      return results[0] || null;
    } catch (error) {
      console.error(`StockModel.getProductStock error for ${productId}:`, error);
      throw error;
    }
  }
}

module.exports = StockModel;