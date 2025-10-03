<!--
  @component BlogSeoPage
  @description SEO-optimized individual blog post page component for use in SvelteKit apps.
                This component handles loading a blog post by slug and displays it with proper SEO meta tags.
  
  @prop {string} slug - The blog post slug to load
  @prop {string} dataPath - Path to the blog data (default: 'data')
  
  @example
  ```svelte
  <BlogSeoPage slug="my-blog-post" dataPath="data" />
  ```
-->

<script lang="ts">
  import BlogPost from './BlogPost.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { themeStore } from './themeStore.js';
  import type { IBlogPost } from './types.js';

  let { slug, dataPath = 'data' }: { slug: string; dataPath?: string } = $props();

  let selectedPost: IBlogPost | null = $state(null);
  let isLoading = $state(true);
  let error: string | null = $state(null);

  onMount(() => {
    if (slug) {
      loadPostBySlug(slug);
    } else {
      error = 'No slug provided';
      isLoading = false;
    }
  });

  async function loadPostBySlug(postSlug: string) {
    try {
      isLoading = true;
      error = null;

      // Try to fetch the post data directly from the static data
      const response = await fetch(`/${dataPath}/postsMetadata.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts metadata');
      }
      
      const postsMetadata = await response.json();
      const postData = postsMetadata[postSlug];
      
      if (!postData) {
        error = 'Post not found';
        isLoading = false;
        return;
      }
      
      // Load the post content
      const contentResponse = await fetch(`/posts/${postSlug}.html`);
      if (!contentResponse.ok) {
        throw new Error('Failed to fetch post content');
      }
      
      const content = await contentResponse.text();
      
      selectedPost = {
        ...postData,
        slug: postSlug,
        content: content
      };
      
      isLoading = false;
    } catch (err) {
      console.error('Error loading post:', err);
      error = err instanceof Error ? err.message : 'Failed to load post';
      isLoading = false;
    }
  }

  function handleAuthorClick(author: string) {
    // Navigate to blog with author filter
    goto(`/blog?author=${encodeURIComponent(author)}`);
  }

  function handleCategoryClick(category: string) {
    // Navigate to blog with category filter
    goto(`/blog?category=${encodeURIComponent(category)}`);
  }

  function goBackToBlog() {
    goto('/blog');
  }
</script>

<div class="blog-container" style="
  --text-body-color: {$themeStore.themeColors.textBodyColor};
  --text-subtitle-color: {$themeStore.themeColors.textSubtitleColor};
  --text-title-color: {$themeStore.themeColors.textTitleColor};
  --background-color: {$themeStore.themeColors.backgroundColor};
  --card-background: {$themeStore.themeColors.cardBackgroundColor};
  --border-color: {$themeStore.themeColors.borderColor};
  --button-background-color: {$themeStore.themeColors.buttonBackgroundColor};
  --button-border-color: {$themeStore.themeColors.buttonBorderColor};
  --button-disabled-background-color: {$themeStore.themeColors.buttonDisabledBackgroundColor};
  --button-disabled-border-color: {$themeStore.themeColors.buttonDisabledBorderColor};
  --active-filter-background: {$themeStore.themeColors.activeFilterBackground};
  --active-filter-text: {$themeStore.themeColors.activeFilterText};
  --link-color: {$themeStore.themeColors.linkColor};
  --link-hover-color: {$themeStore.themeColors.linkHoverColor};
  background-color: {$themeStore.themeColors.backgroundColor};
">
  {#if isLoading}
    <div class="loading">Loading post...</div>
  {:else if error}
    <div class="error">
      <h1>Post Not Found</h1>
      <p>{error}</p>
      <button onclick={goBackToBlog} class="back-btn">
        ← Back to Blog
      </button>
    </div>
  {:else if selectedPost}
    <BlogPost 
      post={selectedPost}
      onAuthorClick={handleAuthorClick}
      onCategoryClick={handleCategoryClick}
    />
    <div class="back-button">
      <button onclick={goBackToBlog} class="back-btn">
        ← Back to Blog
      </button>
    </div>
  {/if}
</div>

<style>
  .blog-container {
    max-width: 1200px;
    width: 90%;
    margin: 0 auto;
    padding: 0.5rem 0 1rem 0;
    background-color: var(--background-color) !important;
    min-height: 100vh;
    color: var(--text-body-color) !important;
  }

  /* Ensure all child elements inherit the theme */
  .blog-container * {
    color: inherit;
  }

  .loading, .error {
    text-align: center;
    padding: 2rem;
    color: var(--text-body-color);
  }

  .loading {
    font-size: 1.2rem;
  }

  .error h1 {
    color: var(--text-title-color);
    margin-bottom: 1rem;
  }

  .error p {
    color: var(--text-subtitle-color);
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }

  .back-button {
    margin: 2rem 0;
    text-align: center;
  }

  .back-btn {
    background-color: var(--button-background-color);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
    text-decoration: none;
    display: inline-block;
  }

  .back-btn:hover {
    background-color: var(--button-border-color);
  }

  @media (max-width: 768px) {
    .blog-container {
      width: 95%;
      padding: 1rem 0;
    }
  }
</style>
