import { useEffect } from 'react';
import { siteConfig } from '@/config/siteConfig';

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Lightweight per-page SEO: updates <title> + meta description. */
export function useSeo(title, description) {
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
  }, [title, description]);
}
