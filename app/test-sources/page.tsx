'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { sources, getSource, TIER_1_SANDBOX, TIER_2_SANDBOX } from '@/lib/sources';
import { Shield, ShieldOff, Play, Server, ExternalLink, ArrowLeft, Terminal, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

const API_PRESETS = [
  {
    name: "TMDB Embed API (Inside4ndroid)",
    url: "http://localhost:8787/api/streams/{type}/{tmdbId}",
    notes: "Aggregator API returning JSON stream objects from 10+ providers. Built-in m3u8/ts proxy layers."
  },
  {
    name: "4KHDHub Scraper",
    url: "http://localhost:8787/api/streams/4khdhub/{type}/{tmdbId}",
    notes: "Direct link scraper returning direct file links. Active inside TMDB Embed API."
  },
  {
    name: "LordFlix (9-Server Scraper)",
    url: "http://localhost:8787/api/streams/lordflix/{type}/{tmdbId}",
    notes: "Replaced Vidsync. Active via enc-dec.app relay."
  },
  {
    name: "NoTorrent Stremio Bridge",
    url: "http://localhost:8787/api/streams/notorrent/{type}/{tmdbId}",
    notes: "Addon API bridge for Stremio direct scrapers."
  },
  {
    name: "DahmerMovies Open-Directory",
    url: "http://localhost:8787/api/streams/dahmermovies/{type}/{tmdbId}",
    notes: "Direct file links scraped from open directories with proxy rewrite."
  },
  {
    name: "CinePro Multi-Site Scraper",
    url: "http://localhost:8787/api/streams/cinepro/{type}/{tmdbId}",
    notes: "Backend scraper returning up to 50+ unique playable sources per media."
  }
];

function TestSourcesClient() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '85552'; 
  const initialType = (searchParams.get('type') || 'tv') as 'movie' | 'tv';
  const initialSeason = searchParams.get('season') ? parseInt(searchParams.get('season')!) : 1;
  const initialEpisode = searchParams.get('episode') ? parseInt(searchParams.get('episode')!) : 1;

  const [id, setId] = useState(initialId);
  const [type, setType] = useState<'movie' | 'tv'>(initialType);
  const [season, setSeason] = useState(initialSeason);
  const [episode, setEpisode] = useState(initialEpisode);

  const [selectedSourceId, setSelectedSourceId] = useState(sources[0].id);
  const [useSandbox, setUseSandbox] = useState(true);
  
  const [customUrl, setCustomUrl] = useState('');
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [isApiEndpoint, setIsApiEndpoint] = useState(false);
  const [useCorsProxy, setUseCorsProxy] = useState(false);
  const [corsProxyUrl, setCorsProxyUrl] = useState('https://corsproxy.io/?');
  
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  const currentSource = getSource(selectedSourceId);
  
  // Logic to process the URL dynamically
  const getProcessedUrl = () => {
    let rawUrl = '';
    
    if (useCustomUrl && customUrl) {
       rawUrl = customUrl;
       
       // Auto-detect videasy or similar base patterns if pasted without placeholders
       if (rawUrl.endsWith('/movie/')) {
           rawUrl += '{tmdbId}';
       } else if (rawUrl.endsWith('/tv/')) {
           rawUrl += '{tmdbId}/{season}/{episode}';
       }
       
       // Replace placeholders
       return rawUrl
          .replace(/\{tmdbId\}/g, id)
          .replace(/\{season\}/g, season.toString())
          .replace(/\{episode\}/g, episode.toString());
    }
    
    return currentSource.url(type, id, season, episode);
  };

  const embedUrl = getProcessedUrl();

  const handleSourceChange = (newSourceId: string) => {
    const s = getSource(newSourceId);
    setSelectedSourceId(s.id);
    setUseSandbox(true);
    setUseCustomUrl(false);
    setIsApiEndpoint(s.type === 'api');
  };
  
  // Effect for fetching API endpoints automatically when URL changes
  useEffect(() => {
     if (isApiEndpoint && embedUrl && embedUrl.startsWith('http')) {
        setApiLoading(true);
        const isLocalhost = embedUrl.includes('localhost') || embedUrl.includes('127.0.0.1');
        const fetchUrl = (useCorsProxy && !isLocalhost) 
          ? `${corsProxyUrl}${encodeURIComponent(embedUrl)}`
          : embedUrl;

        fetch(fetchUrl)
          .then(res => res.json().catch(() => res.text()))
          .then(data => {
             setApiResponse(typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
             setApiLoading(false);
          })
          .catch(err => {
             setApiResponse(`Error: ${err.message}\n\nTip: If you get a CORS or Network error, try enabling the "Fetch via CORS Proxy" option below!`);
             setApiLoading(false);
          });
     }
  }, [embedUrl, isApiEndpoint, useCorsProxy, corsProxyUrl]);

  return (
    <div className="relative min-h-screen pt-24 pb-12 px-4 md:px-8 flex flex-col gap-8 max-w-7xl mx-auto">
      <AnimatedBackground />

      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 font-bold uppercase tracking-wider text-xs">
          <ArrowLeft size={16} /> Back to App
        </Link>
        <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">Advanced Source Tester</h1>
        <p className="text-zinc-400 max-w-2xl">Evaluate streaming APIs for reliability, redirect behavior, and API responses. Supports <code>{'{tmdbId}'}</code>, <code>{'{season}'}</code>, and <code>{'{episode}'}</code> placeholders in the custom URL field.</p>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="col-span-1 flex flex-col gap-6">
          {/* Target Media */}
          <div className="bg-void-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Target Media</h2>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setType('movie')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${type === 'movie' ? 'bg-premium-gradient text-white' : 'bg-void-900 text-zinc-400 hover:bg-zinc-800'}`}
                >
                  Movie
                </button>
                <button
                  onClick={() => setType('tv')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${type === 'tv' ? 'bg-premium-gradient text-white' : 'bg-void-900 text-zinc-400 hover:bg-zinc-800'}`}
                >
                  TV Show
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">TMDB ID</label>
                <input
                  type="text"
                  value={id}
                  onChange={e => setId(e.target.value)}
                  className="w-full bg-void-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-500 transition-colors"
                  placeholder="e.g., 157336 for Interstellar"
                />
              </div>

              {type === 'tv' && (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Season</label>
                    <input
                      type="number"
                      value={season}
                      onChange={e => setSeason(parseInt(e.target.value) || 1)}
                      className="w-full bg-void-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-500 transition-colors"
                      min="1"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Episode</label>
                    <input
                      type="number"
                      value={episode}
                      onChange={e => setEpisode(parseInt(e.target.value) || 1)}
                      className="w-full bg-void-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-500 transition-colors"
                      min="1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Provider Selection */}
          <div className="bg-void-950 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Select Provider</h2>
            <div data-lenis-prevent="true" className="flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mb-4">
              {sources.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSourceChange(s.id)}
                  className={`flex flex-col text-left px-4 py-3 rounded-xl transition-all border ${selectedSourceId === s.id && !useCustomUrl ? 'bg-brand-500/10 border-brand-500/30 text-white' : 'bg-void-900 border-zinc-800 text-zinc-400 hover:bg-void-800'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Server size={14} className={selectedSourceId === s.id && !useCustomUrl ? 'text-brand-500' : 'text-zinc-500'} />
                    <span className="font-bold text-sm">{s.name}</span>
                    <div className="flex items-center gap-1.5 ml-auto">
                        {s.tier === 1 && <span className="text-[9px] uppercase tracking-wider bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded border border-green-500/20">Tier 1</span>}
                        {s.tier === 2 && <span className="text-[9px] uppercase tracking-wider bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded border border-orange-500/20">Tier 2</span>}
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500 break-all leading-tight">{s.url(type, id, season, episode)}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex justify-between">
                  <span>Custom URL / Endpoint</span>
                  <span className="text-[9px] lowercase opacity-50 font-mono">use {'{tmdbId}'}, {'{season}'}, {'{episode}'}</span>
                </label>
                <input
                  type="text"
                  value={customUrl}
                  onChange={e => { setCustomUrl(e.target.value); setUseCustomUrl(true); }}
                  onFocus={() => setUseCustomUrl(true)}
                  className="w-full bg-void-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500 transition-colors"
                  placeholder="https://player.videasy.net/movie/{tmdbId}"
                />
              </div>

              {/* API and Proxy Controls */}
              <div className="bg-void-900 border border-zinc-800/50 rounded-xl p-3.5 flex flex-col gap-3">
                <label className="flex items-start gap-2.5 text-xs font-bold text-zinc-300 cursor-pointer">
                   <input 
                     type="checkbox" 
                     checked={isApiEndpoint} 
                     onChange={(e) => setIsApiEndpoint(e.target.checked)} 
                     className="accent-brand-500 w-4 h-4 rounded shrink-0 mt-0.5"
                   />
                   <div className="flex flex-col gap-0.5">
                      <span>Parse as API Endpoint</span>
                      <span className="text-[10px] text-zinc-500 font-normal">Executes a JSON fetch request instead of loading an iframe player.</span>
                   </div>
                </label>

                {isApiEndpoint && (
                  <div className="pt-2.5 border-t border-zinc-800 flex flex-col gap-3">
                    <label className="flex items-start gap-2.5 text-xs font-bold text-zinc-300 cursor-pointer">
                       <input 
                         type="checkbox" 
                         checked={useCorsProxy} 
                         onChange={(e) => setUseCorsProxy(e.target.checked)} 
                         className="accent-brand-500 w-4 h-4 rounded shrink-0 mt-0.5"
                       />
                       <div className="flex flex-col gap-0.5">
                          <span className="text-brand-400">Fetch via CORS Proxy</span>
                          <span className="text-[10px] text-zinc-500 font-normal">Routes requests through a proxy to bypass CORS restrictions.</span>
                       </div>
                    </label>

                    {useCorsProxy && (
                      <div className="flex flex-col gap-1.5 pl-6">
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Proxy Service</label>
                        <select
                          value={corsProxyUrl}
                          onChange={e => setCorsProxyUrl(e.target.value)}
                          className="w-full bg-void-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-brand-500"
                        >
                          <option value="https://corsproxy.io/?">CORSProxy.io (Fast, direct)</option>
                          <option value="https://api.allorigins.win/raw?url=">AllOrigins.win (Bypasses rate limits)</option>
                        </select>
                        {(embedUrl.includes('localhost') || embedUrl.includes('127.0.0.1')) && (
                            <span className="text-[10px] text-orange-500 font-bold mt-1">⚠️ Localhost URLs automatically bypass public proxies!</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* API Presets */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Backend Scraper Presets</label>
                <div data-lenis-prevent="true" className="grid grid-cols-1 gap-1.5 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                  {API_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCustomUrl(preset.url);
                        setUseCustomUrl(true);
                        setIsApiEndpoint(true);
                        setUseCorsProxy(true);
                      }}
                      className="text-left px-3 py-2 rounded bg-void-900 border border-zinc-800/80 hover:bg-void-800 transition-colors flex flex-col gap-1 group"
                    >
                      <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">{preset.name}</span>
                      <span className="text-[9px] text-zinc-500 font-mono truncate w-full">{preset.url}</span>
                      <span className="text-[9px] text-zinc-500 leading-tight border-t border-zinc-800/50 pt-1 mt-0.5">{preset.notes}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sandbox Controls */}
          {!isApiEndpoint && (
             <div className="bg-void-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
               <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                      {useSandbox ? <Shield size={16} className="text-green-500" /> : <ShieldOff size={16} className="text-yellow-500" />}
                      Sandbox Security
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                      When <strong className="text-white">ON</strong>, iframe is sandboxed for safety. When <strong className="text-white">OFF</strong>, removes the sandbox attribute, allowing full interaction. Use with caution.
                    </p>
                  </div>
                  <button
                    onClick={() => setUseSandbox(!useSandbox)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${useSandbox ? 'bg-green-500' : 'bg-zinc-700'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${useSandbox ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                
                <div className="p-3 bg-void-900 rounded-xl border border-zinc-800 text-[10px] font-mono text-zinc-500 break-words leading-tight">
                    Applied Sandbox:<br/>
                    <span className="text-white">
                        {useSandbox 
                            ? (currentSource?.sandboxFlags || (currentSource?.tier === 1 ? TIER_1_SANDBOX : TIER_2_SANDBOX))
                            : "none (Disabled)"}
                    </span>
                </div>
             </div>
          )}
        </div>

        {/* Player Panel */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between bg-void-950 border border-zinc-800 px-4 py-3 rounded-xl shadow-lg">
             <div className="flex items-center gap-2 truncate pr-4">
                {isApiEndpoint ? <Terminal size={16} className="text-brand-500 shrink-0" /> : <Play size={16} className="text-brand-500 shrink-0" />}
                <span className="text-sm font-mono text-zinc-300 truncate">{embedUrl || 'Waiting for URL...'}</span>
             </div>
             <a href={embedUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-white shrink-0">
               Open in Tab <ExternalLink size={12} />
             </a>
          </div>

          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 shadow-2xl relative">
            {!embedUrl ? (
               <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-bold uppercase tracking-widest text-sm">
                  Select a provider or enter a custom URL
               </div>
            ) : isApiEndpoint ? (
               <div className="w-full h-full bg-void-950 p-6 overflow-auto custom-scrollbar relative">
                   {apiLoading ? (
                       <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                           <div className="w-8 h-8 border-2 border-t-brand-500 border-zinc-800 rounded-full animate-spin" />
                       </div>
                   ) : apiResponse ? (
                       <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap">{apiResponse}</pre>
                   ) : (
                       <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center text-zinc-500">
                           <AlertCircle size={24} />
                           <span className="text-xs uppercase tracking-widest font-bold">No response</span>
                       </div>
                   )}
               </div>
            ) : (
               <iframe
                 key={`tester-${embedUrl}-${useSandbox ? 'sandboxed' : 'open'}`}
                 src={embedUrl}
                 className="w-full h-full border-0 bg-black"
                 allowFullScreen
                 sandbox={useSandbox ? (currentSource?.sandboxFlags || (currentSource?.tier === 1 ? TIER_1_SANDBOX : TIER_2_SANDBOX)) : undefined}
               />
            )}
          </div>
          
          {/* Edge Case Disclaimer */}
          <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex gap-3 text-orange-200 text-xs leading-relaxed">
             <AlertCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />
             <div>
                <strong>Sandbox Notes:</strong> If sandbox is turned off, the iframe is still wrapped in <code>allow-popups allow-scripts allow-same-origin allow-forms</code>. We intentionally omit <code>allow-top-navigation</code> to ensure your current tab is never redirected or hijacked. If a Tier 2 source refuses to play without top-navigation permissions, it is highly aggressive and should be avoided in production.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestSourcesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <TestSourcesClient />
    </Suspense>
  );
}
