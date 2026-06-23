const ProductModel = require('../models/ProductModel');
const StockModel = require('../models/StockModel');
const { validateProduct } = require('../utils/validator');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

class ProductService {
  static async getAllProducts() {
    try {
      const products = await ProductModel.findAll();
      return products || [];
    } catch (error) {
      logger.error('Error fetching products:', error);
      return [];
    }
  }

  static async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        throw new AppError('Product not found', 404);
      }
      return product;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error(`Error fetching product ${id}:`, error);
      throw new AppError('Failed to fetch product', 500);
    }
  }

  static async createProduct(productData) {
    try {
      const validation = validateProduct(productData);
      if (!validation.isValid) {
        throw new AppError(validation.errors.join(', '), 400);
      }

      const productId = await ProductModel.create(productData);
      const product = await ProductModel.findById(productId);
      
      logger.info(`Product created: ${product ? product.name : 'Unknown'} (ID: ${productId})`);
      return product;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error creating product:', error);
      throw new AppError('Failed to create product', 500);
    }
  }

  static async updateProduct(id, productData) {
    try {
      const existing = await ProductModel.findById(id);
      if (!existing) {
        throw new AppError('Product not found', 404);
      }

      const validation = validateProduct(productData);
      if (!validation.isValid) {
        throw new AppError(validation.errors.join(', '), 400);
      }

      await ProductModel.update(id, productData);
      const updated = await ProductModel.findById(id);
      
      logger.info(`Product updated: ${updated ? updated.name : 'Unknown'} (ID: ${id})`);
      return updated;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error(`Error updating product ${id}:`, error);
      throw new AppError('Failed to update product', 500);
    }
  }

  static async deleteProduct(id) {
    try {
      const existing = await ProductModel.findById(id);
      if (!existing) {
        throw new AppError('Product not found', 404);
      }

      await ProductModel.delete(id);
      logger.info(`Product deleted: ID ${id}`);
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error(`Error deleting product ${id}:`, error);
      throw new AppError('Failed to delete product', 500);
    }
  }

  static async getProductWithStock(id) {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        throw new AppError('Product not found', 404);
      }
      const stock = await StockModel.findByProductId(id);
      return { ...product, stock: stock ? stock.quantity : 0 };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error(`Error fetching product with stock ${id}:`, error);
      throw new AppError('Failed to fetch product with stock', 500);
    }
  }
}

module.exports = ProductService;