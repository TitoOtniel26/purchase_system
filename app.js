const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

class App {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupViews();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // Security
    this.app.use(helmet({
      contentSecurityPolicy: false,
    }));
    this.app.use(cors());
    
    // Compression
    this.app.use(compression());
    
    // Body parsing
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    
    // Method override - dengan query parameter sebagai fallback
    this.app.use(methodOverride('_method'));
    this.app.use(methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
      }
    }));
    
    // Static files
    this.app.use(express.static(path.join(__dirname, 'public')));
    
    // Logging middleware
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.url}`);
      next();
    });
  }

  setupViews() {
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, 'views'));
  }

  setupRoutes() {
    this.app.use('/', routes);
  }

  setupErrorHandling() {
    this.app.use(errorHandler);
  }

  getApp() {
    return this.app;
  }
}

module.exports = new App().getApp();