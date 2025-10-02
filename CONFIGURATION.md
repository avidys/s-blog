# Blog Configuration

This blog system supports configuration through environment variables and a centralized config file.

## Configuration File

The main configuration is located in `src/lib/config.ts`. This file contains default values and can be overridden with environment variables.

## Environment Variables

Create a `.env` file in your project root to customize the blog settings:

```env
# Site Information
VITE_SITE_NAME="My Awesome Blog"
VITE_SITE_DESCRIPTION="Latest blog posts and articles about technology"
VITE_SITE_URL="https://myblog.com"

# Social Media
VITE_TWITTER_SITE="@myblog"
VITE_TWITTER_CREATOR="@myhandle"

# Images
VITE_DEFAULT_IMAGE="/blog-banner.webp"
VITE_TWITTER_IMAGE="/blog-banner.webp"
```

## Configuration Options

### Site Information
- `VITE_SITE_NAME`: The name of your blog (used in titles and meta tags)
- `VITE_SITE_DESCRIPTION`: Default description for your blog
- `VITE_SITE_URL`: Your blog's URL (for canonical links and Open Graph)

### Social Media
- `VITE_TWITTER_SITE`: Your blog's Twitter handle (e.g., @myblog)
- `VITE_TWITTER_CREATOR`: Your personal Twitter handle (e.g., @myhandle)

### Images
- `VITE_DEFAULT_IMAGE`: Default image for Open Graph and social sharing
- `VITE_TWITTER_IMAGE`: Specific image for Twitter cards

## Default Values

If no environment variables are set, the following defaults are used:

```typescript
{
  twitter: {
    site: '@McBride1105',
    creator: '@McBride1105'
  },
  site: {
    name: 'Blog',
    description: 'Latest blog posts and articles',
    url: 'https://your-domain.com'
  },
  images: {
    default: '/blog-banner.webp',
    twitter: '/blog-banner.webp'
  }
}
```

## Usage in Components

The configuration is automatically imported and used in:

- `BlogPost.svelte` - For individual post meta tags
- `/blog` route - For blog listing page meta tags
- `/blog/[slug]` route - For individual post pages

## SEO Features

The configuration is used for:

- Page titles and meta descriptions
- Open Graph tags for social sharing
- Twitter Card metadata
- Canonical URLs
- Site name in various meta tags

## Customization

To add new configuration options:

1. Add the option to `src/lib/config.ts`
2. Add the corresponding environment variable
3. Use the configuration in your components
4. Update this documentation

## Example

```typescript
// In src/lib/config.ts
export const blogConfig = {
  // ... existing config
  custom: {
    analyticsId: import.meta.env.VITE_ANALYTICS_ID || '',
    contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'contact@example.com'
  }
};
```
