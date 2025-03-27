<script lang="ts">
    import Blog from '$lib/Blog.svelte';
</script>
  
<svelte:head>
    <title>Blog</title>
    <meta name="description" content="About this app" />
</svelte:head>

<h1>Blog Component</h1>
<p>Posts formated in as .md in /src/posts</p>

<!-- Use system theme (default) -->
<Blog />

<!-- Force light theme -->
<Blog theme="light" useReadMoreButton={false} />

<!-- Force dark theme -->
<Blog theme="dark" />

<!-- Custom theme -->
<Blog customColors={{
  textColor: '#222222',
  textLightColor: '#1c1c1c',
  textStrongColor: '#111111',
  backgroundColor: '#123456',
  cardBackgroundColor: '#765432',
  borderColor: '#bdc3c7',
  primaryColor: '#3498db',
  primaryColorDark: '#2980b9',
  buttonBackground: '#ffffff',
  buttonBorder: '#bdc3c7',
  activeFilterBackground: '#bdc3c7',
  activeFilterText: '#2c3e50'
}} />