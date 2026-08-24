import { getIcon } from '@/config/icons';

/** Renders a Lucide icon by its string name from the registry. */
export function DynamicIcon({ name, className, strokeWidth = 2 }) {
  const Icon = getIcon(name);
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
