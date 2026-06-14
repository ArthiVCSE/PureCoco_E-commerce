export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Include at least one uppercase letter');
  if (!/[0-9]/.test(password)) errors.push('Include at least one number');
  return { isValid: errors.length === 0, errors };
};

export const validatePhone = (phone) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || !value.toString().trim()) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validatePincode = (pincode) => {
  const regex = /^[1-9][0-9]{5}$/;
  return regex.test(pincode);
};

export const validateCheckoutForm = (form) => {
  const errors = {};
  if (!form.fullName?.trim()) errors.fullName = 'Full name is required';
  if (!validateEmail(form.email)) errors.email = 'Valid email is required';
  if (!validatePhone(form.phone)) errors.phone = 'Valid 10-digit phone required';
  if (!form.address?.trim()) errors.address = 'Address is required';
  if (!form.city?.trim()) errors.city = 'City is required';
  if (!validatePincode(form.pincode)) errors.pincode = 'Valid 6-digit pincode required';
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateLoginForm = (form) => {
  const errors = {};
  if (!validateEmail(form.email)) errors.email = 'Valid email is required';
  if (!form.password) errors.password = 'Password is required';
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateRegisterForm = (form) => {
  const errors = {};
  if (!form.name?.trim()) errors.name = 'Name is required';
  if (!validateEmail(form.email)) errors.email = 'Valid email is required';
  const pwCheck = validatePassword(form.password);
  if (!pwCheck.isValid) errors.password = pwCheck.errors[0];
  if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return { isValid: Object.keys(errors).length === 0, errors };
};
