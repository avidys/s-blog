
<script lang="ts">
    import Blog from '$lib/Blog.svelte';
</script>
  
<svelte:head>
    <title>Blog</title>
    <meta name="description" content="About this app" />
</svelte:head>

<h1>Blog Component</h1>
<p>Posts formated in as .md in /src/posts</p>

<Blog />