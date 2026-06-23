require('dotenv').config();
const mysql = require('mysql2');
const logger = require('../utils/logger');

class Database {
  constructor() {
    this.pool = null;
    this.initialize();
  }

  initialize() {
    try {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'purchase_system',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4'
      });

      // Test connection
      this.pool.getConnection((err, connection) => {
        if (err) {
          logger.error('Database connection failed:', err.message);
          console.log('⚠️  Pastikan MySQL sudah berjalan dan database sudah dibuat');
          console.log('📝 Jalankan: mysql -u root -p < database/schema.sql');
          console.log('📝 Dan: mysql -u root -p < database/seeds.sql');
        } else {
          logger.info('✅ Database connected successfully');
          connection.release();
        }
      });
    } catch (error) {
      logger.error('Database initialization error:', error);
    }
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, params, (error, results) => {
        if (error) {
          logger.error('Query error:', error.message);
          logger.error('SQL:', sql);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  getConnection() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) reject(err);
        else resolve(connection);
      });
    });
  }

  async transaction(callback) {
    const connection = await this.getConnection();
    try {
      await new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      const result = await callback(connection);
      await new Promise((resolve, reject) => {
        connection.commit((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      return result;
    } catch (error) {
      await new Promise((resolve, reject) => {
        connection.rollback((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      throw error;
    } finally {
      connection.release();
    }
  }

  // Helper to generate UUID
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

module.exports = new Database();