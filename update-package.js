import { execSync } from 'child_process';
import readline from 'readline';
import { readFileSync, writeFileSync } from 'fs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function updatePackage() {
  try {
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
    const currentVersion = packageJson.version;

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

    // Execute commands
    console.log('\nExecuting deployment steps...');
    
    execSync('pnpm build', { stdio: 'inherit' });
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "V${version} - ${message}"`, { stdio: 'inherit' });
    execSync('git push -u origin main', { stdio: 'inherit' });
    execSync('pnpm publish --access=public', { stdio: 'inherit' });

    console.log('\nDeployment completed successfully!');
  } catch (error) {
    console.error('\nError during deployment:', error.message);
  } finally {
    rl.close();
  }
}

updatePackage();