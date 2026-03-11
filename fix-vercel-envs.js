const { execSync } = require('child_process');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const envConfig = {};
for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        envConfig[match[1]] = match[2].trim();
    }
}

const keysToFix = [
    'GEMINI_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
];

for (const key of keysToFix) {
    if (envConfig[key]) {
        console.log(`Fixing ${key}...`);
        try {
            // Elimina la variable existente en production
            console.log(`Removing old ${key}...`);
            execSync(`npx vercel env rm ${key} production -y`, { stdio: 'inherit' });
        } catch (e) {
            console.log(`Could not remove ${key}, maybe it didn't exist.`);
        }

        try {
            // Agrega la variable limpia
            console.log(`Adding new clean ${key}...`);
            execSync(`npx vercel env add ${key} production`, {
                input: envConfig[key],
                stdio: ['pipe', 'inherit', 'inherit']
            });
            console.log(`Success fixing ${key}\n`);
        } catch (e) {
            console.error(`Failed to add ${key}`, e.message);
        }
    }
}
