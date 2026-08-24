import type { LucideIcon } from 'lucide-react';
import { getIcon } from '@/config/icons';

interface DynamicIconProps {
  name: string;
  className?: string;
  strokeWidth?: number;
}

/** Renders a Lucide icon by its string name from the registry. */
export function DynamicIcon({ name, className, strokeWidth = 2 }: DynamicIconProps) {
  const Icon = getIcon(name) as LucideIcon;
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
