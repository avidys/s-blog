import { readFileSync, writeFileSync, path } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

const exe = path.resolve(process.cwd(), 'dist/md2html.js');

// Add or update a script
pkg.scripts = pkg.scripts || {};
pkg.scripts.md2html = `node ${exe}`;

writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
console.log('Updated package.json with build script');