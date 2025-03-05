<script lang="ts">
    import { onMount } from 'svelte';
    import BlogPage from '$lib/BlogPage.svelte';
	import { blogStore } from './blogStore.js';
  
</script>
  
<svelte:head>
    <title>Blog</title>
    <meta name="description" content="About this app" />
</svelte:head>

<BlogPage />