<script lang="ts">
    import { onMount } from 'svelte';
    import BlogPage from '$lib/BlogPage.svelte';
    import { logger } from './logger.js';

    interface ThemeColors {
        textColor: string;
        textLightColor: string;
        textStrongColor: string;
        backgroundColor: string;
        cardBackgroundColor: string;
        borderColor: string;
        primaryColor: string;
        primaryColorDark: string;
        buttonBackground: string;
        buttonBorder: string;
        activeFilterBackground: string;
        activeFilterText: string;
    }

    type ThemeName = 'light' | 'dark';

    // Predefined themes
    const themes: Record<ThemeName, ThemeColors> = {
        light: {
            textColor: '#333333',
            textLightColor: '#666666',
            textStrongColor: '#1a1a1a',
            backgroundColor: '#f8f9fa',
            cardBackgroundColor: '#ffffff',
            borderColor: '#e0e4e8',
            primaryColor: '#007bff',
            primaryColorDark: '#0056b3',
            buttonBackground: '#ffffff',
            buttonBorder: '#cccccc',
            activeFilterBackground: '#e9ecef',
            activeFilterText: '#333333'
        },
        dark: {
            textColor: '#e0e0e0',
            textLightColor: '#a0a0a0',
            textStrongColor: '#ffffff',
            backgroundColor: '#1a1a1a',
            cardBackgroundColor: '#2d2d2d',
            borderColor: '#404040',
            primaryColor: '#4dabf7',
            primaryColorDark: '#339af0',
            buttonBackground: '#2d2d2d',
            buttonBorder: '#404040',
            activeFilterBackground: '#404040',
            activeFilterText: '#e0e0e0'
        }
    };

    // Determine the data path based on whether we're in development or production
    // and whether we're being used as a package or directly
    const isPackage = import.meta.url.includes('node_modules');
    const defDataPath = isPackage
        ? '/node_modules/@avidys/s-blog/src/lib/data'  // When used as a package
        // TODO: use esm-env to get the environment for better compatibility
        : import.meta.env.DEV 
            ? 'src/lib/data'  // Development environment (direct usage)
            : '/src/lib/data'; // Production environment (direct usage)

    // Theme props with defaults
    let systemTheme: ThemeName = 'light';
    if (typeof window !== 'undefined') {
        systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    export let theme: ThemeName | undefined = undefined;
    export let customColors: ThemeColors | null = null;
    export let dataPath: string = defDataPath;
    export let useReadMoreButton = true;  // Add this prop

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
    --text-color: {currentTheme.textColor};
    --text-light: {currentTheme.textLightColor};
    --text-strong: {currentTheme.textStrongColor};
    --background-color: {currentTheme.backgroundColor};
    --card-background: {currentTheme.cardBackgroundColor};
    --border-color: {currentTheme.borderColor};
    --primary-color: {currentTheme.primaryColor};
    --primary-color-dark: {currentTheme.primaryColorDark};
    --button-background: {currentTheme.buttonBackground};
    --button-border: {currentTheme.buttonBorder};
    --active-filter-background: {currentTheme.activeFilterBackground};
    --active-filter-text: {currentTheme.activeFilterText};
">
    <BlogPage {dataPath} {useReadMoreButton} />
</div>

<style>
    .blog-wrapper {
        background-color: var(--background-color);
        min-height: 100vh;
        transition: background-color 0.3s ease, color 0.3s ease;
        color: var(--text-color);
    }
</style>