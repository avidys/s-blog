# Component Usage Guide

This package provides several components for building blog functionality in SvelteKit applications.

## Available Components

### 1. Blog Component
Main blog listing component with filtering and search capabilities.

```svelte
<script>
  import { Blog } from '@avidys/s-blog';
</script>

<Blog 
  theme="dark"
  showReadMoreButton={true}
  useSeoMode={true}
  showSearch={true}
  showCategories={true}
  showAuthor={true}
  showDate={true}
  showDescription={true}
/>
```

### 2. BlogPost Component
Individual blog post display component with SEO meta tags.

```svelte
<script>
  import { BlogPost } from '@avidys/s-blog';
  import type { IBlogPost } from '@avidys/s-blog';

  let post: IBlogPost = {
    slug: 'my-post',
    title: 'My Blog Post',
    author: 'John Doe',
    date: '2024-01-01',
    content: '<p>Post content here...</p>',
    categories: ['tech', 'tutorial']
  };
</script>

<BlogPost 
  {post}
  onAuthorClick={(author) => console.log('Author clicked:', author)}
  onCategoryClick={(category) => console.log('Category clicked:', category)}
/>
```

### 3. BlogSeoPage Component
Complete SEO-optimized blog post page component for individual post routes.

```svelte
<script>
  import { BlogSeoPage } from '@avidys/s-blog';
  import { page } from '$app/stores';

  // Get slug from URL parameters
  $: slug = $page.params.slug;
</script>

<BlogSeoPage 
  slug={slug}
  dataPath="data"
/>
```

## Route Setup Examples

### Blog Listing Page (`/blog/+page.svelte`)

```svelte
<script>
  import { Blog } from '@avidys/s-blog';
</script>

<svelte:head>
  <title>My Blog - Latest Posts</title>
  <meta name="description" content="Latest blog posts and articles" />
</svelte:head>

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

### Individual Blog Post Page (`/blog/[slug]/+page.svelte`)

```svelte
<script>
  import { BlogSeoPage } from '@avidys/s-blog';
  import { page } from '$app/stores';

  $: slug = $page.params.slug;
</script>

<BlogSeoPage 
  slug={slug}
  dataPath="data"
/>
```

### Custom Blog Post Page

If you need more control, you can use the `BlogPost` component directly:

```svelte
<script>
  import { BlogPost } from '@avidys/s-blog';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { IBlogPost } from '@avidys/s-blog';

  let post: IBlogPost | null = $state(null);
  let loading = $state(true);

  $effect(() => {
    const slug = $page.params.slug;
    if (slug) {
      loadPost(slug);
    }
  });

  async function loadPost(slug: string) {
    try {
      const response = await fetch(`/data/postsMetadata.json`);
      const metadata = await response.json();
      const postData = metadata[slug];
      
      if (!postData) {
        goto('/blog');
        return;
      }
      
      const contentResponse = await fetch(`/posts/${slug}.html`);
      const content = await contentResponse.text();
      
      post = { ...postData, slug, content };
      loading = false;
    } catch (error) {
      console.error('Error loading post:', error);
      goto('/blog');
    }
  }
</script>

{#if loading}
  <div>Loading...</div>
{:else if post}
  <BlogPost 
    {post}
    onAuthorClick={(author) => goto(`/blog?author=${author}`)}
    onCategoryClick={(category) => goto(`/blog?category=${category}`)}
  />
  <button onclick={() => goto('/blog')}>← Back to Blog</button>
{:else}
  <div>Post not found</div>
{/if}
```

## Component Props

### Blog Component
- `theme?: 'light' | 'dark'` - Theme selection
- `customColors?: ThemeColors` - Custom color scheme
- `dataPath?: string` - Path to blog data (default: 'data')
- `showReadMoreButton?: boolean` - Show read more buttons (default: true)
- `numberOfPosts?: number` - Limit number of posts (default: Infinity)
- `showSearch?: boolean` - Show search functionality (default: true)
- `showCategories?: boolean` - Show category filters (default: true)
- `showYears?: boolean` - Show year filters (default: true)
- `showAuthor?: boolean` - Show author filters (default: true)
- `showDate?: boolean` - Show post dates (default: true)
- `showDescription?: boolean` - Show post descriptions (default: true)
- `useSeoMode?: boolean` - Use SEO navigation instead of SPA (default: false)

### BlogPost Component
- `post: IBlogPost` - The blog post object
- `onAuthorClick?: (author: string) => void` - Author click handler
- `onCategoryClick?: (category: string) => void` - Category click handler

### BlogSeoPage Component
- `slug: string` - The blog post slug to load
- `dataPath?: string` - Path to blog data (default: 'data')

## Data Structure

The components expect blog data in the following format:

```typescript
interface IBlogPost {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  author: string;
  categories?: string[];
  displayCategories?: string[];
  date: string;
  updated?: string;
  content?: string;
  image?: string;
  published?: boolean;
}
```

## SEO Features

- **Automatic meta tags** - BlogPost and BlogSeoPage handle SEO meta tags
- **Open Graph support** - Social media sharing optimization
- **Twitter Cards** - Twitter-specific meta tags
- **Structured data** - Article-specific metadata
- **Canonical URLs** - Proper URL structure for SEO

## Styling

Components use CSS custom properties for theming. You can override these in your app:

```css
:root {
  --text-body-color: #333;
  --text-subtitle-color: #666;
  --text-title-color: #000;
  --background-color: #fff;
  --card-background: #f8f9fa;
  --border-color: #e0e4e8;
  --button-background-color: #007bff;
  --button-border-color: #0056b3;
  --link-color: #007bff;
  --link-hover-color: #0056b3;
}
```
