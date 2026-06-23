const ProductService = require('../services/ProductService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

class ProductController {
  static async listProducts(req, res, next) {
    try {
      const products = await ProductService.getAllProducts();
      
      res.render('products/index', {
        title: 'Products',
        currentPage: 'products',
        products: products || []
      });
    } catch (error) {
      logger.error('Products list error:', error);
      next(error);
    }
  }

  static async showProduct(req, res, next) {
    try {
      const product = await ProductService.getProductWithStock(req.params.id);
      
      if (!product) {
        throw new AppError('Product not found', 404);
      }
      
      res.render('products/show', {
        title: product.name,
        currentPage: 'products',
        product
      });
    } catch (error) {
      logger.error('Product show error:', error);
      next(error);
    }
  }

  static async createProduct(req, res, next) {
    try {
      logger.info('Creating product with data:', req.body);
      await ProductService.createProduct(req.body);
      res.redirect('/products');
    } catch (error) {
      logger.error('Product creation error:', error);
      
      if (error.statusCode === 400) {
        return res.render('products/form', {
          title: 'Create Product',
          currentPage: 'products',
          product: req.body,
          action: '/products',
          method: 'POST',
          error: error.message
        });
      }
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const productId = req.params.id;
      logger.info(`Updating product ${productId} with data:`, req.body);
      
      await ProductService.updateProduct(productId, req.body);
      res.redirect('/products');
    } catch (error) {
      logger.error(`Product update error for ${req.params.id}:`, error);
      
      if (error.statusCode === 400) {
        const product = await ProductService.getProductById(req.params.id);
        return res.render('products/form', {
          title: 'Edit Product',
          currentPage: 'products',
          product: product || req.body,
          action: `/products/${req.params.id}`,
          method: 'PUT',
          error: error.message
        });
      }
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const productId = req.params.id;
      logger.info(`Deleting product: ${productId}`);
      
      await ProductService.deleteProduct(productId);
      res.redirect('/products');
    } catch (error) {
      logger.error(`Product deletion error for ${req.params.id}:`, error);
      next(error);
    }
  }

  static async showCreateForm(req, res, next) {
    try {
      res.render('products/form', {
        title: 'Create Product',
        currentPage: 'products',
        product: null,
        action: '/products',
        method: 'POST',
        error: null
      });
    } catch (error) {
      logger.error('Create form error:', error);
      next(error);
    }
  }

  static async showEditForm(req, res, next) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      
      if (!product) {
        throw new AppError('Product not found', 404);
      }
      
      res.render('products/form', {
        title: 'Edit Product',
        currentPage: 'products',
        product,
        action: `/products/${req.params.id}`,
        method: 'PUT',
        error: null
      });
    } catch (error) {
      logger.error('Edit form error:', error);
      next(error);
    }
  }
}

module.exports = ProductController;