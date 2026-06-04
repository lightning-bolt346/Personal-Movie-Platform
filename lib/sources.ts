export interface Source {
  id: string;
  name: string;         // Display name shown in Settings modal
  publicName: string;   // Name shown on player top bar (hides real URL-based name for top 7)
  type: "iframe" | "api";
  tier: 1 | 2;
  feature: string;
  hasPopups: boolean;
  noAds: boolean;
  autoDisableSandbox?: boolean; // e.g. peachify needs sandbox off
  sandboxFlags: string;
  url: (
    type: "movie" | "tv",
    id: string,
    season?: number,
    episode?: number,
    lang?: string
  ) => string;
}

export const NORMAL_SANDBOX = "allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock";
export const TIER_1_SANDBOX = NORMAL_SANDBOX;
export const TIER_2_SANDBOX = NORMAL_SANDBOX;

// TOP 7 — shown as "Server 1" through "Server 7" on the player top bar
// Their real names are only revealed inside the Settings modal
export const sources: Source[] = [
  {
    id: "cinemaos",
    name: "CinemaOS",
    publicName: "Server 1",
    type: "iframe",
    tier: 1,
    feature: "Ultra-fast premium streams · Zero ads · Crisp 1080p · No popups · Best for movies",
    hasPopups: false,
    noAds: true,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://cinemaos.tech/player/${id}`
        : `https://cinemaos.tech/player/${id}/${season}/${episode}`
  },
  {
    id: "cinesrc",
    name: "CineSrc",
    publicName: "Server 2",
    type: "iframe",
    tier: 1,
    feature: "Auto-play enabled · Premium servers · Ad-free · Reliable uptime · Great for TV shows",
    hasPopups: false,
    noAds: true,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://cinesrc.st/embed/movie/${id}?color=%23e50914&autoplay=true`
        : `https://cinesrc.st/embed/tv/${id}?s=${season}&e=${episode}&color=%23e50914&autoplay=true`
  },
  {
    id: "vidsrcwtf1",
    name: "VidSrc Multi-Server",
    publicName: "Server 3",
    type: "iframe",
    tier: 1,
    feature: "Aggregates multiple servers automatically · Switches to best source · Zero ads",
    hasPopups: false,
    noAds: true,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://vidsrc.wtf/1/movie/${id}?color=e50914`
        : `https://vidsrc.wtf/1/tv/${id}/${season}/${episode}?color=e50914`
  },
  {
    id: "peachify",
    name: "Peachify",
    publicName: "Server 4",
    type: "iframe",
    tier: 1,
    feature: "Multilingual subtitles & dubs · Smart fallbacks · Works well on mobile — Note: may show ads/redirects",
    hasPopups: true,
    noAds: false,
    autoDisableSandbox: true, // Sandbox auto-disabled for this server
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://peachify.top/embed/movie/${id}?accent=e50914`
        : `https://peachify.top/embed/tv/${id}/${season}/${episode}?accent=e50914`
  },
  {
    id: "autoembed",
    name: "AutoEmbed",
    publicName: "Server 5",
    type: "iframe",
    tier: 1,
    feature: "TMDB exact-match engine · Zero ads · Instant source selection · Wide library coverage",
    hasPopups: false,
    noAds: true,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://autoembed.co/movie/tmdb/${id}?color=e50914`
        : `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}?color=e50914`
  },
  {
    id: "vidsrcwtf2",
    name: "VidSrc Multi-Lang",
    publicName: "Server 6",
    type: "iframe",
    tier: 1,
    feature: "Extensive multi-language subtitles & dubs · Great for international content · Zero ads",
    hasPopups: false,
    noAds: true,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://vidsrc.wtf/2/movie/${id}?color=e50914`
        : `https://vidsrc.wtf/2/tv/${id}/${season}/${episode}?color=e50914`
  },
  {
    id: "smashystream",
    name: "SmashyStream",
    publicName: "Server 7",
    type: "iframe",
    tier: 1,
    feature: "Extensive backup links · Multi-language subtitles · High uptime · Good fallback option",
    hasPopups: true,
    noAds: true,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://embed.smashystream.com/playere.php?tmdb=${id}&color=e50914`
        : `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${season}&episode=${episode}&color=e50914`
  },

  // ── Additional Servers (shown with real names) ───────────────────────────
  {
    id: "mappletv",
    name: "MappleTV",
    publicName: "MappleTV",
    type: "iframe",
    tier: 1,
    feature: "HD streams with consistent uptime",
    hasPopups: false,
    noAds: false,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://mapple.uk/watch/movie/${id}`
        : `https://mapple.uk/watch/tv/${id}-${season}-${episode}`
  },
  {
    id: "111movies",
    name: "111Movies",
    publicName: "111Movies",
    type: "iframe",
    tier: 1,
    feature: "Fast global CDN, auto-selects highest quality",
    hasPopups: true,
    noAds: false,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://111movies.net/movie/${id}?color=e50914`
        : `https://111movies.net/tv/${id}/${season}/${episode}?color=e50914`
  },
  {
    id: "rivestream",
    name: "RiveStream",
    publicName: "RiveStream",
    type: "iframe",
    tier: 1,
    feature: "Powerful aggregator with Best Server mode",
    hasPopups: false,
    noAds: false,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://rivestream.ru/embed?type=movie&id=${id}&agg=2`
        : `https://rivestream.ru/embed?type=tv&id=${id}&season=${season}&episode=${episode}&agg=2`
  },
  {
    id: "vidking",
    name: "VidKing",
    publicName: "VidKing",
    type: "iframe",
    tier: 1,
    feature: "High-bitrate streams & lightning-fast loading",
    hasPopups: false,
    noAds: false,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://www.vidking.net/embed/movie/${id}?color=e50914`
        : `https://www.vidking.net/embed/tv/${id}/${season}/${episode}?color=e50914`
  },
  {
    id: "vixsrc",
    name: "VixSrc",
    publicName: "VixSrc",
    type: "iframe",
    tier: 1,
    feature: "Clean API, rapid fetching, high uptime",
    hasPopups: false,
    noAds: false,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://vixsrc.to/movie/${id}`
        : `https://vixsrc.to/tv/${id}/${season}/${episode}`
  },
  {
    id: "embedmaster",
    name: "EmbedMaster",
    publicName: "EmbedMaster",
    type: "iframe",
    tier: 1,
    feature: "Versatile sources, robust custom player",
    hasPopups: true,
    noAds: false,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://embedmaster.link/movie/${id}`
        : `https://embedmaster.link/tv/${id}/${season}/${episode}`
  },
  {
    id: "vidzee",
    name: "Vidzee",
    publicName: "Vidzee",
    type: "iframe",
    tier: 1,
    feature: "Ultra-fast direct MP4 streaming",
    hasPopups: false,
    noAds: false,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://player.vidzee.wtf/embed/movie/${id}?color=e50914`
        : `https://player.vidzee.wtf/embed/tv/${id}/${season}/${episode}?color=e50914`
  },
  {
    id: "vidfast",
    name: "Vidfast",
    publicName: "Vidfast",
    type: "iframe",
    tier: 1,
    feature: "Low latency, optimized for all devices",
    hasPopups: false,
    noAds: false,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://vidfast.pro/movie/${id}?color=e50914`
        : `https://vidfast.pro/tv/${id}/${season}/${episode}?color=e50914`
  },
  {
    id: "nontongo",
    name: "NontonGo",
    publicName: "NontonGo",
    type: "iframe",
    tier: 1,
    feature: "Active streaming API, fast, multiple sources",
    hasPopups: false,
    noAds: false,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://www.nontongo.win/embed/movie/${id}`
        : `https://www.nontongo.win/embed/tv/${id}/${season}/${episode}`
  },
  {
    id: "vidnest",
    name: "VidNest",
    publicName: "VidNest",
    type: "iframe",
    tier: 1,
    feature: "Ad-free, professional-grade, multi-server",
    hasPopups: false,
    noAds: false,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://vidnest.fun/movie/${id}`
        : `https://vidnest.fun/tv/${id}/${season}/${episode}`
  },
  {
    id: "vidcore",
    name: "VidCore",
    publicName: "VidCore",
    type: "iframe",
    tier: 1,
    feature: "Blazing fast streaming, next-gen infrastructure",
    hasPopups: false,
    noAds: false,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://vidcore.net/embed/movie/${id}`
        : `https://vidcore.net/embed/tv/${id}/${season}/${episode}`
  },
  {
    id: "vidsrcwtf3",
    name: "VidSrc Multi-Embeds",
    publicName: "VidSrc Multi-Embeds",
    type: "iframe",
    tier: 1,
    feature: "Multiple robust embed fallback options",
    hasPopups: false,
    noAds: false,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://vidsrc.wtf/3/movie/${id}?color=e50914`
        : `https://vidsrc.wtf/3/tv/${id}/${season}/${episode}?color=e50914`
  },
  {
    id: "vidsrcwtf4",
    name: "VidSrc Premium",
    publicName: "VidSrc Premium",
    type: "iframe",
    tier: 1,
    feature: "Top-tier bandwidth with premium servers",
    hasPopups: false,
    noAds: false,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://vidsrc.wtf/4/movie/${id}?color=e50914`
        : `https://vidsrc.wtf/4/tv/${id}/${season}/${episode}?color=e50914`
  },
  {
    id: "vidrock",
    name: "VidRock",
    publicName: "VidRock",
    type: "iframe",
    tier: 1,
    feature: "Stable high quality Russian backend",
    hasPopups: false,
    noAds: false,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://vidrock.ru/embed/movie/${id}`
        : `https://vidrock.ru/embed/tv/${id}/${season}/${episode}`
  },
  {
    id: "vidlink",
    name: "VidLink",
    publicName: "VidLink",
    type: "iframe",
    tier: 2,
    feature: "Vast legacy library, reliable fallbacks",
    hasPopups: true,
    noAds: false,
    sandboxFlags: TIER_2_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://vidlink.pro/movie/${id}?autoplay=false&primaryColor=e50914`
        : `https://vidlink.pro/tv/${id}/${season}/${episode}?autoplay=false&primaryColor=e50914`
  },
  {
    id: "vidsrcme",
    name: "VidSrc.me",
    publicName: "VidSrc.me",
    type: "iframe",
    tier: 2,
    feature: "Massive library, decent speed",
    hasPopups: true,
    noAds: false,
    sandboxFlags: TIER_2_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://vidsrc.me/embed/movie/${id}?color=e50914`
        : `https://vidsrc.me/embed/tv/${id}/${season}/${episode}?color=e50914`
  },
  {
    id: "vidsrcto",
    name: "VidSrc.to",
    publicName: "VidSrc.to",
    type: "iframe",
    tier: 2,
    feature: "Secondary massive catalog fallback",
    hasPopups: true,
    noAds: false,
    sandboxFlags: TIER_2_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://vidsrc.to/embed/movie/${id}?color=e50914`
        : `https://vidsrc.to/embed/tv/${id}/${season}/${episode}?color=e50914`
  },
  {
    id: "videasy",
    name: "VidEasy",
    publicName: "VidEasy",
    type: "iframe",
    tier: 2,
    feature: "Lightweight player, good fallbacks",
    hasPopups: false,
    noAds: false,
    sandboxFlags: TIER_2_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://player.videasy.net/movie/${id}?color=e50914`
        : `https://player.videasy.net/tv/${id}/${season}/${episode}?color=e50914`
  },
  {
    id: "2embed",
    name: "2Embed",
    publicName: "2Embed",
    type: "iframe",
    tier: 2,
    feature: "Varied quality streams & alternatives",
    hasPopups: true,
    noAds: false,
    sandboxFlags: TIER_2_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://www.2embed.cc/embed/${id}?color=e50914`
        : `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}&color=e50914`
  }
];

export const TOP_7_IDS = ["cinemaos", "cinesrc", "vidsrcwtf1", "peachify", "autoembed", "vidsrcwtf2", "smashystream"];

export const getSource = (id?: string): Source =>
  sources.find((s) => s.id === id) || sources[0];

// ── Server codenames for URL sharing ─────────────────────────────────────────
// Real server IDs are NEVER exposed in shared links.
// ?server=alpha, ?server=beta etc. are what users see.
const SERVER_CODENAMES: Record<string, string> = {
  // Top 7 — greek alphabet
  'cinemaos':     'alpha',
  'cinesrc':      'beta',
  'vidsrcwtf1':   'nova',
  'peachify':     'delta',
  'autoembed':    'echo',
  'vidsrcwtf2':   'sigma',
  'smashystream': 'omega',
  // Additional servers — planet names
  'mappletv':     'mars',
  '111movies':    'saturn',
  'rivestream':   'venus',
  'vidking':      'titan',
  'vixsrc':       'pluto',
  'embedmaster':  'orbit',
  'vidzee':       'comet',
  'vidfast':      'pulsar',
  'nontongo':     'quasar',
  'vidnest':      'nebula',
  'vidcore':      'zenith',
  'vidsrcwtf3':   'nexus',
  'vidsrcwtf4':   'apex',
  'vidrock':      'forge',
  'vidlink':      'relay',
  'vidsrcme':     'vault',
  'vidsrcto':     'prism',
  'videasy':      'pixel',
  '2embed':       'surge',
};

// Reverse lookup: codename → real id
const CODENAME_TO_SERVER: Record<string, string> = Object.fromEntries(
  Object.entries(SERVER_CODENAMES).map(([realId, code]) => [code, realId])
);

/** Convert a real server id → URL-safe codename */
export function encodeServer(realId: string): string {
  return SERVER_CODENAMES[realId] ?? realId;
}

/** Convert a URL codename → real server id */
export function decodeServer(code: string): string {
  return CODENAME_TO_SERVER[code] ?? code;
}
