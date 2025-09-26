// Email validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Password validation (min 8 chars, at least one number and one letter)
export const validatePassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
};

// Phone number validation (basic format)
export const validatePhone = (phone) => {
  const re = /^\+?[\d\s-]{10,}$/;
  return re.test(phone);
};

// Required field validation
export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

// Number validation
export const validateNumber = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

// Date validation
export const validateDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

// URL validation
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Form validation helper
export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = values[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = 'This field is required';
    } else if (value) {
      if (fieldRules.email && !validateEmail(value)) {
        errors[field] = 'Invalid email format';
      }
      if (fieldRules.password && !validatePassword(value)) {
        errors[field] = 'Password must be at least 8 characters with one number and one letter';
      }
      if (fieldRules.phone && !validatePhone(value)) {
        errors[field] = 'Invalid phone number format';
      }
      if (fieldRules.number && !validateNumber(value)) {
        errors[field] = 'Must be a valid number';
      }
      if (fieldRules.date && !validateDate(value)) {
        errors[field] = 'Must be a valid date';
      }
      if (fieldRules.url && !validateUrl(value)) {
        errors[field] = 'Must be a valid URL';
      }
    }
  });
  
  return errors;
}; 