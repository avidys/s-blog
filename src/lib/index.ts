// Reexport your entry components here
export { default as Blog } from './Blog.svelte';
export { default as BlogPost } from './BlogPost.svelte';
export { default as BlogSeoPage } from './BlogSeoPage.svelte';
export { markdownMetadataPlugin } from './md2html.js';

// Theme management
export { themeStore, themeActions } from './themeStore.js';

// SEO utilities
//export * from './seo/index.js';

// SEO utilities for SvelteKit integration
export { createRobotsHandler } from './seo/robots.js';
export { createSitemapHandler } from './seo/sitemap.js';

// Re-export types that might be needed
export type { RequestHandler } from '@sveltejs/kit';