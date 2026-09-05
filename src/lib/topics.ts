import type { ChatMessage } from '../types/chat';

interface TopicDomain {
  id: string;
  label: string; // The user-facing label (e.g. "Work & Office")
  seeds: Set<string>;
}

export const DOMAIN_SEEDS: TopicDomain[] = [
  {
    id: 'tech_dev',
    label: 'coding struggles',
    seeds: new Set([
      // Code & Architecture
      'api', 'backend', 'frontend', 'fe', 'be', 'bug', 'code', 'commit', 'database', 'db',
      'deploy', 'endpoint', 'error', 'feature', 'fitur', 'framework', 'git', 'issue', 'merge',
      'pipeline', 'prod', 'production', 'pull', 'query', 'refactor', 'release', 'repo',
      'repository', 'request', 'response', 'rest', 'server', 'service', 'staging', 'stagingan',
      'token', 'uat', 'sit', 'dev', 'unit', 'test', 'testing', 'script', 'docker', 'cloud',
      'stack', 'ui', 'ux', 'auth', 'login', 'portal', 'postman', 'swagger'
    ])
  },
  {
    id: 'work',
    label: 'daily updates',
    seeds: new Set([
      // Formal Office & Project Management
      'absen', 'agenda', 'approval', 'approve', 'atasan', 'ba', 'bos', 'briefing', 'budget',
      'call', 'cc', 'client', 'closing', 'cuti', 'deadline', 'delegasi', 'deskripsi', 'diskusi',
      'divisi', 'draft', 'email', 'evaluasi', 'followup', 'fu', 'gaji', 'gajian', 'gmeet',
      'handover', 'hiring', 'hrd', 'informasi', 'inpo', 'interview', 'izin', 'jabatan', 'jira',
      'kantor', 'kerja', 'kerjaan', 'klien', 'lembur', 'lead', 'laporan', 'manager', 'meeting',
      'mitra', 'mom', 'notulen', 'notulensi', 'nyiapin', 'okr', 'onboarding', 'operasional',
      'overtime', 'pembahasan', 'presentasi', 'project', 'proyek', 'rapat', 'revisi', 'resign',
      'rekrutmen', 'review', 'salary', 'shift', 'slip', 'sprint', 'spv', 'standup', 'sync',
      'task', 'teams', 'teamwork', 'timeline', 'tugas', 'vendor', 'wfh', 'wfo', 'zoom'
    ])
  },
  {
    id: 'college',
    label: 'academic panic',
    seeds: new Set([
      // Campus Life & Academics
      'acc', 'akademik', 'almamater', 'alpha', 'asprak', 'bimbingan', 'beasiswa', 'bem',
      'cuti', 'daftar', 'dosen', 'dospem', 'eval', 'fakultas', 'gap', 'gelar', 'ipk',
      'ips', 'jadwal', 'judul', 'jurusan', 'jurnal', 'kampus', 'kelompok', 'kelulusan',
      'kkn', 'kompre', 'krs', 'kuliah', 'lab', 'laporan', 'latsar', 'lembar', 'litbang',
      'makalah', 'magang', 'matkul', 'mhs', 'nilai', 'ospek', 'paper', 'penguji', 'plagiasi',
      'plagiat', 'praktikum', 'presentasi', 'prodi', 'proposal', 'revisi', 'ruang', 'seminar',
      'semhas', 'sempro', 'semester', 'sidang', 'silabus', 'sks', 'skripsi', 'studi', 'ta',
      'tesis', 'toga', 'tugas', 'uas', 'ujian', 'ukm', 'ukt', 'uts', 'wisuda', 'yudisium'
    ])
  },
  {
    id: 'food',
    label: 'food cravings',
    seeds: new Set([
      // Food, Drinks & Javanese/Indonesian Casual Dining
      'ajak', 'amunisi', 'angkringan', 'antri', 'ayam', 'bakaran', 'bakmie', 'bakso', 'bebek',
      'begah', 'bekal', 'boba', 'bungkus', 'cafe', 'camilan', 'cemilan', 'chitato', 'cokelat',
      'dinein', 'delivery', 'dimsum', 'dine', 'drive', 'es', 'espreso', 'esteh', 'food',
      'foodcourt', 'gacoan', 'gojek', 'gofood', 'gorengan', 'grabfood', 'haus', 'indomie',
      'jajan', 'jajanan', 'jus', 'kafe', 'katering', 'kenyang', 'kopi', 'kopian', 'kuliner',
      'lapar', 'laper', 'lontong', 'makan', 'makanan', 'mangan', 'martabak', 'masak', 'mateng',
      'matcha', 'menu', 'mie', 'minum', 'minuman', 'ngantri', 'ngemil', 'ngiler', 'ngopi',
      'ngombe', 'nongkrong', 'order', 'padang', 'pedas', 'pedes', 'porsi', 'prasmanan',
      'pesan', 'resto', 'restoran', 'sambal', 'sambel', 'sarapan', 'sate', 'seblak', 'shopeefood',
      'siomay', 'snack', 'soto', 'takeway', 'taichan', 'takeout', 'tongkrongan', 'warteg',
      'warkop', 'warung'
    ])
  },
  {
    id: 'gaming',
    label: 'push rank',
    seeds: new Set([
      // Mobile, PC & Console Gaming
      'afk', 'aim', 'assassin', 'banned', 'bocil', 'buff', 'build', 'carry', 'clutch', 'combo',
      'cooldown', 'counter', 'cs', 'cs2', 'custom', 'damage', 'dc', 'defeat', 'derank',
      'discord', 'dota', 'draft', 'esports', 'ff', 'fps', 'freefire', 'game', 'gamer', 'gameplay',
      'gank', 'genshin', 'gg', 'grinding', 'hero', 'item', 'joki', 'kill', 'knock', 'lag',
      'lan', 'ldb', 'level', 'lewat', 'lobby', 'login', 'logout', 'lose', 'losesreak', 'mabar',
      'main', 'mage', 'match', 'mechanic', 'meta', 'moba', 'mod', 'mode', 'mp', 'mvp', 'nerf',
      'noob', 'party', 'patch', 'ping', 'play', 'player', 'pubg', 'push', 'quest', 'rank',
      'ranked', 'revive', 'roam', 'role', 'room', 'server', 'skin', 'smurf', 'solo', 'spawm',
      'squad', 'steam', 'tank', 'tier', 'turnamen', 'turney', 'turun', 'valo', 'valorant',
      'victory', 'win', 'winrate', 'winratean', 'wr', 'wrg'
    ])
  },
  {
    id: 'romance',
    label: 'relationship',
    seeds: new Set([
      // Affection, Dating & Relationship Dynamics
      'ay', 'ayang', 'ayank', 'baper', 'bebe', 'bucin', 'cemburu', 'chat', 'cinta', 'crush',
      'curhat', 'date', 'deket', 'doi', 'galau', 'gandeng', 'gemas', 'gemes', 'gamon', 'ghosting',
      'hangout', 'hati', 'hub', 'hubungan', 'jadian', 'jalan', 'jodoh', 'kencan', 'kangen',
      'kecewa', 'kesayangan', 'ldr', 'love', 'maaf', 'malamminggu', 'malming', 'manja', 'mantan',
      'marah', 'meet', 'merindu', 'ngambek', 'ngedate', 'nikah', 'pacar', 'pacaran', 'pap',
      'pasangan', 'peluk', 'peka', 'pdkt', 'pelukan', 'perhatian', 'rindu', 'romantis',
      'sayang', 'sayangku', 'sedih', 'selingkuh', 'semesta', 'story', 'sweet', 'gebetan',
      'temukangen', 'tunangan', 'valentine'
    ])
  },
  {
    id: 'finance',
    label: 'money talks',
    seeds: new Set([
      // Banking, Crypto, Digital Wallets & Debt
      'angsuran', 'atm', 'saldo', 'balance', 'bank', 'bayar', 'bca', 'bni', 'bri', 'mandiri',
      'bifast', 'biaya', 'bon', 'boros', 'budget', 'cash', 'cashback', 'cicil', 'cicilan',
      'coin', 'crypto', 'cuan', 'dana', 'debit', 'deposito', 'diskon', 'duit', 'fee', 'finansial',
      'gaji', 'gajian', 'gopay', 'hemat', 'harga', 'hutang', 'invest', 'investasi', 'kartu',
      'kas', 'kredit', 'kupon', 'limit', 'linkaja', 'modal', 'mumpung', 'murah', 'mutasi',
      'nabung', 'nominal', 'nomor', 'ovo', 'ongkir', 'patungan', 'paylater', 'pembayaran',
      'pemasukan', 'pengeluaran', 'pinjam', 'pinjaman', 'pinjol', 'porto', 'portofolio', 'potongan',
      'pribadi', 'promo', 'qris', 'rekening', 'reksadana', 'rugi', 'rupiah', 'saham', 'saldo',
      'saku', 'save', 'saving', 'sedekah', 'sewa', 'shopeepay', 'spay', 'spaylater', 'struk',
      'tagihan', 'talang', 'talangin', 'tarik', 'tf', 'topup', 'trf', 'transaksi', 'transfer',
      'tunai', 'uang', 'untung', 'utang', 'voucher'
    ])
  },
  {
    id: 'travel_commute',
    label: 'commute & jumping places',
    seeds: new Set([
      // Daily Commute, Transit & Road Travel
      'angkot', 'arah', 'bandara', 'berangkat', 'bis', 'boseh', 'bus', 'busway', 'buswayan',
      'carter', 'cepat', 'commuter', 'commuterline', 'daop', 'delay', 'destinasi', 'dinas',
      'driver', 'ekonomi', 'eksekutif', 'etoll', 'flyover', 'gang', 'gojek', 'gocar', 'goride',
      'grab', 'grabcar', 'grabride', 'helm', 'inDrive', 'jalan', 'jalur', 'jarak', 'jemput',
      'kai', 'kereta', 'ketinggalan', 'km', 'krl', 'lewat', 'lokasi', 'lrt', 'macet', 'maps',
      'maxim', 'menyebrang', 'motor', 'mobil', 'mrt', 'mudik', 'muatan', 'nyasar', 'nyetir',
      'ongkos', 'otw', 'pamit', 'parkir', 'penumpang', 'pesawat', 'plat', 'pom', 'pos',
      'pulang', 'puteran', 'rel', 'rute', 'safety', 'sampai', 'sampe', 'santai', 'shelter',
      'simpang', 'sopir', 'spbu', 'stasiun', 'terminal', 'terbang', 'tiket', 'titik', 'tj',
      'tol', 'toll', 'traffic', 'transit', 'travel', 'trip', 'tujuan', 'uber', 'wisata'
    ])
  },
  {
    id: 'health_wellness',
    label: 'health & lifestyle',
    seeds: new Set([
      // Fitness, Sickness & Well-being
      'alergi', 'ambulan', 'antigen', 'apotek', 'badrest', 'batuk', 'berobat', 'bpjs', 'capek',
      'checkup', 'cedera', 'covid', 'demam', 'diet', 'dokter', 'drop', 'encok', 'fatigue',
      'faskes', 'fit', 'flu', 'gym', 'istirahat', 'infus', 'inap', 'isoman', 'jogging',
      'kalori', 'kardio', 'kecapekan', 'klinik', 'konsul', 'lemas', 'lemes', 'marathon',
      'masukangin', 'medis', 'migrain', 'mual', 'mules', 'ngilu', 'nyeri', 'obat', 'opname',
      'panas', 'pegal', 'pegel', 'pilek', 'pcr', 'pusing', 'puskesmas', 'ranap', 'rawat',
      'resep', 'ronde', 'rs', 'rumah', 'sakit', 'sehat', 'sembuh', 'suplemen', 'tensi',
      'terapi', 'tipes', 'tumbang', 'vaksin', 'vitamin', 'workout', 'yoga'
    ])
  },
  {
    id: 'shopping_deals',
    label: 'Shopping & E-Commerce',
    seeds: new Set([
      // Marketplace, Delivery & Hauls
      'airpay', 'alamat', 'barang', 'belanja', 'beli', 'blibli', 'cart', 'checkout', 'co',
      'cod', 'complain', 'dropship', 'etalase', 'flashsale', 'freeongkir', 'garansi', 'haul',
      'jastip', 'keranjang', 'kirim', 'kurir', 'lazada', 'live', 'marketplace', 'mall', 'olshop',
      'ongkir', 'order', 'orderan', 'ori', 'original', 'packing', 'paket', 'pecah', 'pengiriman',
      'pesanan', 'po', 'preorder', 'ready', 'refund', 'resi', 'retur', 'review', 'sale',
      'seller', 'sellercenter', 'shopee', 'shopeehaul', 'size', 'spx', 'store', 'toko',
      'tokopedia', 'tokped', 'unboxing', 'variant', 'warna', 'worth'
    ])
  },
  {
    id: 'entertainment_popculture',
    label: 'movies or series',
    seeds: new Set([
      // Movies, Streaming, Anime, K-Pop, Dramas
      'actor', 'aktris', 'anime', 'bioskop', 'bts', 'cast', 'cgv', 'cinema', 'cinemaxx',
      'drakor', 'drama', 'episode', 'eps', 'fandom', 'film', 'hotstar', 'idol', 'kpop',
      'manga', 'movie', 'netflix', 'nonton', 'nowplaying', 'oppa', 'ott', 'photocard',
      'plottwist', 'premiere', 'prime', 'rating', 'review', 'season', 'series', 'sinema',
      'spoiler', 'spoil', 'sub', 'subtitle', 'ticket', 'tiket', 'trailer', 'vidio', 'weverse', 'xxi'
    ])
  },
  {
    id: 'music_concerts',
    label: 'music',
    seeds: new Set([
      // Live Events, Instruments, Production & Streaming
      'album', 'akustik', 'amp', 'ampli', 'audio', 'band', 'bass', 'chords', 'drum',
      'festival', 'fest', 'gear', 'genre', 'gitar', 'gig', 'gigs', 'headliner', 'konser',
      'lagu', 'lineup', 'lirik', 'livehouse', 'melodi', 'merch', 'mic', 'mikrofon', 'mixer',
      'music', 'musik', 'nada', 'nyanyi', 'pedal', 'playlist', 'presale', 'rakaman', 'rekaman',
      'setlist', 'snare', 'sound', 'soundcheck', 'soundtrack', 'spotify', 'stage', 'stagepass',
      'strat', 'studio', 'tuning', 'venue', 'vokal', 'war', 'wartiket'
    ])
  },
  {
    id: 'housing_boarding',
    label: 'Housing & Kos Life',
    seeds: new Set([
      // Boarding House, Renting, Roommates & Household Tasks
      'ac', 'air', 'apart', 'apartemen', 'bapak', 'beres', 'bocor', 'cucian', 'dapur',
      'galon', 'gas', 'genteng', 'ibu', 'indekos', 'iuran', 'jemuran', 'kamar', 'kasur',
      'kebersihan', 'kontrak', 'kontrakan', 'kos', 'kosan', 'kunci', 'laundry', 'listrik',
      'meteran', 'pam', 'parkiran', 'pasutri', 'penghuni', 'perumahan', 'pindah', 'pindahan',
      'pompa', 'pos', 'renov', 'renovasi', 'ronda', 'rt', 'ruko', 'rumah', 'rusak', 'sampah',
      'satpam', 'sewa', 'token', 'tetangga', 'wifi', 'wp'
    ])
  },
  {
    id: 'sports_football',
    label: 'Sports & Football',
    seeds: new Set([
      // Futsal, Badminton, Running, Gym & Football Fans
      'badminton', 'balap', 'ball', 'barca', 'basket', 'bek', 'bola', 'bulutangkis', 'champions',
      'cleansheet', 'derby', 'finisher', 'futsal', 'f1', 'gol', 'gool', 'goalkeeper', 'jersey',
      'juara', 'kiper', 'lapangan', 'liga', 'madrid', 'manchester', 'maraton', 'marathon', 'match',
      'motogp', 'mu', 'nobar', 'offside', 'pace', 'pelatih', 'penalti', 'peringkat', 'pl', 'point',
      'raket', 'referee', 'run', 'runner', 'running', 'sepatu', 'skor', 'sparring', 'striker',
      'tanding', 'timnas', 'turnamen', 'ucl', 'wasit'
    ])
  },
  {
    id: 'automotive_rides',
    label: 'Automotive & Vehicles',
    seeds: new Set([
      // Bikes, Cars, Maintenance, Mods & Sunmori
      'aki', 'ban', 'baut', 'bengkel', 'bensin', 'bodi', 'boreup', 'bpkb', 'busi', 'cc', 'cuci',
      'detailing', 'gantiole', 'helm', 'injeksi', 'intercooler', 'jok', 'karbu', 'karet', 'knalpot',
      'kopling', 'matic', 'metic', 'mobil', 'modifikasi', 'modip', 'motor', 'muffler', 'oli',
      'pertalite', 'pertamax', 'plat', 'poles', 'radiator', 'rantai', 'rem', 'servis', 'service',
      'shock', 'sim', 'spooring', 'stnk', 'sunmori', 'surat', 'tambal', 'tarikan', 'touring',
      'tuneup', 'turbo', 'velg', 'vespa'
    ])
  },
  {
    id: 'creativity_design',
    label: 'Content, Design & Media',
    seeds: new Set([
      // Photo, Video Editing, UI/UX, Assets & Production
      'aftereffects', 'angle', 'aperture', 'art', 'asset', 'audio', 'behance', 'blender',
      'bokeh', 'brief', 'cam', 'camera', 'canva', 'capcut', 'clip', 'colorgrading', 'design',
      'desain', 'dribbble', 'editing', 'editor', 'export', 'figma', 'figjam', 'filmmaking',
      'footage', 'framerate', 'font', 'gradient', 'grading', 'illustrator', 'kamera', 'konten',
      'layer', 'layout', 'lens', 'lensa', 'lighting', 'lightroom', 'logo', 'lut', 'mockup',
      'motion', 'objek', 'photoshop', 'plugin', 'portrait', 'premiere', 'preset', 'procreate',
      'render', 'rendering', 'reels', 'resolusi', 'rgb', 'shoot', 'shooting', 'shutter',
      'storyboard', 'talent', 'tiktok', 'typography', 'vector', 'vektor', 'vfx', 'vidio', 'vlog', 'vt'
    ])
  },
  {
    id: 'spirituality_religion',
    label: 'Religion & Spirituality',
    seeds: new Set([
      // Islamic & General Indonesian Religious Life
      'adzan', 'alhamdulillah', 'amal', 'bacaan', 'buka', 'bukber', 'ceramah', 'doa', 'dzikir',
      'gereja', 'haji', 'ibadah', 'iduladha', 'idulfitri', 'iftar', 'iman', 'imsak', 'inshaallah',
      'insyaallah', 'islam', 'istighfar', 'jemaat', 'jumat', 'jumatan', 'kajian', 'khutbah',
      'kurban', 'lebaran', 'masjid', 'majelis', 'misa', 'mukena', 'muslim', 'natal', 'ngaji',
      'pahala', 'pastor', 'puasa', 'quran', 'ramadhan', 'rohani', 'sahur', 'salat', 'santri',
      'sarung', 'sholat', 'subuh', 'sunnah', 'syariah', 'tarawih', 'taubat', 'tpa', 'umrah',
      'ustadz', 'wudhu', 'zakat'
    ])
  },
  {
    id: 'social_gossip',
    label: 'Gossip & Social Life',
    seeds: new Set([
      // Drama, Tea/Spill, Neighborhood Talk & Slang Reactions
      'akrab', 'bacot', 'bohong', 'bongkar', 'caper', 'cepu', 'circle', 'curiga', 'drama',
      'fitnah', 'fomo', 'gibah', 'gosip', 'heboh', 'julid', 'klarifikasi', 'kocak', 'kompor',
      'masalah', 'netizen', 'ngaku', 'ngeles', 'ngomongin', 'pansos', 'parah', 'ribut',
      'rumor', 'sarkas', 'screenshot', 'secret', 'sindir', 'sindiran', 'skandal', 'slang',
      'sosmed', 'spill', 'story', 'tengkar', 'thread', 'toxic', 'trustissue', 'viral'
    ])
  }
];

export function detectTopics(
  metrics: {
    topKeywords: { word: string; count: number }[],
    hourlyHeatmap: number[],
    sharedLinks: Record<string, number>,
    ghostingInstances: Record<string, number>
  },
  messages: ChatMessage[]
): string[] {
  // 1. Seed Matching & Initial Scoring
  const domainScores: Record<string, { score: number; hits: Set<string> }> = {};

  for (const domain of DOMAIN_SEEDS) {
    domainScores[domain.id] = { score: 0, hits: new Set() };
  }

  // Look through top keywords to boost scores
  const keywordSet = new Set(metrics.topKeywords.map(k => k.word));

  // Also scan raw messages for burst scoring (time windows)
  // To keep this lightweight, we just do a frequency scan of seeds across messages
  // and weight them if they occur heavily.
  for (const kw of metrics.topKeywords) {
    for (const domain of DOMAIN_SEEDS) {
      if (domain.seeds.has(kw.word)) {
        domainScores[domain.id].score += kw.count;
        domainScores[domain.id].hits.add(kw.word);
      }
    }
  }

  // 2. Co-occurrence & Burst Expansion
  // Look for messages that contain seeds, and record other non-stopword tokens in those same messages.
  // We can add those top co-occurring tokens to the topic's keywords to make it look highly specific!
  const contentMessages = messages.filter(m => !m.isSystem && !m.isMedia && m.content.length > 3);

  const domainContexts: Record<string, Record<string, number>> = {};
  for (const domain of DOMAIN_SEEDS) {
    domainContexts[domain.id] = {};
  }

  for (const msg of contentMessages) {
    const tokens = msg.content.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];

    // Check which domains this message belongs to
    const matchingDomains = new Set<string>();
    for (const t of tokens) {
      for (const domain of DOMAIN_SEEDS) {
        if (domain.seeds.has(t)) {
          matchingDomains.add(domain.id);
        }
      }
    }

    // Add all other tokens to the context of the matching domains
    for (const dId of matchingDomains) {
      for (const t of tokens) {
        // Only if it's a known top keyword (filters out junk)
        if (keywordSet.has(t) && !DOMAIN_SEEDS.find(d => d.id === dId)?.seeds.has(t)) {
          domainContexts[dId][t] = (domainContexts[dId][t] || 0) + 1;
        }
      }
    }
  }

  // Build the final topics
  const results: { label: string; score: number }[] = [];

  for (const domain of DOMAIN_SEEDS) {
    const data = domainScores[domain.id];
    if (data.score > 20) { // Minimum threshold
      results.push({
        label: domain.label,
        score: data.score
      });
    }
  }

  // Add behavioral/metric-based topics
  const totalLinks = Object.values(metrics.sharedLinks).reduce((a, b) => a + b, 0);
  if (totalLinks > 50) {
    results.push({ label: 'random links', score: totalLinks });
  }

  const lateNightSum = (metrics.hourlyHeatmap[0] || 0) + (metrics.hourlyHeatmap[1] || 0) + (metrics.hourlyHeatmap[2] || 0) + (metrics.hourlyHeatmap[3] || 0);
  if (lateNightSum > messages.length * 0.1) {
    results.push({ label: 'existential dread', score: lateNightSum });
  }

  const totalGhosts = Object.values(metrics.ghostingInstances).reduce((a, b) => a + b, 0);
  if (totalGhosts > 50) {
    results.push({ label: 'unresolved ghosting', score: totalGhosts * 5 });
  }

  // Sort by score descending, return max 6 unique labels
  const uniqueLabels = Array.from(new Set(results.sort((a, b) => b.score - a.score).map(r => r.label)));
  return uniqueLabels.slice(0, 6);
}
