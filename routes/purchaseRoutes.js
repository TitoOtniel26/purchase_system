const express = require('express');
const PurchaseController = require('../controllers/PurchaseController');

const router = express.Router();

// Routes - ORDER MATTERS!
router.get('/', PurchaseController.listPurchases);
router.get('/new', PurchaseController.showCreateForm);
router.get('/:id', PurchaseController.showPurchase);

// Actions - Tanpa middleware validasi
router.post('/', PurchaseController.createPurchase);
router.put('/:id/cancel', PurchaseController.cancelPurchase);
router.delete('/:id', PurchaseController.deletePurchase);

module.exports = router;