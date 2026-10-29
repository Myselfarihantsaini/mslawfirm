export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/']
    },
    sitemap: 'https://msadvocates.co.in/sitemap.xml'
  };
}

