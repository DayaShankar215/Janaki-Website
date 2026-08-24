import type { Category } from '@/types';

// Training categories. Courses reference these by `categoryId`.
// To add a category: add an object here and give it a unique id.
export const categories: Category[] = [
  { id: 'electrical', label: 'Electrical', icon: 'zap' },
  { id: 'plumbing', label: 'Plumbing', icon: 'droplets' },
  { id: 'construction', label: 'Construction', icon: 'construction' },
  { id: 'mechanical', label: 'Mechanical', icon: 'cog' },
  { id: 'computer', label: 'Computer & Technology', icon: 'monitor' },
  { id: 'hospitality', label: 'Hospitality', icon: 'chef-hat' },
  { id: 'beauty', label: 'Beauty & Personal Care', icon: 'sparkles' },
  { id: 'agriculture', label: 'Agriculture', icon: 'sprout' },
  { id: 'tailoring', label: 'Tailoring & Garment', icon: 'scissors' },
];

export function getCategoryLabel(id: string): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}

export function getCategoryIcon(id: string): string {
  return categories.find((c) => c.id === id)?.icon ?? 'book-open';
}
