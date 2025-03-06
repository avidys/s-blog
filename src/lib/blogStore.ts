import { writable } from 'svelte/store';
import type { IBlogPost } from './types.ts';
import postsMetadata from './data/postsMetadata.json' assert { type: "json" };
import postsCategories from './data/categories.json' assert { type: "json" };
import postsYears from './data/years.json' assert { type: "json" };

function createBlogStore() {
  const { subscribe, update } = writable<{
    posts: IBlogPost[];
    selectedPost: IBlogPost | null;
    searchTerm: string;
    selectedCategory: string;
    postsCategories: string[];
    postsYears: string[];
  }>({
    posts: Object.values(postsMetadata) as IBlogPost[],
    selectedPost: null,
    searchTerm: '',
    selectedCategory: 'All',
    postsCategories: Object.keys(postsCategories),
    postsYears: Object.keys(postsYears)
  });

  return {
    subscribe,
    setPosts: (posts: IBlogPost[]) => {
      update(state => ({ ...state, posts }));
    },
    setCategories: (categories: string[]) => {
      update(state => ({ ...state, postsCategories: categories }));
    },
    setYears: (years: string[]) => {
      update(state => ({ ...state, postsYears: years }));
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