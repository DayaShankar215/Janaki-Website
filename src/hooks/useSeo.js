import { useEffect } from 'react';
import { siteConfig } from '@/config/siteConfig';

function setMeta(attr, tagName, content) {
  let el = document.head.querySelector(`meta[${attr}="${tagName}"], meta[name="${tagName}"]`);
  if (!el) {
    el = document.createElement('meta');
    document.head.appendChild(el);
  }
  el.setAttribute(attr, tagName);
  el.content = content;
}

/** Lightweight per-page SEO: updates <title> + meta description. */
export function useSeo(title, description) {
  useEffect(() => {
    const prev = document.title;

    if (title) {
      document.title = `${title} | ${siteConfig.shortName}`;
      setMeta('property', 'og:title', `${title} | ${siteConfig.shortName}`);
    } else {
      document.title = siteConfig.defaultTitle;
    }

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
    }

    return () => {
      document.title = prev;
    };
  }, [title, description]);
}
