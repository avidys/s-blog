<script lang="ts">
	import BlogSeoPage from '$lib/BlogSeoPage.svelte';
	import { page } from '$app/stores';
	import { themeActions, themeStore } from '$lib/themeStore.js';

	// Set dark theme immediately when component loads
	themeActions.setTheme('dark');
</script>

<div id="top" class="blog-wrapper" style="
	--text-body-color: {$themeStore.themeColors.textBodyColor};
	--text-subtitle-color: {$themeStore.themeColors.textSubtitleColor};
	--text-title-color: {$themeStore.themeColors.textTitleColor};
	--background-color: {$themeStore.themeColors.backgroundColor};
	--card-background: {$themeStore.themeColors.cardBackgroundColor};
	--border-color: {$themeStore.themeColors.borderColor};
	--button-background-color: {$themeStore.themeColors.buttonBackgroundColor};
	--button-border-color: {$themeStore.themeColors.buttonBorderColor};
	--button-disabled-background-color: {$themeStore.themeColors.buttonDisabledBackgroundColor};
	--button-disabled-border-color: {$themeStore.themeColors.buttonDisabledBorderColor};
	--active-filter-background: {$themeStore.themeColors.activeFilterBackground};
	--active-filter-text: {$themeStore.themeColors.activeFilterText};
	--link-color: {$themeStore.themeColors.linkColor};
	--link-hover-color: {$themeStore.themeColors.linkHoverColor};
">
	<BlogSeoPage slug={$page.params.slug} dataPath="data" />
</div>

<style>
	.blog-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}
</style>
