import Joi from 'joi';

// Joi schemas
export const registerSchema = Joi.object({
  name: Joi.string().min(2).required() 
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name should be at least 3 characters',
      'string.max': 'Name should not exceed 30 characters'
    }),
  email: Joi.string().email({ tlds: { allow: false } }).required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email'
    }),
    password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'))
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number (no special characters)'
    }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your password'
    })
});

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email'
    }),
  password: Joi.string().required()
    .messages({
      'string.empty': 'Password is required'
    })
});

// Password strength calculator
export const calculatePasswordStrength = (password) => {
  if (!password) return 0;
  
  let strength = 0;
  // Length contributes up to 40%
  strength += Math.min(password.length / 20 * 40, 40);
  
  // Character variety contributes up to 60%
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  
  const varietyCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  strength += (varietyCount / 4) * 60;
  
  return Math.min(Math.round(strength), 100);
};

export const getPasswordStrengthLabel = (strength) => {
  if (strength < 40) return 'Weak';
  if (strength < 70) return 'Moderate';
  if (strength < 90) return 'Strong';
  return 'Very Strong';
};