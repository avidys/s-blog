import { writable } from 'svelte/store';
import type { IBlogPost } from './types.ts';
import { logger } from './logger.js';

function createBlogStore() {
  const { subscribe, update } = writable<{
    posts: IBlogPost[];
    selectedPost: IBlogPost | null;
    searchTerm: string;
    selectedCategory: string;
    postsCategories: string[];
    postsYears: string[];
    postsAuthors: string[];
    dataPath: string;
  }>({
    posts: [],
    selectedPost: null,
    searchTerm: '',
    selectedCategory: 'All',
    postsCategories: [],
    postsYears: [],
    postsAuthors: [],
    dataPath: ''
  });

  return {
    subscribe,
    initialize: async (dataPath: string) => {
      try {
        logger.info('Initializing blog store with path:', dataPath);
        
        // Clean the path by removing leading slash and handle package path
        const cleanPath = dataPath.replace(/^\/+/, '');
        const isPackage = import.meta.url.includes('node_modules');
        
        // Use fetch instead of dynamic imports
        const [metadataResponse, categoriesResponse, yearsResponse, authorsResponse] = await Promise.all([
          fetch(`/${cleanPath}/postsMetadata.json`),
          fetch(`/${cleanPath}/categories.json`),
          fetch(`/${cleanPath}/years.json`),
          fetch(`/${cleanPath}/authors.json`)
        ]);

        if (!metadataResponse.ok || !categoriesResponse.ok || !yearsResponse.ok || !authorsResponse.ok) {
          logger.error('Failed to fetch data files:', {
            metadata: metadataResponse.status,
            categories: categoriesResponse.status,
            years: yearsResponse.status,
            authors: authorsResponse.status
          });
          throw new Error('Failed to fetch one or more data files');
        }

        const [metadata, categories, years, authors] = await Promise.all([
          metadataResponse.json(),
          categoriesResponse.json(),
          yearsResponse.json(),
          authorsResponse.json()
        ]);

        logger.debug('Loaded data:', {
          postsCount: Object.keys(metadata).length,
          categoriesCount: Object.keys(categories).length,
          yearsCount: Object.keys(years).length,
          authorsCount: Object.keys(authors).length,
          samplePost: Object.values(metadata)[0],
          isPackage
        });

        // Update the store with the loaded data
        update(state => {
          const newState = {
            ...state,
            dataPath: cleanPath,
            posts: Object.values(metadata) as IBlogPost[],
            postsCategories: Object.keys(categories),
            postsYears: Object.keys(years),
            postsAuthors: Object.keys(authors)
          };
          logger.debug('Updating store state:', {
            ...newState,
            posts: newState.posts.map(p => ({ title: p.title, slug: p.slug }))
          });
          return newState;
        });
      } catch (error) {
        logger.error('Failed to load blog data:', error);
        // Set empty arrays to prevent undefined errors
        update(state => ({
          ...state,
          posts: [],
          postsCategories: [],
          postsYears: [],
          postsAuthors: []
        }));
      }
    },
    setPosts: (posts: IBlogPost[]) => {
      update(state => ({ ...state, posts }));
    },
    setCategories: (categories: string[]) => {
      update(state => ({ ...state, postsCategories: categories }));
    },
    setYears: (years: string[]) => {
      update(state => ({ ...state, postsYears: years }));
    },
    setAuthors: (authors: string[]) => {
      update(state => ({ ...state, postsAuthors: authors }));
    },
    setSearchTerm: (searchTerm: string) => {
      update(state => ({ ...state, searchTerm }));
    },
    setSelectedCategory: (selectedCategory: string) => {
      update(state => ({ ...state, selectedCategory }));
    },
    setSelectedPost: (selectedPost: IBlogPost | null) => {
      update(state => ({ ...state, selectedPost }));
    }
  };
}

export const blogStore = createBlogStore();