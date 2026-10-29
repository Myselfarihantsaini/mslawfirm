import {practices, draftArticles} from './content';

export default function sitemap() {
  const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://msadvocates.co.in';
  const base = domain.replace(/\/$/, '');
  const pages = [
    '',
    '/about',
    '/practice-areas',
    '/legal-knowledge',
    '/judgments',
    '/contact',
    '/privacy-policy',
    '/legal-disclaimer',
    ...practices.map(p => '/' + p.slug),
    ...draftArticles.map(a => '/' + a.slug)
  ];
  return pages.map(path => ({
    url: `${base}${path}/`,
    lastModified: new Date()
  }));
}
