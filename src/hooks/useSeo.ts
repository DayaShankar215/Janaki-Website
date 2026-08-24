import { useEffect } from 'react';
import { siteConfig } from '@/config/siteConfig';

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Lightweight per-page SEO: updates <title> + meta description.
 */
export function useSeo(title?: string, description?: string) {
  useEffect(() => {
    const prev = document.title;

    if (title) {
      document.title = `${title} | ${siteConfig.shortName}`;
      setMeta('og:title', `${title} | ${siteConfig.shortName}`);
    } else {
      document.title = siteConfig.defaultTitle;
    }

    if (description) {
      setMeta('description', description);
      setMeta('og:description', description);
    }

    return () => {
      document.title = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description]);
}
