/**
 * Email validation
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email) => {
  // Simple email validation - contains @ and at least one dot after @
  if (!email) return false;
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  return local.length > 0 && domain.includes('.') && domain.split('.').every(part => part.length > 0);
};

/**
 * Password validation
 * @param {string} password - The password to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain an uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain a lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain a number' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Form validation
 * @param {Object} values - The form values
 * @param {Object} rules - The validation rules
 * @returns {Object} Validation errors
 */
export const validateForm = (values, rules) => {
  const errors = {};
  
  for (const field in rules) {
    if (Object.prototype.hasOwnProperty.call(rules, field)) {
      const value = values[field];
      const fieldRules = rules[field];
      
      // Required validation
      if (fieldRules.required && !value) {
        errors[field] = `${fieldRules.label || field} is required`;
        continue;
      }
      
      // Email validation
      if (fieldRules.isEmail && value && !isValidEmail(value)) {
        errors[field] = `Please enter a valid email address`;
        continue;
      }
      
      // Min length validation
      if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
        errors[field] = `${fieldRules.label || field} must be at least ${fieldRules.minLength} characters`;
        continue;
      }
      
      // Max length validation
      if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
        errors[field] = `${fieldRules.label || field} must be less than ${fieldRules.maxLength} characters`;
        continue;
      }
      
      // Custom validation
      if (fieldRules.validate && typeof fieldRules.validate === 'function') {
        const error = fieldRules.validate(value, values);
        if (error) {
          errors[field] = error;
        }
      }
    }
  }
  
  return errors;
};