// utils/validator.js
const validateProduct = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Product name is required');
  }
  
  if (!data.price || isNaN(data.price) || data.price <= 0) {
    errors.push('Price must be a positive number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validatePurchase = (data) => {
  const errors = [];
  
  console.log('Validating purchase data:', data); // Debug log
  
  if (!data.product_id || data.product_id === '') {
    errors.push('Product ID is required');
  }
  
  if (!data.quantity || isNaN(data.quantity) || data.quantity <= 0) {
    errors.push('Quantity must be a positive number');
  }
  
  if (!data.admin_name || data.admin_name.trim().length === 0) {
    errors.push('Admin name is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateProduct,
  validatePurchase
};