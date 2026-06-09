const fs = require('fs');
const path = require('path');

const providers = [
  { slug: 'netflix', name: 'Netflix', color: 'rgb(var(--brand-500))' },
  { slug: 'prime-video', name: 'Prime Video', color: '#00A8E1' },
  { slug: 'disney-plus', name: 'Disney+', color: '#113CCF' },
  { slug: 'max', name: 'Max', color: '#002BE7' },
  { slug: 'apple-tv-plus', name: 'Apple TV+', color: '#ffffff' },
  { slug: 'hulu', name: 'Hulu', color: '#1CE783' },
  { slug: 'paramount-plus', name: 'Paramount+', color: '#0064FF' },
  { slug: 'hotstar', name: 'Hotstar', color: '#0f065e' },
  { slug: 'jiocinema', name: 'JioCinema', color: '#C6007E' },
  { slug: 'sonyliv', name: 'SonyLIV', color: '#00B1B0' },
  { slug: 'zee5', name: 'ZEE5', color: '#8230C6' },
  { slug: 'crunchyroll', name: 'Crunchyroll', color: '#F47521' },
  { slug: 'canal-plus', name: 'Canal+', color: '#555555' },
  { slug: 'viaplay', name: 'Viaplay', color: '#FF1232' },
  { slug: 'stan', name: 'Stan', color: '#0061FF' },
  { slug: 'u-next', name: 'U-NEXT', color: '#21C4D4' },
  { slug: 'wavve', name: 'Wavve', color: '#013DFF' },
  { slug: 'britbox', name: 'BritBox', color: '#000B2B' },
  { slug: 'tubi-tv', name: 'Tubi', color: '#FF4F00' },
  { slug: 'pluto-tv', name: 'Pluto TV', color: '#F3E400' },
  { slug: 'mubi', name: 'MUBI', color: '#15065e' },
  { slug: 'shudder', name: 'Shudder', color: '#FF0000' },
  { slug: 'criterion-channel', name: 'Criterion Channel', color: '#8A7D6C' },
  { slug: 'plex', name: 'Plex', color: '#EBAF00' },
  { slug: 'curiosity-stream', name: 'Curiosity Stream', color: '#FFB81C' },
  { slug: 'peacock', name: 'Peacock', color: '#00A850' },
  { slug: 'funimation', name: 'Funimation', color: '#5B0BB5' },
  { slug: 'youtube-premium', name: 'YouTube Premium', color: '#FF0000' },
  { slug: 'rakuten-viki', name: 'Rakuten Viki', color: '#0862d0' },
  { slug: 'watcha', name: 'Watcha', color: '#FF0558' },
  { slug: 'eros-now', name: 'Eros Now', color: '#F48220' },
  { slug: 'mx-player', name: 'MX Player', color: '#0033CC' },
  { slug: 'voot', name: 'Voot', color: '#8A2BE2' },
  { slug: 'altbalaji', name: 'ALTT', color: '#E82A3A' },
  { slug: 'discovery-plus', name: 'discovery+', color: '#0055ff' },
  { slug: 'espn-plus', name: 'ESPN+', color: '#E31837' },
  { slug: 'starz', name: 'Starz', color: '#555555' },
  { slug: 'showtime', name: 'Showtime', color: 'rgb(var(--brand-500))' },
  { slug: 'amc-plus', name: 'AMC+', color: '#D4AF37' },
  { slug: 'acorn-tv', name: 'Acorn TV', color: '#1A4F41' }
];

const dir = path.join(__dirname, '../public/logos');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

providers.forEach(p => {
  const textColor = p.color === '#ffffff' ? '#000000' : '#ffffff';
  const bgColor = p.color === '#ffffff' ? '#ffffff' : p.color;
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <rect width="200" height="60" rx="8" fill="${bgColor}" />
  <text x="100" y="36" font-family="Arial, sans-serif" font-weight="bold" font-size="20" fill="${textColor}" text-anchor="middle">${p.name}</text>
</svg>`;

  fs.writeFileSync(path.join(dir, p.slug + '.svg'), svg);
});

console.log('Successfully generated ' + providers.length + ' placeholder SVGs.');
