#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

/**
 * Script to update package.json with md2html build command
 * 
 * This script:
 * 1. Reads the package.json file
 * 2. Resolves the path to md2html.js executable
 * 3. Adds or updates the md2html script in package.json
 * 4. Writes the updated package.json back to disk
 */

function updatePackageJson() {
  try {
    // Get the parent project's directory (where s-blog is being installed)
    const parentDir = process.env.INIT_CWD || process.cwd();
    const packageJsonPath = path.join(parentDir, 'package.json');
    
    if (!existsSync(packageJsonPath)) {
      console.error(`Package.json not found at ${packageJsonPath}`);
      return;
    }
    
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    
    // Use the node_modules path to locate md2html.js
    // If not found at the primary location, check secondary locations
    const alternativePaths = [
      path.join('.','md2html.ts'),
      path.join('.','src', 'md2html.ts'),
      path.join('.','src', 'lib', 'md2html.ts'),
      path.join('.','node_modules', '@avidys', 's-blog', 'dist', 'md2html.js'),
      path.join(parentDir, 'node_modules', '@avidys', 's-blog', 'dist', 'md2html.js'),
      path.join(process.cwd(), 'node_modules', '@avidys', 's-blog', 'dist', 'md2html.js'),
      path.join('.','node_modules', 's-blog', 'dist', 'md2html.js'),
      path.join(parentDir, 'node_modules', 's-blog', 'dist', 'md2html.js'),
      path.join(process.cwd(), 'node_modules', 's-blog', 'dist', 'md2html.js')
    ];

    let md2htmlPath = '';
    for (const altPath of alternativePaths) {
      if (existsSync(altPath)) {
        md2htmlPath = altPath;
        break;
      }
    }
    
    if (!existsSync(md2htmlPath)) {
      console.error("ERROR: md2html.js not found. Please ensure s-blog is properly installed.");
      console.error("Tried looking at paths:", alternativePaths);
      return;
    }
    
    console.log("md2html.js found at path:", md2htmlPath);

    // Abbreviate path if it's in the parent directory
    const displayPath = md2htmlPath.startsWith(parentDir) 
      ? path.relative(parentDir, md2htmlPath)
      : md2htmlPath;

    // Add or update scripts
    pkg.scripts = pkg.scripts || {};
    const isTypeScript = md2htmlPath.endsWith('.ts');
    const command = isTypeScript ? 'npx tsx' : 'node';
    pkg.scripts.md2html = `${command} "${displayPath}"`;
    pkg.scripts.blog_update = `${command} "${displayPath}"`;

    // Make sure the paths are properly escaped for cross-platform compatibility
    if (process.platform === 'win32') {
      pkg.scripts.md2html = pkg.scripts.md2html.replace(/\\/g, '\\\\');
      pkg.scripts.blog_update = pkg.scripts.blog_update.replace(/\\/g, '\\\\');
    }

    writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
    console.log('✓ Updated package.json with md2html and blog_update scripts');
    console.log('  You can now run "npm run blog_update" to generate HTML from your markdown files');
  } catch (error) {
    if (error instanceof Error) {
      console.error('✗ Failed to update package.json:', error.message);
    } else {
      console.error('✗ Failed to update package.json:', error);
    }
    process.exit(1);
  }
}

updatePackageJson(); 