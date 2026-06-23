const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/`);
  console.log(`📦 Products: http://localhost:${PORT}/products`);
  console.log(`🛒 Purchases: http://localhost:${PORT}/purchases`);
  console.log(`➕ New Purchase: http://localhost:${PORT}/purchases/new`);
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});