/**
 * Package Update and Deployment Script
 * 
 * This script automates the version update and deployment process:
 * 1. Shows current git status
 * 2. Displays current version and prompts for new version
 * 3. Requests a commit message
 * 4. Executes deployment sequence:
 *    - Builds the project
 *    - Commits changes with version
 *    - Creates git tag
 *    - Pushes to remote with tags
 *    - Publishes to npm
 */

import { execSync } from 'child_process';
import readline from 'readline';
import { readFileSync, writeFileSync } from 'fs';

// Print script description
console.log('\n📦 Package Update and Deployment Script');
console.log('=====================================');
console.log('This script will:');
console.log('1. Show current git status');
console.log('2. Update package version');
console.log('3. Build the project');
console.log('4. Commit and tag changes');
console.log('5. Push to remote repository');
console.log('6. Publish to npm registry\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * @param {string} command
 * @param {string} description
 */
async function execCommand(command, description) {
  console.log(`\n${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✓ ${description} completed`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`✗ ${description} failed:`, error.message);
    } else {
      console.error(`✗ ${description} failed:`, error);
    }
    throw error;
  }
}

export default async function updatePackage() {
  try {
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
    const currentVersion = packageJson.version;

    await execCommand('git status', 'git status');

    // Prompt for version and message
    const version = await new Promise(resolve => {
      rl.question(`Enter new version (current: ${currentVersion}): `, resolve);
    });

    const message = await new Promise(resolve => {
      rl.question('Enter commit message: ', resolve);
    });

    // Update package.json version
    packageJson.version = version;
    writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

    console.log('\nStarting deployment sequence...');
    
    await execCommand('pnpm build', 'Building project');
    await execCommand('git add .', 'Staging changes');
    await execCommand(`git commit -m "V${version} - ${message}"`, 'Committing changes');
    await execCommand(`git tag -a v${version} -m "Version ${version}"`, 'Creating git tag');
    await execCommand('git push -u origin main --tags', 'Pushing to remote with tags');
    await execCommand('pnpm publish --access=public', 'Publishing to npm');

    console.log('\n✓ Deployment completed successfully!');
  } catch (error) {
    if (error instanceof Error) {
      console.error('\n✗ Deployment failed:', error.message);
    } else {
      console.error('\n✗ Deployment failed:', error);
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}

updatePackage();