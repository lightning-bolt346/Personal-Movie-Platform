export interface Source {
  id: string;
  name: string;
  type: "iframe" | "api";
  tier: 1 | 2;
  feature: string;
  hasPopups: boolean;
  noAds: boolean;
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

export const sources: Source[] = [
  // TIER 1 - Sandbox-Friendly & Reliable
  {
    id: "cinemaos",
    name: "CinemaOS",
    type: "iframe",
    tier: 1,
    feature: "Ultra-fast premium player, high reliability",
    hasPopups: false,
    noAds: true,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://cinemaos.tech/player/${id}`
        : `https://cinemaos.tech/player/${id}/${season}/${episode}`
  },
  {
    id: "mappletv",
    name: "MappleTV",
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
    id: "smashystream",
    name: "SmashyStream",
    type: "iframe",
    tier: 1,
    feature: "Extensive backup links & multi-language subtitles",
    hasPopups: true,
    noAds: true,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://embed.smashystream.com/playere.php?tmdb=${id}&color=e50914`
        : `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${season}&episode=${episode}&color=e50914`
  },
  {
    id: "rivestream",
    name: "RiveStream",
    type: "iframe",
    tier: 1,
    feature: "Powerful aggregator (Best Server mode)",
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
    id: "peachify",
    name: "Peachify",
    type: "iframe",
    tier: 1,
    feature: "Multilingual support, smart fallbacks",
    hasPopups: false,
    noAds: false,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://peachify.top/embed/movie/${id}?accent=e50914`
        : `https://peachify.top/embed/tv/${id}/${season}/${episode}?accent=e50914`
  },
  {
    id: "vidrock",
    name: "VidRock",
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
    id: "vidsrcwtf1",
    name: "VidSrc.wtf (Multi Server)",
    type: "iframe",
    tier: 1,
    feature: "Aggregates multiple servers automatically",
    hasPopups: false,
    noAds: true,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://vidsrc.wtf/1/movie/${id}?color=e50914`
        : `https://vidsrc.wtf/1/tv/${id}/${season}/${episode}?color=e50914`
  },
  {
    id: "vidsrcwtf2",
    name: "VidSrc.wtf (Multi Lang)",
    type: "iframe",
    tier: 1,
    feature: "Extensive multi-language subtitles/dubs",
    hasPopups: false,
    noAds: true,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://vidsrc.wtf/2/movie/${id}?color=e50914`
        : `https://vidsrc.wtf/2/tv/${id}/${season}/${episode}?color=e50914`
  },
  {
    id: "vidsrcwtf3",
    name: "VidSrc.wtf (Multi Embeds)",
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
    name: "VidSrc.wtf (Premium)",
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

  // TIER 2 - Slower, More Ads, or Fallbacks
  {
    id: "cinesrc",
    name: "CineSrc (Premium)",
    type: "iframe",
    tier: 1,
    feature: "Autoplay enabled, reliable premium servers",
    hasPopups: false,
    noAds: true,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://cinesrc.st/embed/movie/${id}?color=%23e50914&autoplay=true`
        : `https://cinesrc.st/embed/tv/${id}?s=${season}&e=${episode}&color=%23e50914&autoplay=true`
  },
  {
    id: "vidlink",
    name: "VidLink",
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
    id: "autoembed",
    name: "AutoEmbed",
    type: "iframe",
    tier: 1,
    feature: "Automatic TMDB exact matching engine",
    hasPopups: false,
    noAds: true,
    sandboxFlags: TIER_1_SANDBOX,
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://autoembed.co/movie/tmdb/${id}?color=e50914`
        : `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}?color=e50914`
  },
  {
    id: "vidsrcme",
    name: "VidSrc.me",
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

export const getSource = (id?: string): Source =>
  sources.find((s) => s.id === id) || sources[0];
