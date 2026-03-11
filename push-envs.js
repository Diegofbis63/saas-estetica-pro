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

const keysToSet = [
    'GEMINI_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
];

for (const key of keysToSet) {
    if (envConfig[key]) {
        console.log(`Setting ${key} in Vercel production...`);
        try {
            execSync(`npx vercel env add ${key} production`, {
                input: envConfig[key],
                stdio: ['pipe', 'inherit', 'inherit']
            });
            console.log(`Success setting ${key}\n`);
        } catch (e) {
            console.error(`Failed to set ${key}`, e.message);
        }
    }
}
