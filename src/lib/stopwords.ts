export const INDONESIAN_STOPWORDS = new Set([
  'yang', 'yg', 'dan', 'di', 'ke', 'dari', 'dr', 'untuk', 'utk', 'dengan', 'dg', 'itu', 'ini',
  'ada', 'aku', 'ak', 'aq', 'kamu', 'km', 'kmu', 'saya', 'sy', 'kita', 'kami', 'dia', 'mereka',
  'juga', 'jg', 'saja', 'lagi', 'lgi', 'lg', 'sudah', 'dah', 'udah', 'udh', 'belum', 'blm',
  'akan', 'bisa', 'harus', 'boleh', 'tidak', 'gak', 'gk', 'ga', 'nggak', 'ngga', 'enggak',
  'iya', 'ya', 'yaa', 'iy', 'iyah', 'iyh', 'yh', 'nah', 'sih', 'deh', 'dong', 'kok', 'kan',
  'loh', 'lo', 'lho', 'nih', 'tuh', 'kayak', 'kaya', 'kek', 'gitu', 'gini', 'atau', 'tapi',
  'tp', 'karena', 'krn', 'karna', 'soale', 'gara', 'jadi', 'jd', 'dadi', 'pas', 'lah', 'la',
  'aja', 'banget', 'bgt', 'emang', 'emg', 'wkwk', 'wkwkw', 'wkwkwk', 'haha', 'hehe', 'hihi',
  'anjay', 'anjir', 'jir', 'njir', 'wah', 'oh', 'eh', 'yah', 'yaw', 'oke', 'ok', 'okee',
  'iyaa', 'iya2', 'nder', 'bro', 'vro', 'sis', 'guys', 'bocil', 'sama', 'sm', 'mana', 'dimana',
  'dmn', 'sini', 'disini', 'apa', 'siapa', 'kenapa', 'knp', 'gimana', 'gmn', 'kalo', 'klo',
  'kalau', 'mungkin', 'pasti', 'jelas', 'biasa', 'parah', 'asli', 'lebih', 'paling', 'kurang',
  'banyak', 'cuma', 'semua', 'lain', 'sendiri', 'terus', 'trs', 'lgsg', 'langsung', 'dulu',
  'dlu', 'nanti', 'besok', 'tadi', 'baru', 'habis', 'mulai', 'akhir', 'terakhir', 'hari',
  'pagi', 'siang', 'sore', 'malam', 'senin', 'sabtu', 'minggu', 'jam', 'waktu', 'mas', 'pak',
  'mbak', 'mba', 'bang', 'bwang', 'om', 'cak', 'sam', 'cik', 'mohon', 'tolong', 'maaf',
  'makasih', 'terima', 'kasih', 'selamat', 'semangat', 'terkait', 'berikut', 'biar', 'pada',
  'dalam', 'bukan', 'jangan', 'bener', 'salah', 'enak', 'siap', 'aman', 'hooh', 'gw', 'gua',
  'lu', 'anda', 'kalian', 'kah', 'kh', 'si', 'men', 'lor', 'lur', 'all', 'due'
]);

export const JAVANESE_STOPWORDS = new Set([
  'aku', 'ak', 'aq', 'kowe', 'koe', 'dheweke', 'awake', 'awmu', 'awm', 'kon', 'dhewe', 'dewe',
  'iki', 'iku', 'kuwi', 'kae', 'ing', 'lan', 'karo', 'kro', 'nang', 'ning', 'nde', 'ndek', 'ndk',
  'kanggo', 'gae', 'gawe', 'nggae', 'saka', 'teko', 'tekan', 'yen', 'nek', 'wis', 'ws', 'uwis',
  'uwes', 'durung', 'grg', 'ora', 'ra', 'rak', 'ndak', 'iyo', 'yo', 'inggih', 'opo', 'gaopo',
  'gapapa', 'piye', 'kepiye', 'kok', 'ta', 'ya', 'lho', 'lo', 'kene', 'kono', 'mrene', 'mrono',
  'sopo', 'ndi', 'nandi', 'endi', 'kapan', 'mergo', 'merga', 'soale', 'iso', 'gaiso', 'kudu',
  'oleh', 'pancen', 'ancen', 'ncen', 'pisan', 'tenan', 'wae', 'ae', 'thok', 'tok', 'mek',
  'kabeh', 'mesti', 'mangkane', 'jenenge', 'tak', 'ake', 'ne', 'e', 'wes', 'cah', 'rek',
  'arek', 'areke', 'wong', 'cuk', 'cok', 'jancok', 'asem', 'taek', 'lek', 'lak', 'yokpo',
  'kyk', 'koyok', 'jare', 'emoh', 'moh', 'mbe', 'mbek', 'ambek', 'sek', 'seng', 'sg', 'sing',
  'dudu', 'guduk', 'ono', 'onok', 'onk', 'gaono', 'ganok', 'saiki', 'mene', 'wingi', 'mang',
  'tas', 'bien', 'suwe', 'sue', 'ket', 'moro', 'maneh', 'te', 'kate', 'ate', 'engkok', 'mariki',
  'lapo', 'ngono', 'ngene', 'ngunu', 'mosok', 'mending', 'podo', 'rodok', 'seteng', 'akeh',
  'piro', 'sak', 'wenak', 'sepurane', 'ojok', 'ojo', 'gausa', 'ero', 'gaero', 'eroh', 'seh',
  'po', 'bengi', 'isuk', 'mbok', 'bedho', 'bedo', 'kiro', 'paleng'
]);

export const ENGLISH_STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'and', 'or', 'but', 'if', 'then', 'so', 'to',
  'of', 'in', 'on', 'at', 'for', 'with', 'this', 'that', 'it', 'its', 'i', 'you', 'he', 'she',
  'we', 'they', 'my', 'your', 'his', 'her', 'our', 'their', 'me', 'him', 'us', 'them', 'be',
  'been', 'being', 'do', 'does', 'did', 'have', 'has', 'had', 'will', 'would', 'can', 'could',
  'should', 'just', 'like', 'okay', 'ok', 'yeah', 'yes', 'no', 'not', 'lol', 'lmao', 'haha',
  'omg', 'im', 'u', 'ur', 'dont', 'cant', 'wont', 'thats', 'theres', 'theyre', 'ive', 'youre',
  'null', 'true', 'false', 'done', 'wait', 'by', 'up', 'out', 'all', 'more', 'full', 'old',
  'why', 'what', 'time', 'good', 'shit', 'fuck', 'damn', 'nigga', 'bruh'
]);

// Combined stopword list for all locales
export const ALL_STOPWORDS = new Set([
  ...Array.from(ENGLISH_STOPWORDS),
  ...Array.from(INDONESIAN_STOPWORDS),
  ...Array.from(JAVANESE_STOPWORDS),
]);
