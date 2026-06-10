const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib/sources.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update interface
content = content.replace(
  /url: \(\s*type: "movie" \| "tv",\s*id: string,\s*season\?: number,\s*episode\?: number,\s*lang\?: string\s*\) => string;/g,
  `url: (\n    type: "movie" | "tv",\n    id: string,\n    season?: number,\n    episode?: number,\n    themeHex?: string\n  ) => string;`
);

// 2. Replace url function signatures
// The existing ones have `(type, id, season, episode) =>`
content = content.replace(
  /\(type, id, season, episode\) =>/g,
  `(type, id, season, episode, themeHex) =>`
);

// 3. Replace encoded hex
content = content.replace(/%23e50914/g, `%23\${themeHex || '7c3aed'}`);

// 4. Replace unencoded hex
content = content.replace(/e50914/g, `\${themeHex || '7c3aed'}`);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated sources.ts for dynamic themes.');
