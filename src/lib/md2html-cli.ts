#!/usr/bin/env node

import { md2html } from './md2html.js';

console.log('\n📝 Markdown to HTML Converter');
console.log('===========================');
console.log('This script will:');
console.log('1. Convert markdown files to HTML');
console.log('2. Generate metadata files');
console.log('3. Create category and year indexes\n');

try {
  md2html();
  console.log('\n✓ Conversion completed successfully!');
} catch (error) {
  if (error instanceof Error) {
    console.error('\n✗ Conversion failed:', error.message);
  } else {
    console.error('\n✗ Conversion failed:', error);
  }
  process.exit(1);
} 