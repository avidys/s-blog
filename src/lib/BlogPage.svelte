<!--
  @component BlogPage
  @description Main blog listing page component that displays a list of blog posts with a side panel for categories.
                Handles post selection and navigation.
  
  @example
  ```svelte
  <BlogPage />
  ```
-->

<script lang="ts">
  import { goto } from '$app/navigation';
  import BlogPost from './BlogPost.svelte';
  import type { IBlogPost } from './types.ts';
  import { blogStore } from './blogStore.js';

  let selectedPost: IBlogPost | null = null;
  let searchQuery = '';
  let selectedCategories: string[] = [];
  let selectedYear: string | null = null;
  let selectedAuthor: string | null = null;

  const KNOWN_ACRONYMS: { [key: string]: string } = {
    'cdm': 'CDM',
    'ai': 'AI',
    'typescript': 'TypeScript',
    'javascript': 'JavaScript',
    'sveltekit': 'SvelteKit',
    'clinical trial': 'Clinical Trial'
  };

  function handleYearSelect(year: string) {
    selectedYear = (selectedYear === year ? null : year);
  }

  // Update the filteredPosts reactive statement to include search
  $: filteredPosts = $blogStore.posts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || 
      (Array.isArray(post.categories) ? post.categories : (post.categories ? [post.categories] : [])).some(cat => 
        cat && selectedCategories.includes(cat.toLowerCase())
      );
    const matchesYear = !selectedYear || 
      new Date(post.date).getFullYear().toString() === selectedYear;
    const matchesAuthor = !selectedAuthor || 
      post.author === selectedAuthor;
    
    return matchesSearch && matchesCategory && matchesYear && matchesAuthor;
  });

  // Get 3 most recent posts
  $: recentPosts = [...$blogStore.posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const handleCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      selectedCategories = selectedCategories.filter(c => c !== category);
    } else {
      selectedCategories = [...selectedCategories, category];
    }
    selectedPost = null;
  };

  const handleReadMore = (post: IBlogPost) => {
    selectedPost = post;
  };

  const handleSearch = (event: Event) => {
    event.preventDefault();
  };

  // Reset author when other filters change
  $: if (selectedCategories.length > 0 || selectedYear) {
    selectedAuthor = null;
  }
</script>

<div class="blog-container">
  <!-- <h1 class="blog-title">Blog</h1> -->
  
  <div class="blog-layout">
    {#if !selectedPost}
    <aside class="blog-sidebar">
      <div class="sidebar-widget">
        <h3>Search</h3>
        <form class="search-form" on:submit={handleSearch}>
          <div class="search-container">
            <input 
              type="search" 
              bind:value={searchQuery}
              placeholder="Search posts..." 
              aria-label="Search blog posts"
            >
            {#if searchQuery}
              <button type="button" class="clear-search" on:click={() => searchQuery = ''}>
                ×
              </button>
            {/if}
          </div>
        </form>
      </div>

      {#if selectedAuthor}
        <div class="sidebar-widget">
          <h3>Selected Author</h3>
          <div class="active-filter">
            {selectedAuthor}
            <button class="clear-filter" on:click={() => selectedAuthor = null}>×</button>
          </div>
        </div>
      {/if}

      <div class="sidebar-widget">
        <h3>Years</h3>
        <button 
          class:selected={!selectedYear}
          on:click={() => handleYearSelect(selectedYear ?? '')}
        >
          All
        </button>
        {#each $blogStore.postsYears as year}
          <button 
            class:selected={selectedYear === year}
            on:click={() => handleYearSelect(year)}
          >
            {year}
          </button>
        {/each}
      </div>

      <div class="sidebar-widget">
        <h3>Categories</h3>
        <button 
          class:selected={selectedCategories.length === 0}
          on:click={() => selectedCategories = []}
        >
          All
        </button>
        {#each $blogStore.postsCategories as category}
          <button 
            class:selected={selectedCategories.includes(category.toLowerCase())}
            on:click={() => handleCategorySelect(category.toLowerCase())}
          >
            {KNOWN_ACRONYMS[category] ?? 
              (category.charAt(0).toUpperCase() + category.toLowerCase().slice(1))}
          </button>
        {/each}
      </div>
    </aside>
    {/if}

    <main class="blog-content">
      {#if selectedPost}
        <BlogPost 
          post={selectedPost} 
          onAuthorClick={(author) => {
            selectedAuthor = author;
            selectedPost = null;
          }}
          onCategoryClick={(category) => {
            selectedCategories = [category];
            selectedPost = null;
          }}
        />
        <button class="back-button" on:click={() => selectedPost = null}>
          ← Back to all posts
        </button>
      {:else}
        {#if filteredPosts.length === 0}
          <div class="no-posts">
            <p>No posts found matching your criteria</p>
            <button class="reset-filters" on:click={() => {
              searchQuery = '';
              selectedCategories = [];
              selectedYear = null;
              selectedAuthor = null;
            }}>Reset all filters</button>
          </div>
        {:else}
          {#each filteredPosts as post}
            <article class="post-card">
              <h2>{post.title}</h2>
              {#if post.subtitle}
                <p class="subtitle">{post.subtitle}</p>
              {/if}
              <div class="post-meta">
                <span class="author">By {post.author}</span>
                <span class="date">{post.date}</span>
                <span class="category">
                  {(post.displayCategories ?? []).map(cat => 
                    cat.charAt(0).toUpperCase() + cat.slice(1)
                  ).join(', ')}
                </span>
              </div>
              <p class="excerpt">{post.description}</p>
              <div class="post-footer">
                <button class="read-more" on:click={() => handleReadMore(post)}>
                  Read More
                </button>
              </div>
            </article>
          {/each}
        {/if}
      {/if}
    </main>
  </div>
</div>

<style>
  .blog-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  /* .blog-title {
    margin-bottom: 2rem;
    font-size: 2rem;
    color: var(--text-color);
  } */

  .blog-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 2.5rem;
    align-items: start;
  }

  /* When post is selected, use full width and remove grid */
  :global(.blog-layout:has(> .blog-content > .blog-post)) {
    display: block;  /* Change from grid to block */
    max-width: 800px;  /* Match BlogPost article max-width */
    margin: 0 auto;  /* Center the content */
  }

  /* Remove any remaining grid properties when post is selected */
  :global(.blog-layout:has(> .blog-content > .blog-post)) .blog-content {
    grid-column: auto;
    width: 100%;
  }

  .blog-sidebar {
    grid-column: 1;
    position: relative;
    z-index: 1;
  }

  .blog-content {
    grid-column: 2;
    position: relative;
    z-index: 2;
  }

  .post-card {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border: 2px solid #e0e4e8;
  }

  .sidebar-widget {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border: 2px solid #e0e4e8;
  }

  .sidebar-widget button {
    padding: 0.25em 0.5em;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    margin: 0.3rem;
  }

  .sidebar-widget button.selected {
    background-color: #007bff;
    color: white;
    font-weight: bold;
    border: 1px solid #0056b3;
  }

  .post-meta {
    display: flex;
    gap: 1rem;
    color: var(--text-light);
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .excerpt {
    color: var(--text-color);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .post-footer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .read-more {
    background: #007bff;
    color: #ffffff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .read-more:hover {
    background: #0056b3;
  }

  .sidebar-widget h3,
  .post-card h2 {
    margin-top: 0;
    margin-bottom: 0.75rem;
  }


  @media (max-width: 768px) {
    .blog-layout {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .blog-sidebar {
      width: 100%;
      margin-bottom: 1rem;
    }

    .blog-content {
      width: 100%;
    }

    .sidebar-widget {
      margin-bottom: 0.5rem;
    }

    /* Make category buttons wrap and be more touch-friendly */
    .sidebar-widget button {
      display: inline-block;
      margin: 0.25rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.9rem;
    }

    .blog-container {
      padding: 1rem;
    }

    .post-card {
      margin-bottom: 1rem;
    }

    /* Adjust meta information display for small screens */
    .post-meta {
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  }

  .search-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-form input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .clear-search {
    position: absolute;
    right: 0.1rem;
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    color: #666;
    padding: 0 0.3rem;
    line-height: 1;
  }

  .clear-search:hover {
    color: #333;
  }

  .subtitle {
    color: var(--text-light);
    font-size: 1.1rem;
    margin: -0.5rem 0 1rem;
    font-style: italic;
  }

  .active-filter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #e9ecef;
    padding: 0.5rem;
    border-radius: 4px;
    margin: 0.5rem 0;
  }

  .clear-filter {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 0 0.3rem;
    font-size: 1rem;
    line-height: 1;
  }

  .clear-filter:hover {
    color: #333;
  }

  .no-posts {
    text-align: center;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 2px solid #e0e4e8;
  }

  .reset-filters {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .reset-filters:hover {
    background: #0056b3;
  }

</style>