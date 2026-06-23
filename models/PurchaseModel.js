const db = require('../config/database');
const logger = require('../utils/logger');

class PurchaseModel {
  static async findAll() {
    try {
      const query = `
        SELECT p.*, pr.name as product_name, pr.price 
        FROM purchases p 
        JOIN products pr ON p.product_id = pr.id 
        ORDER BY p.purchase_date DESC
      `;
      return await db.query(query);
    } catch (error) {
      console.error('PurchaseModel.findAll error:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = `
        SELECT p.*, pr.name as product_name, pr.price 
        FROM purchases p 
        JOIN products pr ON p.product_id = pr.id 
        WHERE p.id = ?
      `;
      const results = await db.query(query, [id]);
      return results[0] || null;
    } catch (error) {
      console.error(`PurchaseModel.findById error for ${id}:`, error);
      throw error;
    }
  }

  static async findByProductId(productId) {
    try {
      const query = `
        SELECT p.*, pr.name as product_name 
        FROM purchases p 
        JOIN products pr ON p.product_id = pr.id 
        WHERE p.product_id = ? 
        ORDER BY p.purchase_date DESC
      `;
      return await db.query(query, [productId]);
    } catch (error) {
      console.error(`PurchaseModel.findByProductId error for ${productId}:`, error);
      throw error;
    }
  }

  static async findByStatus(status) {
    try {
      const query = `
        SELECT p.*, pr.name as product_name 
        FROM purchases p 
        JOIN products pr ON p.product_id = pr.id 
        WHERE p.status = ? 
        ORDER BY p.purchase_date DESC
      `;
      return await db.query(query, [status]);
    } catch (error) {
      console.error(`PurchaseModel.findByStatus error for ${status}:`, error);
      throw error;
    }
  }

  static async create(purchaseData) {
    try {
      const { product_id, quantity, total_price, admin_name, notes, status = 'completed' } = purchaseData;
      const id = db.generateUUID();
      const query = `
        INSERT INTO purchases (id, product_id, quantity, total_price, admin_name, notes, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await db.query(query, [id, product_id, quantity, total_price, admin_name, notes, status]);
      return id;
    } catch (error) {
      console.error('PurchaseModel.create error:', error);
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const query = 'UPDATE purchases SET status = ? WHERE id = ?';
      return await db.query(query, [status, id]);
    } catch (error) {
      console.error(`PurchaseModel.updateStatus error for ${id}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM purchases WHERE id = ?';
      return await db.query(query, [id]);
    } catch (error) {
      console.error(`PurchaseModel.delete error for ${id}:`, error);
      throw error;
    }
  }

  static async getTotalCount() {
    try {
      const query = "SELECT COUNT(*) as total FROM purchases WHERE status != 'cancelled'";
      const result = await db.query(query);
      return result[0] ? result[0].total : 0;
    } catch (error) {
      console.error('PurchaseModel.getTotalCount error:', error);
      throw error;
    }
  }

  static async getRecent(limit = 5) {
    try {
      const query = `
        SELECT p.*, pr.name as product_name, pr.price 
        FROM purchases p 
        JOIN products pr ON p.product_id = pr.id 
        WHERE p.status != 'cancelled'
        ORDER BY p.purchase_date DESC 
        LIMIT ?
      `;
      return await db.query(query, [limit]);
    } catch (error) {
      console.error('PurchaseModel.getRecent error:', error);
      throw error;
    }
  }

  static async getSummary() {
    try {
      const query = `
        SELECT 
          status,
          COUNT(*) as count,
          SUM(total_price) as total_value
        FROM purchases 
        GROUP BY status
      `;
      return await db.query(query);
    } catch (error) {
      console.error('PurchaseModel.getSummary error:', error);
      throw error;
    }
  }

  static async getTotalValue() {
    try {
      const query = "SELECT SUM(total_price) as total FROM purchases WHERE status != 'cancelled'";
      const result = await db.query(query);
      return result[0] ? result[0].total : 0;
    } catch (error) {
      console.error('PurchaseModel.getTotalValue error:', error);
      throw error;
    }
  }
}

module.exports = PurchaseModel;