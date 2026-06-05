const https = require('https');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/TMDB_API_KEY="?([^\r\n"]+)"?/);
const apiKey = match ? match[1] : '';

function fetchPage(page) {
  return new Promise((resolve) => {
    https.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&page=${page}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data).results));
    });
  });
}

async function run() {
  const p1 = await fetchPage(1);
  const p2 = await fetchPage(2);
  const p3 = await fetchPage(3);
  let all = [...(p1||[]), ...(p2||[]), ...(p3||[])].slice(0, 50);
  
  const formatted = all.filter(m => m.backdrop_path && m.poster_path).map(m => ({
    id: m.id,
    title: m.title || m.name,
    type: m.media_type,
    backdrop: m.backdrop_path,
    poster: m.poster_path,
    year: (m.release_date || m.first_air_date || '').substring(0, 4)
  }));
  
  if (!fs.existsSync('scratch')) fs.mkdirSync('scratch');
  fs.writeFileSync('scratch/trending_50.json', JSON.stringify(formatted, null, 2));
  console.log('Saved ' + formatted.length + ' items to scratch/trending_50.json');
}
run();
