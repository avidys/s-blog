<script lang="ts">
    import { onMount } from 'svelte';
    import BlogPage from '$lib/BlogPage.svelte';
    import { logger } from './logger.js';

    // Determine the data path based on whether we're in development or production
    // and whether we're being used as a package or directly
    const isPackage = import.meta.url.includes('node_modules');
    const dataPath = isPackage
        ? '/node_modules/@avidys/s-blog/src/lib/data'  // When used as a package
        : import.meta.env.DEV 
            ? 'src/lib/data'  // Development environment (direct usage)
            : '/src/lib/data'; // Production environment (direct usage)

    onMount(() => {
        logger.info('Blog component mounted with data path:', dataPath);
        logger.debug('Environment details:', {
            isPackage,
            environment: import.meta.env.DEV ? 'development' : 'production'
        });
    });
</script>
  
<svelte:head>
    <title>Blog</title>
    <meta name="description" content="About this app" />
</svelte:head>

<BlogPage {dataPath} />