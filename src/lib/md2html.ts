import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Configure marked to use synchronous mode explicitly
const renderer = new marked.Renderer();
marked.setOptions({
  renderer: renderer,
  async: false  // This is the key setting to ensure synchronous operation
});

interface PostMetadata {
  slug: string;
  file: string;
  originalPath: string;
  htmlPath: string;
  title: string;
  subtitle?: string;
  description: string;
  author: string;
  categories: string[];
  date: string;
  updated?: string;
  image?: string;
  published: boolean;
  displayCategories: string[];
}

export function md2html({
  postsDir = path.resolve(process.cwd(), 'src/lib/posts'),
  dataDir = path.resolve(process.cwd(), 'src/lib/data'),
  staticDir = path.resolve(process.cwd(), 'static'),
  htmlOutputDir = path.join(staticDir, 'posts')
} = {}) {
	// const postsDir = path.resolve(process.cwd(), 'src/lib/posts');
	// const dataDir = path.resolve(process.cwd(), 'src/lib/data'); // output json
	// const staticDir = path.resolve(process.cwd(), 'static');
	// const htmlOutputDir = path.join(staticDir, 'posts');
	
	// Ensure all required directories exist
	[postsDir, dataDir, staticDir, htmlOutputDir].forEach(dir => {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
			console.log(`Created directory: ${dir}`);
		}
	});
	
	// Read all markdown files in the posts directory.
	const files = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'));
	
	// Containers for aggregated data.
	const postsMetadata: Record<string, PostMetadata> = {};
	const categoriesMap: Record<string, string[]> = {};
	const yearsMap: Record<string, string[]> = {};
	const authorsMap: Record<string, string[]> = {};
	
	// Process each markdown file.
	files.forEach((file) => {
		//const slug = file.split('/').pop()?.replace('.md', '');
		const fileNameWithoutExt = file.split('/').pop()?.replace('.md', '');
		const slug = fileNameWithoutExt || file.replace('.md', ''); // Fallback to file if undefined
		 const filePath = path.join(postsDir, file);
		const fileContent = fs.readFileSync(filePath, 'utf-8');
	  
		// Parse frontmatter and content.
		const { data, content } = matter(fileContent);
		
		// Convert markdown content to HTML using the synchronous method with explicit casting
		const html = marked.parse(content) as string;
		
		// Generate an HTML file name based on the markdown file name.
		const baseName = path.basename(file, '.md');
		const htmlFileName = `${baseName}.html`;
		const htmlFilePath = path.join(htmlOutputDir, htmlFileName);
		
		// Write the HTML file.
		fs.writeFileSync(htmlFilePath, html);
		console.log(`Generated HTML for ${file} at /posts/${htmlFileName}`);
		if (typeof data.categories === "string") { data.categories = [data.categories] }

		// Prepare metadata. You might also want to store the path to the generated HTML.
		const processCategories = (cats: string | string[] | undefined): string[] => {
			if (!cats) return ['uncategorized'];
			const categories = Array.isArray(cats) ? cats : [cats];
			return categories.map(cat => cat.toLowerCase());
		};

		const metadata = {
			slug: slug,
			file: file, // original markdown file name
			originalPath: `/src/posts/${file}`,
			htmlPath: `/posts/${htmlFileName}`, // relative path in your static folder
			title: data.title || 'Untitled',
			subtitle: data.subtitle || '',
			description: (data.description || content.slice(0, 200) + '...'),
			author: data.author || 'Anonymous',
			categories: processCategories(data.categories),
			displayCategories: Array.isArray(data.categories) 
				? data.categories 
				: (data.categories ? [data.categories] : ['Uncategorized']),
			date: data.date || new Date(),
			updated: data.updated || data.date,
			image: data.image || '',
			published: data.published !== false,  // default to true if not specified	
			...data
		} as PostMetadata;

		postsMetadata[slug] = metadata; //.push(metadata);
		
		// Aggregate by categories (assuming data.categories is an array).
		if (Array.isArray(data.categories)) {
			data.categories.forEach((cat) => {
				const lowerCat = cat.toLowerCase();
				if (!categoriesMap[lowerCat]) categoriesMap[lowerCat] = [];
				categoriesMap[lowerCat].push(slug);
			});
		}
		
		// Aggregate by year, assuming data.date is a date string.
		if (data.date) {
			const year = new Date(data.date).getFullYear().toString();
			if (!yearsMap[year]) yearsMap[year] = [];
			yearsMap[year].push(slug); // metadata);
		}
		
		// Aggregate by author
		if (metadata.author) {
			const author = metadata.author;
			if (!authorsMap[author]) authorsMap[author] = [];
			authorsMap[author].push(slug);
		}
	});
	
	// Write the aggregated metadata JSON file.
	const metadataOutputPath = path.join(dataDir, 'postsMetadata.json');
	fs.writeFileSync(metadataOutputPath, JSON.stringify(postsMetadata, null, 2));
	console.log(`Generated posts metadata JSON at ${metadataOutputPath}`);
	
	// Write the categories JSON file.
	const categoriesOutputPath = path.join(dataDir, 'categories.json');
	fs.writeFileSync(categoriesOutputPath, JSON.stringify(categoriesMap, null, 2));
	console.log(`Generated categories JSON at ${categoriesOutputPath}`);
	
	// Write the years JSON file.
	const yearsOutputPath = path.join(dataDir, 'years.json');
	fs.writeFileSync(yearsOutputPath, JSON.stringify(yearsMap, null, 2));
	console.log(`Generated years JSON at ${yearsOutputPath}`);
	
	// Write the authors JSON file
	const authorsOutputPath = path.join(dataDir, 'authors.json');
	fs.writeFileSync(authorsOutputPath, JSON.stringify(authorsMap, null, 2));
	console.log(`Generated authors JSON at ${authorsOutputPath}`);
}

/**
 * Vite plugin to generate a JSON file with markdown metadata and HTML conversion in separate files.
 * Also generates JSON files for categories and years.
 */
export function markdownMetadataPlugin() {
	return {
	  name: 'vite-plugin-markdown-metadata',
	  buildStart() {
		md2html(); // Will use default paths if no arguments provided
	  }
	};
}
  
md2html()