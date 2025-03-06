# @avidys/s-blog

A Svelte blog component with markdown support and filtering by year and category.

## Installation

```bash
pnpm install @avidys/s-blog
# or
npm install @avidys/s-blog
# or
yarn add @avidys/s-blog
```

## Usage

1. Create a `posts` directory in your `src` folder and add your markdown blog posts.

Each post must start with a frontmatter block like this:

```md
---
title: Getting Started with Web Development
description: Web development is an exciting journey that combines creativity with technical skills.
date: '2025-4-14'
categories:
  - web
  - html
  - css
author: "John Doe"
date: "2022-07-01"
updated: "2023-10-26"
published: true
---

This is the first post, and it's a great one!
...
```

The `title`, `auhor`, and `date` fields are required; the rest is optional.

2. Add the markdown plugin to your `vite.config.ts`:

```typescript
import { markdownMetadataPlugin } from '@avidys/s-blog/markdownMetadataPlugin';

export default defineConfig({
  plugins: [sveltekit(), markdownMetadataPlugin()]
});
```

3. Use the blog component in your Svelte app:

```svelte
<script>
  import { Blog } from '@avidys/s-blog';
</script>

<Blog />
```

## Build Process

During ```pnpm build``` or ```pnpm dev```, the build process:

1. Converts markdown files from `/src/posts` to HTML in `/static/posts` (you may need to create the `/static/posts` directory)
2. Generates metadata JSON files in `/src/data` for each post
3. Creates author, category and year indexes in `/src/data`

Alternatively, you can run the `md2html` script to generate the metadata and HTML files:

```bash
pnpm md2html
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Update

The `build` command may update some posts, so you need to commit first and then publish the changes:

```bash
update package.json version
pnpm build
git add .
git commit -am "build"
git push -u origin main
pnpm publish --access=public
```

## License

GPL-3 License

## Credits

- Author: [Avidys] (<https://www.avidys.com>)
- node team <https://nodejs.org/en>
- svelte team <https://svelte.dev/> <https://www.npmjs.com/package/svelte>
- marked package <https://www.npmjs.com/package/marked>
- grey-matter package <https://www.npmjs.com/package/gray-matter>
