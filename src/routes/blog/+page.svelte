<!--
  @component 
  @description Main blog listing page for /blog route with SEO optimization
-->
<script lang="ts">
  import Blog from '$lib/Blog.svelte';
  import { onMount } from 'svelte';
  import { blogConfig } from '$lib/config.js';

  // SEO meta data
  // let seoTitle = `${blogConfig.site.name} - Latest Posts and Articles`;
  // let seoDescription = blogConfig.site.description;
  // let seoKeywords = 'blog, articles, posts, insights, latest news';

	onMount(() => {
		console.log('Blog page mounted');
	});
</script>

<svelte:head>
	<title>Avidys Blog</title>
	<meta name="description" content="Avidys Blog" />
</svelte:head>

	<div id="top" class="blog-wrapper">
		<div class="blog-container">
			<Blog 
				useSeoMode={true} 		
				showReadMoreButton={false}
				theme="dark"
				showSearch={true}
				showYears={true}
				showCategories={true}
				showAuthor={true}
				showDate={true}
				showDescription={true}
			/>
		</div>
	</div>

<style>
	.blog-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}

	.blog-container {
		max-width: 1200px;
		width: 90%;
		margin: 0 auto;
		padding: 2rem 0;
	}

	:global(.blog-container),
	:global(.blog-post),
	:global(.blog-layout.post-selected) {
		max-width: 100% !important;
		width: 100% !important;
	}

	@media (max-width: 768px) {
		:global(.blog-post),
		:global(.blog-item),
		:global(.blog-content),
		:global(.blog-container) {
			max-width: 100% !important;
			width: 100% !important;
			padding: 0;
			margin: 0;
		}

	}
</style>