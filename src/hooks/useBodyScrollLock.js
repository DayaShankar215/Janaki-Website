import { useEffect } from 'react';

/** Locks body scroll while a modal / mobile menu is open. */
export function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}
