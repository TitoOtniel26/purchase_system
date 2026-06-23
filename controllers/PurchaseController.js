const PurchaseService = require('../services/PurchaseService');
const ProductService = require('../services/ProductService');
const { validatePurchase } = require('../utils/validator');
const logger = require('../utils/logger');

class PurchaseController {
  static async listPurchases(req, res) {
    try {
      console.log('=== listPurchases called ===');
      const purchases = await PurchaseService.getAllPurchases();
      
      return res.render('purchases/index', {
        title: 'Purchases',
        currentPage: 'purchases',
        purchases: purchases || []
      });
    } catch (error) {
      console.error('listPurchases error:', error);
      return res.status(500).render('error', {
        title: 'Error',
        message: error.message || 'Failed to load purchases',
        statusCode: 500
      });
    }
  }

  static async showPurchase(req, res) {
    try {
      console.log(`=== showPurchase called with id: ${req.params.id} ===`);
      const purchase = await PurchaseService.getPurchaseById(req.params.id);
      
      if (!purchase) {
        return res.status(404).render('error', {
          title: 'Not Found',
          message: 'Purchase not found',
          statusCode: 404
        });
      }
      
      return res.render('purchases/show', {
        title: `Purchase #${purchase.id}`,
        currentPage: 'purchases',
        purchase
      });
    } catch (error) {
      console.error('showPurchase error:', error);
      return res.status(500).render('error', {
        title: 'Error',
        message: error.message || 'Failed to load purchase',
        statusCode: 500
      });
    }
  }

  static async createPurchase(req, res) {
    try {
      console.log('=== createPurchase called ===');
      console.log('Request body:', req.body);
      
      // Validasi manual
      const validation = validatePurchase(req.body);
      console.log('Validation result:', validation);
      
      if (!validation.isValid) {
        // Jika validasi gagal, kembali ke form dengan error
        const products = await ProductService.getAllProducts();
        return res.render('purchases/form', {
          title: 'New Purchase',
          currentPage: 'purchases',
          products: products || [],
          purchase: req.body,
          error: validation.errors.join(', '),
          action: '/purchases',
          method: 'POST'
        });
      }
      
      await PurchaseService.createPurchase(req.body);
      return res.redirect('/purchases');
    } catch (error) {
      console.error('createPurchase error:', error);
      
      try {
        const products = await ProductService.getAllProducts();
        return res.render('purchases/form', {
          title: 'New Purchase',
          currentPage: 'purchases',
          products: products || [],
          purchase: req.body,
          error: error.message || 'Failed to create purchase',
          action: '/purchases',
          method: 'POST'
        });
      } catch (productError) {
        console.error('Error getting products:', productError);
        return res.status(500).render('error', {
          title: 'Error',
          message: error.message || 'Failed to create purchase',
          statusCode: 500
        });
      }
    }
  }

  static async cancelPurchase(req, res) {
    try {
      console.log(`=== cancelPurchase called with id: ${req.params.id} ===`);
      await PurchaseService.cancelPurchase(req.params.id);
      return res.redirect('/purchases');
    } catch (error) {
      console.error('cancelPurchase error:', error);
      return res.status(500).render('error', {
        title: 'Error',
        message: error.message || 'Failed to cancel purchase',
        statusCode: 500
      });
    }
  }

  static async deletePurchase(req, res) {
    try {
      console.log(`=== deletePurchase called with id: ${req.params.id} ===`);
      await PurchaseService.deletePurchase(req.params.id);
      return res.redirect('/purchases');
    } catch (error) {
      console.error('deletePurchase error:', error);
      return res.status(500).render('error', {
        title: 'Error',
        message: error.message || 'Failed to delete purchase',
        statusCode: 500
      });
    }
  }

  static async showCreateForm(req, res) {
    try {
      console.log('=== showCreateForm called ===');
      console.log('Fetching products from database...');
      
      const products = await ProductService.getAllProducts();
      console.log(`Found ${products ? products.length : 0} products`);
      
      if (!products || products.length === 0) {
        console.log('⚠️ No products found in database!');
      }
      
      return res.render('purchases/form', {
        title: 'New Purchase',
        currentPage: 'purchases',
        products: products || [],
        purchase: null,
        error: null,
        action: '/purchases',
        method: 'POST'
      });
    } catch (error) {
      console.error('❌ showCreateForm error:', error);
      console.error('Error stack:', error.stack);
      
      return res.status(500).render('error', {
        title: 'Error',
        message: error.message || 'Failed to load form',
        statusCode: 500
      });
    }
  }
}

module.exports = PurchaseController;