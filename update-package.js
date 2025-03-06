import { execSync } from 'child_process';
import readline from 'readline';
import { readFileSync, writeFileSync } from 'fs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function execCommand(command, description) {
  console.log(`\n${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✓ ${description} completed`);
  } catch (error) {
    console.error(`✗ ${description} failed:`, error.message);
    throw error;
  }
}

async function updatePackage() {
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
    console.error('\n✗ Deployment failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

updatePackage();