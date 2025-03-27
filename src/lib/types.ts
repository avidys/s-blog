export interface IBlogComment {
    app: string;
    blogSlug: string;
    id: number;
    email?: string;
    author: string;
    date: string;
    content: string;
    avatar?: string;
}

export interface IBlogPost {
    slug: string;
    title: string;
    subtitle?: string;
    description?: string;
    author: string;
    categories?: string[];
    displayCategories?: string[];
    date: string;
    updated?: string;
    content?: string;
    image?: string;
    commentCount?: number;
    comments?: IBlogComment[];
    published?: boolean;
}

export interface FormData {
    name: string;
    email: string;
    services: string[];
    budget: string;
    communication: string;
    timeline: string;
    description: string;
    source: string;
    comments: string;
  };

// Add theme type definitions
export type ThemeName = 'light' | 'dark';

export interface ThemeColors {
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

// Add Blog component props interface
export interface BlogProps {
    theme?: ThemeName;
    customColors?: ThemeColors | null;
    dataPath?: string;
    useReadMoreButton?: boolean;
}