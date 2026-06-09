import { tmdb } from './lib/tmdb';

async function test() {
  const res = await fetch(`https://api.themoviedb.org/3/movie/155/watch/providers?api_key=${process.env.TMDB_API_KEY}`);
  const data = await res.json();
  console.log(data);
}

test();
