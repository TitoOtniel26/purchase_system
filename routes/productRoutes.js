const express = require('express');
const ProductController = require('../controllers/ProductController');
const { validateProductInput } = require('../middleware/validation');

const router = express.Router();

// Routes - ORDER MATTERS!
router.get('/', ProductController.listProducts);
router.get('/new', ProductController.showCreateForm);
router.get('/:id/edit', ProductController.showEditForm);
router.get('/:id', ProductController.showProduct);

// Create - POST
router.post('/', validateProductInput, ProductController.createProduct);

// Update - Gunakan POST dengan _method=PUT
router.post('/:id', validateProductInput, ProductController.updateProduct);

// Delete - Gunakan POST dengan _method=DELETE
router.post('/:id/delete', ProductController.deleteProduct);

// Alternative: Gunakan route PUT jika method-override berfungsi
router.put('/:id', validateProductInput, ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;