import { useState, useEffect } from 'react';
import { RadioIcon } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import type { ParsedChatMetrics } from '../../types/chat';

interface Props {
  metrics: ParsedChatMetrics;
}

interface SpotifyItem {
  url: string;
  title: string;
  artist: string;
  albumArt: string | null;
  type: 'track' | 'album' | 'playlist';
}

export default function SpotifyTrialCard({ metrics }: Props) {
  const { t } = useLanguage();
  const { recentSpotifyLinks } = metrics;

  const [items, setItems] = useState<SpotifyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!recentSpotifyLinks || recentSpotifyLinks.length === 0) {
      setLoading(false);
      return;
    }

    const fetchMetadata = async () => {
      try {
        setLoading(true);
        setError(false);
        // Note: For local dev, this expects a Vite proxy, or full absolute URL if running against Vercel.
        const res = await fetch('/api/spotify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ urls: recentSpotifyLinks })
        });

        if (!res.ok) {
          throw new Error('Failed to fetch Spotify metadata');
        }

        const data = await res.json();
        if (data && data.data && data.data.length > 0) {
          setItems(data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Spotify fetch error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [recentSpotifyLinks]);

  // Spec: If failure or empty, hide completely.
  if (error || (!loading && items.length === 0)) {
    return null;
  }

  return (
    <div className="p-6 h-full flex flex-col bg-white">
      <div className="mb-4 flex items-center gap-2 text-gray-700">
        <RadioIcon className="w-4 h-4" />
        <p className="font-mono text-xs uppercase tracking-widest">{t('spotify.title')}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold">{t('spotify.recent')}</p>
        {(items.length > 2 || loading) && (
          <div className="flex items-center gap-1 text-gray-400 md:hidden animate-pulse">
            <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
            <span>→</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-rows-2 grid-flow-col gap-4 md:flex overflow-x-auto custom-scrollbar pb-2 opacity-50 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex-shrink-0 w-48 border-2 border-gray-200">
              <div className="w-full aspect-square bg-gray-200" />
              <div className="p-2 flex-1 flex flex-col justify-center gap-1">
                <div className="h-2.5 bg-gray-200 w-3/4 rounded-sm" />
                <div className="h-1.5 bg-gray-200 w-1/4 rounded-sm" />
                <div className="h-2 bg-gray-200 w-1/2 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-rows-2 grid-flow-col gap-4 md:flex overflow-x-auto custom-scrollbar pb-2 snap-x">
          {items.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-shrink-0 w-48 border-2 border-black bg-[#1ed760]/10 hover:bg-[#1ed760]/20 transition-colors snap-start flex flex-col"
            >
              <div className="w-full aspect-square border-b-2 border-black bg-black overflow-hidden relative">
                {item.albumArt ? (
                  <img src={item.albumArt} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50 text-xs font-mono p-2 text-center">{t('spotify.noArt')}</div>
                )}
              </div>
              <div className="p-2 flex-1 flex flex-col justify-center">
                <p className="text-xs font-bold truncate leading-tight">{item.title}</p>
                <p className="text-[8px] font-mono uppercase tracking-widest text-gray-500 mt-0.5 mb-0.5">{t(`spotify.type.${item.type}` as any)}</p>
                <p className="text-[10px] text-gray-600 truncate leading-tight">{item.artist}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
