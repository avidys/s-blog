import type { RequestHandler } from '@sveltejs/kit';
import type { IBlogPost } from '../types.js';

/**
 * Creates a sitemap.xml handler for SvelteKit
 * @param siteUrl - The base URL of your site (e.g., 'https://example.com')
 * @param dataPath - Path to the blog data (default: 'data')
 * @returns SvelteKit RequestHandler for sitemap.xml
 */
export function createSitemapHandler(siteUrl: string, dataPath: string = 'data'): RequestHandler {
  return async ({ url }) => {
    try {
      // Fetch blog posts metadata
      const metadataResponse = await fetch(`${url.origin}/${dataPath}/postsMetadata.json`);
      
      if (!metadataResponse.ok) {
        throw new Error(`Failed to fetch blog metadata: ${metadataResponse.status}`);
      }
      
      const metadata = await metadataResponse.json();
      const posts: IBlogPost[] = Object.values(metadata);
      
      // Generate sitemap XML
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  ${posts.map((post: IBlogPost) => `
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updated || post.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

      return new Response(sitemap, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    } catch (error) {
      console.error('Error generating sitemap:', error);
      return new Response('Error generating sitemap', { status: 500 });
    }
  };
}
