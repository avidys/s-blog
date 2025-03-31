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
  import { onMount } from 'svelte';
  import BlogPost from './BlogPost.svelte';
  import type { IBlogPost, BlogPageProps } from './types.ts';
  import { blogStore } from './blogStore.js';

  // Add new props with defaults
  export let dataPath: BlogPageProps['dataPath'] = 'src/lib/data';
  export let showReadMoreButton: BlogPageProps['showReadMoreButton'] = true;
  export let numberOfPosts: BlogPageProps['numberOfPosts'] = Infinity;
  export let showSearch: BlogPageProps['showSearch'] = true;
  export let showYears: BlogPageProps['showYears'] = true;
  export let showCategories: BlogPageProps['showCategories'] = true;
  export let showAuthor: BlogPageProps['showAuthor'] = true;
  export let showDate: BlogPageProps['showDate'] = true;
  export let showDescription: BlogPageProps['showDescription'] = true;

  // Add method to reset all selections
  export function resetSelections() {
    selectedPost = null;
    searchQuery = '';
    selectedCategories = [];
    selectedYear = null;
    selectedAuthor = null;
  }

  let selectedPost: IBlogPost | null = null;
  let searchQuery = '';
  let selectedCategories: string[] = [];
  let selectedYear: string | null = null;
  let selectedAuthor: string | null = null;
  let isLoading = true;

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
  $: filteredPosts = $blogStore.posts
    .filter(post => {
      if (!post) return false;
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
    })
    .slice(0, numberOfPosts);

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

  // Add a computed class based on whether a post is selected and sidebar visibility
  $: layoutClass = `${selectedPost ? 'post-selected' : ''} ${!showSidebar ? 'no-sidebar' : ''}`;

  // Add reactive variable for sidebar visibility
  $: showSidebar = showSearch || showYears || showCategories;

  onMount(async () => {
    console.log('BlogPage mounted, initializing store with path:', dataPath);
    await blogStore.initialize(dataPath ?? 'src/lib/data');
    isLoading = false;
  });
</script>

<div class="blog-container">
  {#if isLoading}
    <div class="loading">Loading blog posts...</div>
  {:else}
    <!-- <h1 class="blog-title">Blog</h1> -->
    
    <div class="blog-layout {layoutClass}">
      {#if !selectedPost && showSidebar}
      <aside class="blog-sidebar">
        {#if showSearch}
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
        {/if}

        {#if selectedAuthor}
          <div class="sidebar-widget">
            <h3>Selected Author</h3>
            <div class="active-filter">
              {selectedAuthor}
              <button class="clear-filter" on:click={() => selectedAuthor = null}>×</button>
            </div>
          </div>
        {/if}

        {#if showYears}
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
        {/if}

        {#if showCategories}
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
        {/if}
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
          <div class="back-button-container">
            <button class="back-button" on:click={() => selectedPost = null}>
              ← Back to all posts
            </button>
          </div>
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
              <article 
                class="post-card {!showReadMoreButton ? 'clickable' : ''}"
                on:click={() => !showReadMoreButton && handleReadMore(post)}
                on:keydown={(e) => !showReadMoreButton && e.key === 'Enter' && handleReadMore(post)}
                role="button"
                tabindex="0"
              >
                <h2>{post.title}</h2>
                {#if post.subtitle}
                  <p class="subtitle">{post.subtitle}</p>
                {/if}
                <div class="post-meta">
                  {#if showAuthor}
                    <span class="author">By {post.author}</span>
                  {/if}
                  {#if showDate}
                    <span class="date">{post.date}</span>
                  {/if}
                  <span class="category">
                    {(post.displayCategories ?? []).map(cat => 
                      cat.charAt(0).toUpperCase() + cat.slice(1)
                    ).join(', ')}
                  </span>
                </div>
                {#if showDescription}
                  <p class="excerpt">{post.description}</p>
                {/if}
                {#if showReadMoreButton}
                  <div class="post-footer">
                    <button class="read-more" on:click={() => handleReadMore(post)}>
                      Read More
                    </button>
                  </div>
                {/if}
              </article>
            {/each}
          {/if}
        {/if}
      </main>
    </div>
  {/if}
</div>

<style>
 
  /* Instead, use component-scoped variables */
  .blog-container {
    --text-body-color: inherit;
    --text-subtitle-color: inherit;
    --text-title-color: inherit;
    --background-color: inherit;
    --card-background: inherit;  /* This controls the background of boxes */
    --border-color: inherit;
    --button-disabled-background-color: inherit;
    --button-disabled-border-color: inherit;
    --button-background-color: inherit;
    --button-border-color: inherit;
    --active-filter-background: inherit;
    --active-filter-text: inherit;
    --link-color: inherit;
    --link-hover-color: inherit;
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
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
  }

  /* Use class-based styling instead of :has selector */
  .blog-layout.post-selected {
    display: block;
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
  }

  .blog-layout.no-sidebar {
    grid-template-columns: 1fr;
    max-width: 800px;
  }

  .blog-layout.post-selected .blog-content {
    grid-column: auto;
    width: 100%;
  }

  .blog-layout.no-sidebar .blog-content {
    grid-column: 1;
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
    background: var(--card-background);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border: 2px solid var(--border-color);
    color: var(--text-body-color);
  }

  .sidebar-widget {
    background: var(--card-background);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border: 2px solid var(--border-color);
    color: var(--text-body-color);
  }

  .sidebar-widget button {
    padding: 0.25em 0.5em;
    border: 1px solid var(--button-disabled-border-color);
    border-radius: 4px;
    background-color: var(--button-disabled-background-color);
    color: var(--text-body-color);
    margin: 0.3rem;
    transition: all 0.2s ease;
  }

  .sidebar-widget button:hover {
    background-color: var(--button-background-color);
    color: white;
    border-color: var(--button-border-color);
  }

  .sidebar-widget button.selected {
    background-color: var(--button-background-color);
    color: white;
    font-weight: bold;
    border: 1px solid var(--button-border-color);
  }

  .post-meta {
    display: flex;
    gap: 1rem;
    color: var(--text-subtitle-color);
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .post-meta .author,
  .post-meta .date,
  .post-meta .category {
    color: var(--text-subtitle-color);
  }

  .excerpt {
    color: var(--text-body-color);
    line-height: 1.6;
    margin-bottom: 1.5rem;  /* Default margin when button is present */
  }

  /* Remove bottom margin when there's no button */
  .post-card.clickable .excerpt {
    margin-bottom: 0rem;  /* Reduced margin when card is clickable (no button) */
  }

  .post-footer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .read-more {
    background: var(--button-background-color);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .read-more:hover {
    background: var(--button-border-color);
  }

  .sidebar-widget h3,
  .post-card h2 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    color: var(--text-title-color);
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
    color: var(--text-subtitle-color);
    font-size: 1.1rem;
    margin: -0.5rem 0 1rem;
    font-style: italic;
  }

  .active-filter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--active-filter-background);
    color: var(--active-filter-text);
    padding: 0.5rem;
    border-radius: 4px;
    margin: 0.5rem 0;
  }

  .clear-filter {
    background: none;
    border: none;
    color: var(--text-subtitle-color);
    cursor: pointer;
    padding: 0 0.3rem;
    font-size: 1rem;
    line-height: 1;
  }

  .clear-filter:hover {
    color: var(--text-body-color);
  }

  .no-posts {
    text-align: center;
    padding: 2rem;
    background: var(--card-background);
    border-radius: 8px;
    border: 2px solid var(--border-color);
  }

  .reset-filters {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: var(--button-background-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .reset-filters:hover {
    background: var(--button-border-color);
  }

  .post-card.clickable {
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .post-card.clickable:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  .back-button-container {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
  }

  .back-button {
    background: var(--button-background-color);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .back-button:hover {
    background: var(--button-border-color);
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

</style>