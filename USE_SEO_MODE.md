# Using useSeoMode Property

The `useSeoMode` property enables SEO-friendly navigation by using proper URL routing instead of SPA behavior.

## Setup

### 1. Install the Package

```bash
npm install @avidys/s-blog
```

### 2. Create SEO Routes

In your SvelteKit app, create the following route files:

#### `src/routes/robots.txt/+server.ts`

```typescript
import { createRobotsHandler } from '@avidys/s-blog';

export const GET = createRobotsHandler('https://your-domain.com');
```

#### `src/routes/sitemap.xml/+server.ts`

```typescript
import { createSitemapHandler } from '@avidys/s-blog';

export const GET = createSitemapHandler('https://your-domain.com', 'data');
```

### 3. Add Component to your route

```svelte
<script>
  import { Blog } from '@avidys/s-blog';
</script>

<!-- SEO Mode: Navigates to /blog/slug -->
<Blog useSeoMode={true} />

<!-- Default SPA Mode: Shows post inline -->
<Blog useSeoMode={false} />
```

### Complete Example

```svelte
<script>
  import { Blog } from '@avidys/s-blog';
</script>

<Blog 
  useSeoMode={true}
  theme="dark"
  showReadMoreButton={true}
  showSearch={true}
  showCategories={true}
  showAuthor={true}
  showDate={true}
  showDescription={true}
/>
```

## Behavior

### When `useSeoMode={true}`:

- Clicking "Read More" navigates to `/blog/{slug}`
- Each blog post gets its own URL
- Better for SEO and social sharing
- Requires individual blog post routes to be set up

### When `useSeoMode={false}` (default):

- Clicking "Read More" shows the post inline
- Single-page application behavior
- No additional routes needed
- Faster navigation within the blog


## API Reference

### `createRobotsHandler(siteUrl: string)`

Creates a robots.txt handler for your SvelteKit app.

**Parameters:**
- `siteUrl` - The base URL of your site (e.g., 'https://example.com')

**Returns:** SvelteKit RequestHandler

### `createSitemapHandler(siteUrl: string, dataPath?: string)`

Creates a sitemap.xml handler for your SvelteKit app.

**Parameters:**
- `siteUrl` - The base URL of your site (e.g., 'https://example.com')
- `dataPath` - Path to the blog data (default: 'data')

**Returns:** SvelteKit RequestHandler

## Environment Variables

You can use environment variables for configuration:

```env
SITE_URL=https://your-domain.com
BLOG_DATA_PATH=static/data
```

Then in your route files:

```typescript
import { createSitemapHandler } from '@avidys/s-blog';

export const GET = createSitemapHandler(
  process.env.SITE_URL!,
  process.env.BLOG_DATA_PATH || 'data'
);
```

## Features

- **Automatic sitemap generation** from blog post metadata
- **SEO-friendly robots.txt** with sitemap reference
- **Configurable data paths** for different deployment setups
- **Proper caching headers** for optimal performance
- **Error handling** for missing data files

## Benefits

- **SEO Friendly**: Each post has its own URL
- **Social Sharing**: Proper URLs for sharing on social media
- **Browser History**: Back/forward buttons work correctly
- **Bookmarkable**: Users can bookmark individual posts
- **Analytics**: Better tracking of individual post views
