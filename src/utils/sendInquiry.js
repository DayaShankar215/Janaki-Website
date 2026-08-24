import emailjs from '@emailjs/browser';

// Credentials come from environment variables (.env) — never hard-coded.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/** True when the owner has configured the .env file for EmailJS. */
export function emailjsConfigured() {
  return Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
}

/**
 * Sends an inquiry through EmailJS.
 * Returns { demo: true } when credentials are not yet configured,
 * simulating a successful send so the site can be tested locally.
 */
export async function sendInquiry(templateParams) {
  if (!emailjsConfigured()) {
    console.info(
      '[EmailJS] Not configured yet. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY to a .env file to send real emails.'
    );
    await new Promise((resolve) => setTimeout(resolve, 1100));
    return { demo: true };
  }

  await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
    publicKey: PUBLIC_KEY,
  });

  return { demo: false };
}
