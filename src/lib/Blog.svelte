<script lang="ts">
    import { onMount } from 'svelte';
    import BlogPage from '$lib/BlogPage.svelte';
    import { logger } from './logger.js';
    import type { ThemeName, ThemeColors, BlogPageInstance } from './types.ts';

    // Predefined themes
    const themes: Record<ThemeName, ThemeColors> = {
        light: {
            textBodyColor: '#333333',
            textSubtitleColor: '#666666',
            textTitleColor: '#1a1a1a',
            backgroundColor: '#f8f9fa',
            cardBackgroundColor: '#ffffff',
            borderColor: '#e0e4e8',
            buttonBackgroundColor: '#007bff',
            buttonBorderColor: '#0056b3',
            buttonDisabledBackgroundColor: '#ffffff',
            buttonDisabledBorderColor: '#cccccc',
            activeFilterBackground: '#e9ecef',
            activeFilterText: '#333333',
            linkColor: '#007bff',
            linkHoverColor: '#0056b3'
        },
        dark: {
            textBodyColor: '#e0e0e0',
            textSubtitleColor: '#a0a0a0',
            textTitleColor: '#ffffff',
            backgroundColor: '#1a1a1a',
            cardBackgroundColor: '#2d2d2d',
            borderColor: '#404040',
            buttonBackgroundColor: '#4dabf7',
            buttonBorderColor: '#339af0',
            buttonDisabledBackgroundColor: '#2d2d2d',
            buttonDisabledBorderColor: '#404040',
            activeFilterBackground: '#404040',
            activeFilterText: '#e0e0e0',
            linkColor: '#4dabf7',
            linkHoverColor: '#339af0'
        }
    };

    export let useImports = true; // Use imports instead of fetch for data loading

    // Determine the data path based on whether we're in development or production
    // and whether we're being used as a package or directly
    const isPackage = import.meta.url.includes('node_modules');
    const defDataPath = isPackage
        ? '/node_modules/@avidys/s-blog/src/lib/data'  // When used as a package
        // TODO: use esm-env to get the environment for better compatibility
        : useImports && import.meta.env.DEV 
            ? 'src/lib/data'  // Development environment (direct usage)
            : '/'; // Production environment (direct usage)

    // Theme props with defaults
    let systemTheme: ThemeName = 'light';
    if (typeof window !== 'undefined') {
        systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    export let theme: ThemeName | undefined = undefined;
    export let customColors: ThemeColors | null = null;
    export let dataPath = defDataPath;
    export let showReadMoreButton = true;
    export let blogPage: BlogPageInstance | undefined = undefined;
 
    // Add new props with defaults
    export let numberOfPosts = Infinity;
    export let showSearch = true;
    export let showCategories = true;
    export let showYears = true;
    export let showAuthor = true;
    export let showDate = true;
    export let showDescription = true;

    // Determine if theme was provided as a prop
    const themeProvided = (theme !== undefined);
    // Use provided theme or system theme, but never change if provided
    let currentThemeName: ThemeName = themeProvided ? (theme as ThemeName) : systemTheme;
    // Get current theme colors
    $: currentTheme = customColors || themes[currentThemeName];
    // The prop has been updated from outside the component
    // we could have an option to forbid this
    $: if (themeProvided && (currentThemeName !== theme)) {
        // theme = propTheme;
        logger.warn('Blog component: theme prop has been updated from outside the component');
    }
    
    onMount(() => {
        logger.info('Blog component mounted with data path:', dataPath);
        logger.debug('Environment details:', {
            isPackage,
            // TODO: use esm-env to get the environment for better compatibility
            environment: import.meta.env.DEV ? 'development' : 'production',
            theme,
            currentThemeName,
            themeProvided,
            systemTheme
        });

        // Only listen for system theme changes if no theme was explicitly provided
        if (typeof window !== 'undefined' && !customColors && !themeProvided) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!customColors && !themeProvided) {
                    currentThemeName = e.matches ? 'dark' : 'light';
                    logger.info('Blog component: system theme changed to:', currentThemeName);
                }
            });
        }
    });
</script>
  
<svelte:head>
    <title>Blog</title>
    <meta name="description" content="About this app" />
</svelte:head>

<div class="blog-wrapper" style="
    --text-body-color: {currentTheme.textBodyColor};
    --text-subtitle-color: {currentTheme.textSubtitleColor};
    --text-title-color: {currentTheme.textTitleColor};
    --background-color: {currentTheme.backgroundColor};
    --card-background: {currentTheme.cardBackgroundColor};
    --border-color: {currentTheme.borderColor};
    --button-background-color: {currentTheme.buttonBackgroundColor};
    --button-border-color: {currentTheme.buttonBorderColor};
    --button-disabled-background-color: {currentTheme.buttonDisabledBackgroundColor};
    --button-disabled-border-color: {currentTheme.buttonDisabledBorderColor};
    --active-filter-background: {currentTheme.activeFilterBackground};
    --active-filter-text: {currentTheme.activeFilterText};
    --link-color: {currentTheme.linkColor};
    --link-hover-color: {currentTheme.linkHoverColor};
">
    <BlogPage 
        bind:this={blogPage} 
        {dataPath} 
        {showReadMoreButton}
        {numberOfPosts}
        {showSearch}
        {showCategories}
        {showYears}
        {showAuthor}
        {showDate}
        {showDescription}
        {useImports}
    />
</div>

<style>
    .blog-wrapper {
        background-color: var(--background-color);
        min-height: 100vh;
        transition: background-color 0.3s ease, color 0.3s ease;
        color: var(--text-body-color);
    }
</style>