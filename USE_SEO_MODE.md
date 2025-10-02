# Using useSeoMode Property

The `useSeoMode` property enables SEO-friendly navigation by using proper URL routing instead of SPA behavior.

## Usage

### Basic Example

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
  customColors={{
    textBodyColor: 'var(--fg-1)',
    textSubtitleColor: 'var(--fg-2)',
    textTitleColor: 'var(--fg-3)',
    backgroundColor: 'var(--bg-0)',
    cardBackgroundColor: 'var(--bg-1)',
    borderColor: 'var(--bg-2)',
    buttonBackgroundColor: 'var(--color-logo)',
    buttonBorderColor: 'var(--color-logo-hover)',
    linkColor: 'var(--accent-1)',
    linkHoverColor: 'var(--accent-2)'
  }}
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

## Requirements for SEO Mode

When using `useSeoMode={true}`, you need to set up the individual blog post route:

```typescript
// src/routes/blog/[slug]/+page.svelte
<script>
  import { Blog } from '@avidys/s-blog';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let selectedSlug = $state('');
  let selectedPost = $state(null);
  let isLoading = $state(true);

  $effect(() => {
    selectedSlug = $page.params.slug || '';
    if (selectedSlug) {
      loadPostBySlug(selectedSlug);
    }
  });

  async function loadPostBySlug(slug: string) {
    try {
      const response = await fetch('/data/postsMetadata.json');
      if (!response.ok) throw new Error('Failed to fetch posts metadata');
      
      const postsMetadata = await response.json();
      const postData = postsMetadata[slug];
      
      if (!postData) {
        goto('/blog');
        return;
      }
      
      const contentResponse = await fetch(`/posts/${slug}.html`);
      if (!contentResponse.ok) throw new Error('Failed to fetch post content');
      
      const content = await contentResponse.text();
      
      selectedPost = {
        ...postData,
        slug: slug,
        content: content
      };
      
      isLoading = false;
    } catch (error) {
      console.error('Error loading post:', error);
      goto('/blog');
    }
  }
</script>

{#if isLoading}
  <div class="loading">Loading post...</div>
{:else if selectedPost}
  <article class="blog-post">
    <h1>{selectedPost.title}</h1>
    {#if selectedPost.subtitle}
      <p class="subtitle">{selectedPost.subtitle}</p>
    {/if}
    <div class="post-meta">
      <span>By {selectedPost.author}</span>
      <span>on {selectedPost.date}</span>
    </div>
    <div class="post-content">
      {@html selectedPost.content}
    </div>
  </article>
  <div class="back-button">
    <button onclick={() => goto('/blog')}>← Back to Blog</button>
  </div>
{:else}
  <div class="error">
    <h1>Post Not Found</h1>
    <button onclick={() => goto('/blog')}>← Back to Blog</button>
  </div>
{/if}
```

## Benefits

- **SEO Friendly**: Each post has its own URL
- **Social Sharing**: Proper URLs for sharing on social media
- **Browser History**: Back/forward buttons work correctly
- **Bookmarkable**: Users can bookmark individual posts
- **Analytics**: Better tracking of individual post views
