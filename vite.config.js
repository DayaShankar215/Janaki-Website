import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Hosting-support files injected into dist/ at build time, because most
 * of these cannot live in public/ or are host-specific:
 *
 *  - `.htaccess` : Apache/cPanel SPA fallback + HTTPS (Vite skips dotfiles in public/)
 *  - `404.html`  : GitHub Pages has no URL rewrites; serving a copy of
 *                  index.html for 404s boots the router, so deep links
 *                  like /courses/... load correctly.
 */
const apacheSpaConfig = `# -------------------------------------------------------------------
# Janaki Technical Training Center - Apache hosting config
# Serves the built site in public_html and keeps React Router paths working.
# -------------------------------------------------------------------
Options -MultiViews
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# SPA routing: any non-file/non-folder request is handled by index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Custom error document as well (served for broken links)
ErrorDocument 404 /index.html

# Basic caching for static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType image/svg+xml "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType text/css "access plus 1 week"
  ExpiresByType application/javascript "access plus 1 week"
</IfModule>`;

function emitHostingFiles() {
  let outDir = 'dist';
  return {
    name: 'emit-hosting-files',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      writeFileSync(resolve(outDir, '.htaccess'), apacheSpaConfig, 'utf8');
      const html = readFileSync(resolve(outDir, 'index.html'), 'utf8');
      writeFileSync(resolve(outDir, '404.html'), html, 'utf8');
    },
  };
}

export default defineConfig({
  plugins: [react(), emitHostingFiles()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2018',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          animation: ['framer-motion'],
        },
      },
    },
  },
});
