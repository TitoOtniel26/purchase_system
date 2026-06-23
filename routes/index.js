const express = require('express');
const dashboardRoutes = require('./dashboardRoutes');
const productRoutes = require('./productRoutes');
const purchaseRoutes = require('./purchaseRoutes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
router.use('/', dashboardRoutes);
router.use('/products', productRoutes);
router.use('/purchases', purchaseRoutes);

// 404 handler
router.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    statusCode: 404
  });
});

module.exports = router;