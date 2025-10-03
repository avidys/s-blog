<!--
  @component BlogPost
  @description Individual blog post component that displays a full blog post with its content,
                metadata (author, date, category), and associated comments.

  @prop {Object} post - The blog post object containing title, author, date, content, category, and comments
  
  @example
  ```svelte
  <BlogPost post={{
    title: "My Post",
    author: "John Doe",
    date: "2024-02-21",
    content: "# My Post\n\nThis is my post.",
    category: "Tech",
    comments: []
  }} />
  ```
-->

<script lang="ts">
	import type { IBlogPost } from './types.ts';
	import { onMount } from 'svelte';
	import { blogConfig } from './config.js';

  export let post : IBlogPost;
  export let onAuthorClick: (author: string) => void = () => {};
  export let onCategoryClick: (category: string) => void = () => {};

  // Get the base URL for meta tags
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  //$: renderedContent = marked(post.content);
  $: postUrl = `${baseUrl}/blog/${post.slug}`;

  let commentForm = {
    name: "",
    email: "",
    website: "",
    comment: ""
  };

  const handleSubmitComment = (event: SubmitEvent) => {
    event.preventDefault();
    console.log("Comment submitted:", commentForm);
    // Add comment handling logic here
  };


  let loading = true;
  let error: string | null = null;

  onMount(async () => {
      console.log("Loading BlogPost with slug:", post.slug);
      try {
          // Dynamically load the post content from a static HTML file
          const htmlResponse = await fetch(`/posts/${post.slug}.html`);
          if (!htmlResponse.ok) {
              throw new Error(`Failed to load content for ${post.slug}: ${htmlResponse.status}`);
          }
          post.content = await htmlResponse.text();
      } catch (e) {
          console.error('Error loading post:', e);
          error = e instanceof Error ? e.message : 'Failed to load post';
      } finally {
          loading = false;
      }
  });
</script>

<svelte:head>
  {#if post}
    <title>{post.title}</title>

    <meta name="description" content={post.description || (post.content?.slice(0, 160) ?? '')} />

    <meta property="og:type" content="article" />
    <meta property="og:url" content={postUrl} />
    <meta property="og:title" content={post.title} />
    <meta property="og:description" content={post.description || (post.content?.slice(0, 160) ?? '')} />
    <meta property="og:site_name" content={post.title} />
    <meta property="og:image" content={blogConfig.images.default} />

    <meta name="twitter:site" content={blogConfig.twitter.site} />
    <meta name="twitter:creator" content={blogConfig.twitter.creator} />
    <meta name="twitter:title" content={post.title} />
    <meta name="twitter:description" content={post.description || (post.content?.slice(0, 160) ?? '')} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image:src" content={blogConfig.images.twitter} />
    <meta name="twitter:widgets:new-embed-design" content="on" />

    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
  {/if}
</svelte:head>

{#if loading}
<div class="loading">Loading post...</div>
{:else if error}
<div class="error">Error: {error}</div>
{:else}



<article class="blog-post">
  <div class="container">
    <header class="post-header">
      <h1>{post.title}</h1>
      {#if post.subtitle}
        <p class="subtitle">{post.subtitle}</p>
      {/if}
      <div class="post-meta">
        <span>Posted by <button class="link-button" on:click={() => onAuthorClick(post.author)}>{post.author}</button></span>
        <span>on {post.date}</span>
        <span>in {#each (post.displayCategories ?? []) as category, i}
          <button class="link-button" on:click={() => onCategoryClick((category as string).toLowerCase())}>
            {(category as string).charAt(0).toUpperCase() + (category as string).slice(1)}
          </button>{#if i < (post.displayCategories ?? []).length - 1}<span class="category-separator">, </span>{/if}
        {/each}</span>
      </div>
    </header>

    <div class="post-content">
      {@html post.content}
    </div>

    <!-- <CommentSection comments={post.comments} slug={post.slug ? post.slug : undefined} /> -->
  </div>
</article>
{/if}

<style>
  article {
    max-width: 80%;
    margin: 0 auto;  /* Center the article */
    padding: 0 2rem;  /* Comfortable reading padding */
  }

  .blog-post {
    width: 100%;  /* Use full width of the article container */
    color: var(--text-body-color);
  }

  .container {
    max-width: 680px;  /* Optimal reading width */
    margin: 0 auto;  /* Center the content */
  }

  header {
    margin-bottom: 2rem;
    text-align: center;
  }

  h1 {
    font-size: 2.5rem;
    margin: 0 0 1rem;
    color: var(--text-title-color);
  }

  .subtitle {
    font-size: 1.5rem;
    color: var(--text-subtitle-color);
    margin: 0 0 1.5rem;
    font-weight: normal;
  }

  .post-meta {
    display: flex;
    gap: 1rem;
    justify-content: center;
    color: var(--text-subtitle-color);
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    article {
      padding: 0 1rem;  /* Smaller padding on mobile */
    }

    /* Adjust heading sizes for mobile */
    h1 {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }

    .post-meta {
      flex-wrap: wrap;  /* Allow meta info to wrap on mobile */
    }
  }

  .link-button {
    background: none;
    border: none;
    color: var(--link-color);
    padding: 0;
    font: inherit;
    cursor: pointer;
    text-decoration: underline;
  }

  .link-button:hover {
    color: var(--link-hover-color);
  }

  .category-separator {
    margin: 0 0.2rem 0 0;  /* Add some space around the comma */
  }

  .link-button {
    display: inline-block;  /* Ensure proper spacing */
  }
</style>