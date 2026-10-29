import {practices} from './content';
export default function sitemap(){const domain=process.env.NEXT_PUBLIC_SITE_URL;if(!domain)return [];return ['','/about','/practice-areas','/legal-knowledge','/judgments','/contact','/privacy-policy','/legal-disclaimer',...practices.map(p=>'/'+p.slug)].map(path=>({url:domain.replace(/\/$/,'')+path}));}
