export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validateNIF = (nif: string): boolean => {
  if (nif.length !== 14) return false;
  return true;
};

export const validatePassword = (password: string): boolean => {
  if (password.length < 8) return false;
  return true;
};

export const validateName = (name: string): boolean => {
  if (name.length < 3) return false;
  return true;
};
