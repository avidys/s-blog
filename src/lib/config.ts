// Blog configuration
export const blogConfig = {
  // Social media handles
  twitter: {
    site: import.meta.env.VITE_TWITTER_SITE || '@avidys',
    creator: import.meta.env.VITE_TWITTER_CREATOR || '@avidys'
  },
  
  // Site information
  site: {
    name: import.meta.env.VITE_SITE_NAME || 'Blog',
    description: import.meta.env.VITE_SITE_DESCRIPTION || 'Latest blog posts and articles',
    url: import.meta.env.VITE_SITE_URL || 'https://avidys.net.com'
  },
  
  // Default images
  images: {
    default: import.meta.env.VITE_DEFAULT_IMAGE || '/blog-banner.webp',
    twitter: import.meta.env.VITE_TWITTER_IMAGE || '/blog-banner.webp'
  }
};
