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

/**
 * Vite plugin to generate a JSON file with markdown metadata and HTML conversion in separate files.
 * Also generates JSON files for categories and years.
 */
export function markdownMetadataPlugin() {
	return {
	  name: 'vite-plugin-markdown-metadata',
	  buildStart() {
		// Define directories.
		const postsDir = path.resolve(__dirname, 'posts');
		const dataDir = path.resolve(__dirname, 'data'); // outut json
		const staticDir = path.resolve(__dirname, '../../static');
		const htmlOutputDir = path.join(staticDir, 'posts');
		
		// Ensure the output directory exists.
		if (!fs.existsSync(htmlOutputDir)) {
		  fs.mkdirSync(htmlOutputDir, { recursive: true });
		}
		
		// Read all markdown files in the posts directory.
		const files = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'));
		
		// Containers for aggregated data.
		const postsMetadata: Record<string, any> = {}; // any[] = [];
		const categoriesMap: Record<string, any[]> = {};
		const yearsMap: Record<string, any[]> = {};
		const authorsMap: Record<string, any[]> = {};
		
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
			
			// Prepare metadata. You might also want to store the path to the generated HTML.
			const metadata = {
				slug: slug,
				file: file, // original markdown file name
				originalPath: `/src/posts/${file}`,
				htmlPath: `/posts/${htmlFileName}`, // relative path in your static folder
				title: data.title || 'Untitled',
				subtitle: data.subtitle || '',
				description: (data.description || content.slice(0, 200) + '...'),
				author: data.author || 'Anonymous',
				categories: data.categories || ['Uncategorized'],
				date: data.date || new Date(),
				updated: data.updated || data.date,
				image: data.image || '',
				published: data.published !== false,  // default to true if not specified	
				...data
			};

			postsMetadata[slug] = metadata; //.push(metadata);
			
			// Aggregate by categories (assuming data.categories is an array).
			if (Array.isArray(data.categories)) {
				data.categories.forEach((cat) => {
				if (!categoriesMap[cat]) categoriesMap[cat] = [];
				categoriesMap[cat].push(slug); //metadata);
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
	};
}
  