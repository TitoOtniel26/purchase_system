const PurchaseService = require('../services/PurchaseService');
const logger = require('../utils/logger');

class DashboardController {
  static async showDashboard(req, res, next) {
    try {
      logger.info('Loading dashboard');
      const stats = await PurchaseService.getDashboardStats();
      
      res.render('dashboard/index', {
        title: 'Dashboard',
        currentPage: 'dashboard',
        stats: stats || {
          totalProducts: 0,
          totalPurchases: 0,
          totalStock: 0,
          totalValue: 0,
          recentPurchases: [],
          purchaseSummary: []
        },
        recentPurchases: stats?.recentPurchases || [],
        purchaseSummary: stats?.purchaseSummary || []
      });
    } catch (error) {
      logger.error('Dashboard error:', error);
      next(error);
    }
  }
}

module.exports = DashboardController;