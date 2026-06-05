const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.TMDB_API_KEY || '3734dfa78758186d2ba5e7db031933ca'; // Fallback to key found in logs
const PUBLIC_LOGOS_DIR = path.join(__dirname, '../public/logos');

const PROVIDERS = [
  { id: 8, slug: 'netflix' },
  { id: 9, slug: 'prime-video' },
  { id: 337, slug: 'disney-plus' },
  { id: 1899, slug: 'max' },
  { id: 350, slug: 'apple-tv-plus' },
  { id: 15, slug: 'hulu' },
  { id: 531, slug: 'paramount-plus' },
  { id: 122, slug: 'hotstar' },
  { id: 220, slug: 'jiocinema' },
  { id: 237, slug: 'sonyliv' },
  { id: 232, slug: 'zee5' },
  { id: 283, slug: 'crunchyroll' },
  { id: 381, slug: 'canal-plus' },
  { id: 76, slug: 'viaplay' },
  { id: 38, slug: 'stan' },
  { id: 49, slug: 'u-next' },
  { id: 356, slug: 'wavve' },
  { id: 151, slug: 'britbox' },
  { id: 73, slug: 'tubi-tv' },
  { id: 300, slug: 'pluto-tv' },
  { id: 11, slug: 'mubi' },
  { id: 99, slug: 'shudder' },
  { id: 258, slug: 'criterion-channel' },
  { id: 538, slug: 'plex' },
  { id: 190, slug: 'curiosity-stream' },
  { id: 386, slug: 'peacock' },
  { id: 269, slug: 'funimation' },
  { id: 188, slug: 'youtube-premium' },
  { id: 344, slug: 'rakuten-viki' },
  { id: 97, slug: 'watcha' },
  { id: 218, slug: 'eros-now' },
  { id: 226, slug: 'mx-player' },
  { id: 121, slug: 'voot' },
  { id: 235, slug: 'altbalaji' },
  { id: 584, slug: 'discovery-plus' },
  { id: 149, slug: 'espn-plus' },
  { id: 43, slug: 'starz' },
  { id: 37, slug: 'showtime' },
  { id: 526, slug: 'amc-plus' },
  { id: 87, slug: 'acorn-tv' },
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  if (!fs.existsSync(PUBLIC_LOGOS_DIR)) {
    fs.mkdirSync(PUBLIC_LOGOS_DIR, { recursive: true });
  }

  console.log('Fetching global provider lists from TMDB...');
  const [moviesRes, tvRes] = await Promise.all([
    fetchJson(`https://api.themoviedb.org/3/watch/providers/movie?api_key=${API_KEY}`),
    fetchJson(`https://api.themoviedb.org/3/watch/providers/tv?api_key=${API_KEY}`)
  ]);

  const allProviders = [...(moviesRes.results || []), ...(tvRes.results || [])];
  
  // Map of provider_id to logo_path
  const logoMap = {};
  for (const p of allProviders) {
    if (p.logo_path) {
      logoMap[p.provider_id] = p.logo_path;
    }
  }

  const updates = [];

  for (const provider of PROVIDERS) {
    const logoPath = logoMap[provider.id];
    if (!logoPath) {
      console.warn(`⚠️ No logo found for ${provider.slug} (ID: ${provider.id})`);
      continue;
    }

    const extension = path.extname(logoPath) || '.jpg';
    const filename = `${provider.slug}${extension}`;
    const dest = path.join(PUBLIC_LOGOS_DIR, filename);
    const url = `https://image.tmdb.org/t/p/original${logoPath}`;

    try {
      await downloadImage(url, dest);
      console.log(`✅ Downloaded ${filename}`);
      updates.push({ slug: provider.slug, ext: extension });
    } catch (err) {
      console.error(`❌ Error downloading ${provider.slug}:`, err.message);
    }
  }

  if (updates.length > 0) {
    console.log('Updating lib/providers.ts to point to new image extensions...');
    const providersFilePath = path.join(__dirname, '../lib/providers.ts');
    let content = fs.readFileSync(providersFilePath, 'utf8');

    for (const update of updates) {
      // replace /logos/slug.svg with /logos/slug.jpg
      const regex = new RegExp(`logo: '/logos/${update.slug}\\.svg'`, 'g');
      content = content.replace(regex, `logo: '/logos/${update.slug}${update.ext}'`);
    }

    fs.writeFileSync(providersFilePath, content, 'utf8');
    console.log('✅ Updated lib/providers.ts successfully!');
  }
}

run().catch(console.error);
