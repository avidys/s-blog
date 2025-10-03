import { writable } from 'svelte/store';
import type { ThemeName, ThemeColors } from './types.js';

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

// Theme store
export const themeStore = writable<{
  currentTheme: ThemeName;
  customColors: ThemeColors | null;
  themeColors: ThemeColors;
}>({
  currentTheme: 'light',
  customColors: null,
  themeColors: themes.light
});

// Theme management functions
export const themeActions = {
  setTheme: (theme: ThemeName) => {
    themeStore.update(state => ({
      ...state,
      currentTheme: theme,
      themeColors: themes[theme]
    }));
  },

  setCustomColors: (customColors: ThemeColors) => {
    themeStore.update(state => ({
      ...state,
      customColors,
      themeColors: customColors
    }));
  },

  resetToTheme: (theme: ThemeName) => {
    themeStore.update(state => ({
      ...state,
      currentTheme: theme,
      customColors: null,
      themeColors: themes[theme]
    }));
  },

  getCurrentColors: () => {
    let currentColors: ThemeColors;
    themeStore.subscribe(state => {
      currentColors = state.customColors || themes[state.currentTheme];
    })();
    return currentColors!;
  }
};

// Initialize theme based on system preference
// Note: This is commented out to let components control the theme
// if (typeof window !== 'undefined') {
//   const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
//   themeActions.setTheme(systemTheme);
// }
