/**
 * Renders a JSON-LD structured-data block (Google reads it anywhere in the
 * document). Use for Organization/Course/FAQPage schema.
 */
export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** EducationalOrganization schema generated from the site config. */
export function organizationSchema(siteConfig) {
  const sameAs = Object.values(siteConfig.socialLinks || {}).filter(Boolean);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/favicon.svg`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: `+${(siteConfig.phone || '').replace(/\D/g, '')}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address || undefined,
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
  if (Array.isArray(schema.sameAs) && schema.sameAs.length === 0) delete schema.sameAs;
  return schema;
}