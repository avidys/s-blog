<script lang="ts">
    import Blog from '$lib/Blog.svelte';
    import type { BlogPageInstance } from '$lib/types.ts';

    let blogPage: BlogPageInstance;

    function handleReset() {
        if (blogPage) blogPage.resetSelections();
    }
</script>
  
<svelte:head>
    <title>Blog</title>
    <meta name="description" content="About this app" />
</svelte:head>

<h1>Blog Component</h1>
<p>Posts formated in as .md in /src/posts</p>

<!-- Use system theme (default) -->
<Blog bind:blogPage={blogPage} />

<!-- Force light theme -->
<Blog theme="light" showReadMoreButton={false} />

<!-- Force dark theme -->
<Blog theme="dark" />

<Blog 
    theme="dark"
    showSearch={false}
    showCategories={false}
    showYears={false}
    numberOfPosts={3}
    showAuthor={false}
    showDate={false}
    showDescription={false}
    showReadMoreButton={false}
/>

<!-- Custom theme -->
<Blog customColors={{
  textBodyColor: '#222222',
  textSubtitleColor: '#1c1c1c',
  textTitleColor: '#111111',
  backgroundColor: '#123456',
  cardBackgroundColor: '#765432',
  borderColor: '#bdc3c7',
  buttonBackgroundColor: '#3498db',
  buttonBorderColor: '#2980b9',
  buttonDisabledBackgroundColor: '#ffffff',
  buttonDisabledBorderColor: '#bdc3c7',
  activeFilterBackground: '#bdc3c7',
  activeFilterText: '#2c3e50',
  linkColor: '#3498db',
  linkHoverColor: '#2980b9'
}} />

<div class="reset-container">
    <button class="reset-button" on:click={handleReset}>
        Reset Blog Selections
    </button>
</div>

<style>
    .reset-container {
        display: flex;
        justify-content: center;
        margin: 2rem 0;
    }

    .reset-button {
        background: #007bff;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .reset-button:hover {
        background: #0056b3;
    }
</style>