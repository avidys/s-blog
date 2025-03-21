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
    const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
    const exe = path.resolve(process.cwd(), 'dist/md2html.js');
    if (!existsSync(exe)) {
        console.error("md2html.js not found at path: ", exe);
      } else {
        console.log("md2html.js found at path: ", exe);
        return;
      }
    // Add or update scripts
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.md2html = `node ${exe}`;

    writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
    console.log('✓ Updated package.json with md2html script');
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