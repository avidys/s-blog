import type { RequestHandler } from '@sveltejs/kit';

/**
 * Creates a robots.txt handler for SvelteKit
 * @param siteUrl - The base URL of your site (e.g., 'https://example.com')
 * @returns SvelteKit RequestHandler for robots.txt
 */
export function createRobotsHandler(siteUrl: string): RequestHandler {
  return async () => {
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`;

    return new Response(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  };
}
