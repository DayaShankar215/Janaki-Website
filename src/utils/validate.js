// Simple, dependency-free validation helpers used by the inquiry form.

export function isNotEmpty(value) {
  return value.trim().length > 0;
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function isValidPhone(value) {
  return /^\+?[\d\s\-()]{7,15}$/.test(value.trim());
}
