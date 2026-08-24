// Simple, dependency-free validation helpers used by the inquiry form.

export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return /^\+?[\d\s\-()]{7,15}$/.test(value.trim());
}
