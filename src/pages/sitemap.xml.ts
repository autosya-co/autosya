import type { APIRoute } from 'astro';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const GET: APIRoute = async () => {
  const baseUrl = 'https://autosya.co';
  const slugify = (t: any) =>
    t
      ? t
          .toString()
          .toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
      : 'auto';

  let vehicleUrls: string[] = [];
  try {
    const snapshot = await getDocs(collection(db, 'toyotausados'));
    vehicleUrls = snapshot.docs
      .map((doc) => doc.data())
      .filter((carro: any) => carro.ID && carro.publicado !== false)
      .map(
        (carro: any) =>
          `${baseUrl}/${carro.ID}/${slugify(carro.Title || carro.titulo || 'auto')}`
      );
  } catch (e) {
    console.error('Error generando sitemap:', e);
  }

  const staticUrls = [`${baseUrl}/`];
  const allUrls = [...staticUrls, ...vehicleUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>daily</changefreq>
    <priority>${url === `${baseUrl}/` ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
