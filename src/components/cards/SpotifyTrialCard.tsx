import { useState, useEffect } from 'react';
import { RadioIcon } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import type { ParsedChatMetrics } from '../../types/chat';

interface Props {
  metrics: ParsedChatMetrics;
  isDemoMode?: boolean;
  chatMode?: 'dm' | 'group';
}

interface SpotifyItem {
  url: string;
  title: string;
  artist: string;
  albumArt: string | null;
  type: 'track' | 'album' | 'playlist';
}


const GROUP_DEMO_DATA: SpotifyItem[] = [
  {
    "url": "https://open.spotify.com/track/3wvW8GIpS8Y95nCt2Wjt5t?si=jzrUFvZtTd-U3IceQmDY8g",
    "title": "20191012 Fooled By Love",
    "artist": "Mac DeMarco",
    "albumArt": "https://i.scdn.co/image/ab67616d0000b27340461e96808378ae2787a7e4",
    "type": "track"
  },
  {
    "url": "https://open.spotify.com/track/7qUkZhXym0LCTdcmwhGO3b?si=ea43f61076aa45ff",
    "title": "Konservatif",
    "artist": "The Adams",
    "albumArt": "https://i.scdn.co/image/ab67616d0000b273535749cdd3ac5452d99289be",
    "type": "track"
  },
  {
    "url": "https://open.spotify.com/album/4EA34edROIFSbaZ74QAxC6?si=BA3ni5tASVKfQ5wgCZ1SPg",
    "title": "SNIPPET",
    "artist": "ini.bin",
    "albumArt": "https://i.scdn.co/image/ab67616d0000b2730af2517f9a1c80389b0ae813",
    "type": "album"
  },
  {
    "url": "https://open.spotify.com/album/6es3mdUqpOlHSXPT6QeC7Y?si=yQmAVQ5JQmuQcnFxkVeeRA&utm_source=copy-link",
    "title": "虹伝説～THE RAINBOW GOBLINS～",
    "artist": "Masayoshi Takanaka",
    "albumArt": "https://i.scdn.co/image/ab67616d0000b273a8fd1d331c811e557db74d27",
    "type": "album"
  },
  {
    "url": "https://open.spotify.com/playlist/7p1MWKdCUfIJLV4Avrsw6v?si=b8a80b84b722446a",
    "title": "oahm",
    "artist": "Indra",
    "albumArt": "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da841f5ae6345988558ed31db7a1",
    "type": "playlist"
  },
  { "url": "https://open.spotify.com/track/3JPykcDhUA7DMrxN6eXzQ4?si=55bd7f600e0845af", "title": "Rom-Com Gone Wrong", "artist": "Matt Maltese", "albumArt": "https://i.scdn.co/image/ab67616d0000b273f01251e6e914959ebbd88ae5", "type": "track" },
  { "url": "https://open.spotify.com/album/7b55VfUk2Vpuqnac9NDREc?si=2837b5f6b15c4a37", "title": "ランプ幻想", "artist": "Lamp", "albumArt": "https://i.scdn.co/image/ab67616d0000b273bbc2ac628f52cd6127e20bfa", "type": "album" }
];

export default function SpotifyTrialCard({ metrics, isDemoMode }: Props) {
  const { t } = useLanguage();
  const { recentSpotifyLinks } = metrics;

  const [items, setItems] = useState<SpotifyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isDemoMode) {
      setItems(GROUP_DEMO_DATA);
      setLoading(false);
      return;
    }

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
        <div className={`grid ${items.length > 1 ? 'grid-rows-2' : 'grid-rows-1'} grid-flow-col gap-4 md:flex overflow-x-auto custom-scrollbar pb-2 snap-x`}>
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
                  <img src={item.albumArt} crossOrigin="anonymous" alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
