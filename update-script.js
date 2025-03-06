import { readFileSync, writeFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

// Add or update a script
pkg.scripts = pkg.scripts || {};
pkg.scripts.testbuild = "vite build";

writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
console.log('Updated package.json with build script');