import type { VercelRequest, VercelResponse } from '@vercel/node';

let cachedToken: { access_token: string; expires_at: number } | null = null;

async function getSpotifyToken() {
  // if (cachedToken && Date.now() < cachedToken.expires_at) {
  //   return cachedToken.access_token;
  // }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Spotify token');
  }

  const data = await response.json();
  
  // Cache token and set expiration slightly earlier than exactly 3600s for safety
  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.access_token;
}

// Helper to resolve short links like https://spotify.link/xxx
async function resolveShortLink(url: string): Promise<string> {
  if (!url.includes('spotify.link')) return url;
  
  try {
    const res = await fetch(url, { redirect: 'manual' });
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (location) return location;
    }
  } catch (err) {
    console.error('Failed to resolve shortlink', url, err);
  }
  return url;
}

// Regex to match track or album IDs, even with intl paths (e.g. /intl-id/track/xxx)
const ID_REGEX = /(?:track|album)\/([a-zA-Z0-9]+)/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { urls } = req.body;
  console.log("Spotify API called with URLs:", urls);
  
  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Missing urls array' });
  }
  
  // Cap at 8 URLs per request as per spec
  const urlBatch = urls.slice(0, 8);
  
  try {
    const token = await getSpotifyToken();
    
    const trackIds = new Set<string>();
    const albumIds = new Set<string>();
    
    // Map to preserve original requested URL to the fetched metadata
    const parsedItems: { originalUrl: string, type: 'track' | 'album', id: string }[] = [];
    
    // 1. Resolve and parse URLs
    await Promise.all(urlBatch.map(async (rawUrl) => {
      const resolved = await resolveShortLink(rawUrl);
      const match = resolved.match(ID_REGEX);
      
      if (match && match[1]) {
        const id = match[1];
        const type = resolved.includes('/album/') ? 'album' : 'track';
        
        parsedItems.push({ originalUrl: rawUrl, type, id });
        
        if (type === 'track') trackIds.add(id);
        else albumIds.add(id);
      }
    }));
    
    const results: any[] = [];
    
    // 2. Fetch all metadata individually in parallel
    await Promise.all(parsedItems.map(async (item) => {
      const endpoint = item.type === 'track' 
        ? `https://api.spotify.com/v1/tracks/${item.id}`
        : `https://api.spotify.com/v1/albums/${item.id}`;
        
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        
        if (item.type === 'track') {
          results.push({
            url: item.originalUrl,
            title: data.name,
            artist: data.artists.map((a: any) => a.name).join(', '),
            albumArt: data.album.images?.[0]?.url || data.album.images?.[1]?.url || null,
            type: 'track'
          });
        } else {
          results.push({
            url: item.originalUrl,
            title: data.name,
            artist: data.artists.map((a: any) => a.name).join(', '),
            albumArt: data.images?.[0]?.url || data.images?.[1]?.url || null,
            type: 'album'
          });
        }
      } else {
        console.error(`${item.type} fetch failed for ${item.id}`, res.status, await res.text());
      }
    }));
    
    return res.status(200).json({ data: results });
    
  } catch (error) {
    console.error('Spotify fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch Spotify metadata' });
  }
}
