const PurchaseModel = require('../models/PurchaseModel');
const ProductModel = require('../models/ProductModel');
const StockModel = require('../models/StockModel');
const { validatePurchase } = require('../utils/validator');
const logger = require('../utils/logger');

class PurchaseService {
  static async getAllPurchases() {
    try {
      return await PurchaseModel.findAll();
    } catch (error) {
      logger.error('Error fetching purchases:', error);
      throw error;
    }
  }

  static async getPurchaseById(id) {
    try {
      const purchase = await PurchaseModel.findById(id);
      if (!purchase) {
        throw new Error('Purchase not found');
      }
      return purchase;
    } catch (error) {
      logger.error(`Error fetching purchase ${id}:`, error);
      throw error;
    }
  }

  static async createPurchase(purchaseData) {
    try {
      console.log('=== Creating purchase ===');
      console.log('Purchase data:', purchaseData);
      
      // Validate
      const validation = validatePurchase(purchaseData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Check product
      const product = await ProductModel.findById(purchaseData.product_id);
      if (!product) {
        throw new Error('Product not found');
      }

      console.log('Product found:', product.name, 'Price:', product.price);

      // Calculate total
      const total_price = product.price * purchaseData.quantity;
      console.log('Total price:', total_price);

      // 1. Create purchase
      const purchaseId = await PurchaseModel.create({
        ...purchaseData,
        total_price
      });
      console.log('Purchase created with ID:', purchaseId);

      // 2. Update stock - HANYA SEKALI di sini
      console.log('Updating stock for product:', purchaseData.product_id);
      console.log('Adding quantity:', purchaseData.quantity);
      
      await StockModel.updateStock(purchaseData.product_id, purchaseData.quantity);
      console.log('Stock updated successfully');

      // Get created purchase
      const purchase = await PurchaseModel.findById(purchaseId);
      
      // Verify stock after update
      const updatedStock = await StockModel.findByProductId(purchaseData.product_id);
      console.log('Updated stock:', updatedStock);
      
      logger.info(`Purchase created: ID ${purchaseId} - ${product.name} x ${purchaseData.quantity}`);
      return purchase;
    } catch (error) {
      console.error('Error creating purchase:', error);
      logger.error('Error creating purchase:', error);
      throw error;
    }
  }

  static async cancelPurchase(id) {
    try {
      console.log('=== Cancelling purchase ===');
      const purchase = await PurchaseModel.findById(id);
      if (!purchase) {
        throw new Error('Purchase not found');
      }

      if (purchase.status === 'cancelled') {
        throw new Error('Purchase already cancelled');
      }

      // 1. Update status
      await PurchaseModel.updateStatus(id, 'cancelled');

      // 2. Reduce stock if was completed
      if (purchase.status === 'completed') {
        console.log('Reducing stock for product:', purchase.product_id);
        console.log('Reducing quantity:', purchase.quantity);
        await StockModel.updateStock(purchase.product_id, -purchase.quantity);
      }

      logger.info(`Purchase cancelled: ID ${id}`);
      return { success: true, message: 'Purchase cancelled successfully' };
    } catch (error) {
      console.error('Error cancelling purchase:', error);
      logger.error(`Error cancelling purchase ${id}:`, error);
      throw error;
    }
  }

  static async deletePurchase(id) {
    try {
      const purchase = await PurchaseModel.findById(id);
      if (!purchase) {
        throw new Error('Purchase not found');
      }

      if (purchase.status === 'completed') {
        throw new Error('Cannot delete completed purchase. Cancel it first.');
      }

      await PurchaseModel.delete(id);
      logger.info(`Purchase deleted: ID ${id}`);
      return { success: true, message: 'Purchase deleted successfully' };
    } catch (error) {
      console.error('Error deleting purchase:', error);
      logger.error(`Error deleting purchase ${id}:`, error);
      throw error;
    }
  }

  static async getDashboardStats() {
    try {
      const [totalProducts, totalPurchases, totalStock, recentPurchases, purchaseSummary, totalValue] = await Promise.all([
        ProductModel.getTotalCount(),
        PurchaseModel.getTotalCount(),
        StockModel.getTotalStock(),
        PurchaseModel.getRecent(5),
        PurchaseModel.getSummary(),
        PurchaseModel.getTotalValue ? PurchaseModel.getTotalValue() : Promise.resolve(0)
      ]);

      return {
        totalProducts: totalProducts || 0,
        totalPurchases: totalPurchases || 0,
        totalStock: totalStock || 0,
        totalValue: totalValue || 0,
        recentPurchases: recentPurchases || [],
        purchaseSummary: purchaseSummary || []
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      logger.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
}

module.exports = PurchaseService;