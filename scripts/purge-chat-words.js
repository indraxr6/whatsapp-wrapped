#!/usr/bin/env node
/**
 * prepare-chat-for-ai.js
 *
 * Parses raw WhatsApp .txt exports and runs pure JavaScript topic extraction
 * via clean word/n-gram distributions, token burst detection, and co-occurrence graphs.
 *
 * Usage:
 *   node prepare-chat-for-ai.js <output.txt> <input1.txt> [input2.txt ...]
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------
const CONFIG = {
  minWordFrequency: 3,
  minBigramFrequency: 3,
  minTrigramFrequency: 2,
  maxWordsInOutput: 250,
  maxBigramsInOutput: 100,
  maxTrigramsInOutput: 50,
  minMessageLength: 2,

  // Co-occurrence Topic Graph Settings
  minCooccurrenceCount: 5,   // pair must appear together in at least N messages
  topClustersToExtract: 15,  // max topic clusters to generate
  maxWordsPerCluster: 6,     // max keywords per topic bubble
};

// ---------------------------------------------------------------------
// Invisible / bidi characters
// ---------------------------------------------------------------------
const INVISIBLE_CHARS_RE = /[\u200E\u200F\u202A-\u202E\u2068\u2069]|<0x200e>|<0x200f>/gi;

// ---------------------------------------------------------------------
// WhatsApp Message Regex (iOS brackets & Android dash)
// ---------------------------------------------------------------------
const MESSAGE_RE =
  /^(?:\[(\d{1,2}[/.\-]\d{1,2}[/.\-]\d{2,4}),?\s(\d{1,2}[:.\uFF0E]\d{2}(?:[:.\uFF0E]\d{2})?(?:\s?[AP]M)?)\]|(\d{1,2}[/.\-]\d{1,2}[/.\-]\d{2,4}),?\s(\d{1,2}[:.\uFF0E]\d{2}(?:[:.\uFF0E]\d{2})?(?:\s?[AP]M)?)\s[-–])\s([^:]+):\s([\s\S]*)$/i;

// ---------------------------------------------------------------------
// System patterns
// ---------------------------------------------------------------------
const SYSTEM_PATTERNS = [
  /messages and calls are end-to-end encrypted/i,
  /pesan dan telepon terenkripsi secara end-to-end/i,
  /tidak disertakan/i,
  /omitted/i,
  /this message was edited/i,
  /pesan ini diedit/i,
  /this message was deleted/i,
  /you deleted this message/i,
  /pesan ini dihapus/i,
  /anda menghapus pesan ini/i,
  /missed voice call/i,
  /missed video call/i,
  /voice call/i,
  /video call/i,
  /telepon suara/i,
  /telepon video/i,
  /changed the group/i,
  /mengubah (nama|ikon|deskripsi) grup/i,
  /you're now an admin/i,
  /added you/i,
  /removed you/i,
  /view once message/i,
  /pesan sekali lihat/i,
  /lokasi:/i,
  /location:/i,
];

// ---------------------------------------------------------------------
// Expanded Stopwords (ID + JV + EN)
// ---------------------------------------------------------------------
const STOPWORDS_ID = new Set([
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

const STOPWORDS_JV = new Set([
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

const STOPWORDS_EN = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'and', 'or', 'but', 'if', 'then', 'so', 'to',
  'of', 'in', 'on', 'at', 'for', 'with', 'this', 'that', 'it', 'its', 'i', 'you', 'he', 'she',
  'we', 'they', 'my', 'your', 'his', 'her', 'our', 'their', 'me', 'him', 'us', 'them', 'be',
  'been', 'being', 'do', 'does', 'did', 'have', 'has', 'had', 'will', 'would', 'can', 'could',
  'should', 'just', 'like', 'okay', 'ok', 'yeah', 'yes', 'no', 'not', 'lol', 'lmao', 'haha',
  'omg', 'im', 'u', 'ur', 'dont', 'cant', 'wont', 'thats', 'theres', 'theyre', 'ive', 'youre',
  'null', 'true', 'false', 'done', 'wait', 'by', 'up', 'out', 'all', 'more', 'full', 'old',
  'why', 'what', 'time', 'good', 'shit', 'fuck', 'damn', 'nigga', 'bruh'
]);

const STOPWORDS = new Set([...STOPWORDS_ID, ...STOPWORDS_JV, ...STOPWORDS_EN]);

// ---------------------------------------------------------------------
// Parse Raw File
// ---------------------------------------------------------------------
function parseChat(rawText) {
  const lines = rawText.split(/\r?\n/);
  const messages = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(INVISIBLE_CHARS_RE, '');
    if (!line.trim()) continue;

    const match = line.match(MESSAGE_RE);
    if (match) {
      const dateStr = match[1] || match[3];
      const timeStr = match[2] || match[4];
      const sender = match[5].trim();
      const content = match[6].trim();

      if (current) messages.push(current);
      current = {
        dateStr,
        timeStr,
        sender,
        content,
        isSystem: SYSTEM_PATTERNS.some((re) => re.test(content)),
      };
    } else if (current) {
      current.content += '\n' + line.trim();
    }
  }
  if (current) messages.push(current);
  return messages;
}

// ---------------------------------------------------------------------
// Tokenize & Clean
// ---------------------------------------------------------------------
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !/^\d+$/.test(w));
}

// ---------------------------------------------------------------------
// Co-occurrence Graph Builder & Topic Extractor
// ---------------------------------------------------------------------
function extractTopicClusters(messages) {
  const cooccurrences = new Map();
  const wordDegrees = new Map();

  for (const msg of messages) {
    if (msg.isSystem || msg.content.length < CONFIG.minMessageLength) continue;

    const tokens = tokenize(msg.content);
    // Keep unique meaningful words per message
    const uniqueKeywords = [...new Set(tokens.filter((t) => !STOPWORDS.has(t)))];

    if (uniqueKeywords.length < 2) continue;

    for (let i = 0; i < uniqueKeywords.length; i++) {
      const w1 = uniqueKeywords[i];
      wordDegrees.set(w1, (wordDegrees.get(w1) || 0) + 1);

      for (let j = i + 1; j < uniqueKeywords.length; j++) {
        const w2 = uniqueKeywords[j];
        const pair = w1 < w2 ? `${w1}::${w2}` : `${w2}::${w1}`;
        cooccurrences.set(pair, (cooccurrences.get(pair) || 0) + 1);
      }
    }
  }

  // Build Adjacency Graph from strong pairs
  const graph = new Map();
  for (const [pair, count] of cooccurrences.entries()) {
    if (count < CONFIG.minCooccurrenceCount) continue;
    const [w1, w2] = pair.split('::');

    if (!graph.has(w1)) graph.set(w1, new Map());
    if (!graph.has(w2)) graph.set(w2, new Map());

    graph.get(w1).set(w2, count);
    graph.get(w2).set(w1, count);
  }

  // Greedy Topic Formation around highest-degree seeds
  const sortedSeeds = [...graph.keys()].sort((a, b) => {
    return (wordDegrees.get(b) || 0) - (wordDegrees.get(a) || 0);
  });

  const visitedGlobal = new Set();
  const topicClusters = [];

  for (const seed of sortedSeeds) {
    if (visitedGlobal.has(seed)) continue;

    const cluster = [seed];
    visitedGlobal.add(seed);

    const neighbors = [...graph.get(seed).entries()].sort((a, b) => b[1] - a[1]);

    for (const [neighbor, strength] of neighbors) {
      if (cluster.length >= CONFIG.maxWordsPerCluster) break;
      if (!visitedGlobal.has(neighbor)) {
        cluster.push(neighbor);
        visitedGlobal.add(neighbor);
      }
    }

    if (cluster.length >= 2) {
      topicClusters.push({
        primaryTopic: seed,
        keywords: cluster,
        occurrences: wordDegrees.get(seed) || 0,
      });
    }

    if (topicClusters.length >= CONFIG.topClustersToExtract) break;
  }

  return topicClusters;
}

// ---------------------------------------------------------------------
// Analyze Frequencies & Valid N-Grams
// ---------------------------------------------------------------------
function buildFrequencies(messages) {
  const wordFreq = new Map();
  const bigramFreq = new Map();
  const trigramFreq = new Map();

  for (const msg of messages) {
    if (msg.isSystem || msg.content.length < CONFIG.minMessageLength) continue;

    const tokens = tokenize(msg.content);

    // Filtered Bigrams: both words must NOT be stopwords
    for (let i = 0; i < tokens.length - 1; i++) {
      const t1 = tokens[i];
      const t2 = tokens[i + 1];

      if (!STOPWORDS.has(t1) && !STOPWORDS.has(t2)) {
        const bigram = `${t1} ${t2}`;
        bigramFreq.set(bigram, (bigramFreq.get(bigram) || 0) + 1);
      }

      // Filtered Trigrams: edge tokens must NOT be stopwords
      if (i < tokens.length - 2) {
        const t3 = tokens[i + 2];
        if (!STOPWORDS.has(t1) && !STOPWORDS.has(t3)) {
          const trigram = `${t1} ${t2} ${t3}`;
          trigramFreq.set(trigram, (trigramFreq.get(trigram) || 0) + 1);
        }
      }
    }

    // Filtered Individual Words
    for (const tok of tokens) {
      if (STOPWORDS.has(tok)) continue;
      wordFreq.set(tok, (wordFreq.get(tok) || 0) + 1);
    }
  }

  return { wordFreq, bigramFreq, trigramFreq };
}

// ---------------------------------------------------------------------
// Format Results
// ---------------------------------------------------------------------
function formatOutput(wordFreq, bigramFreq, trigramFreq, topicClusters, stats) {
  const lines = [];

  lines.push('=== CHAT TOPIC & LEXICON SUMMARY (Pure JS Extracted) ===');
  lines.push(`Total files merged: ${stats.totalFiles}`);
  lines.push(`Original messages parsed: ${stats.totalMessages} (${stats.systemMessages} system messages excluded)`);
  lines.push(`Unique Keywords: ${stats.uniqueWords} | Meaningful Bigrams: ${stats.uniqueBigrams} | Trigrams: ${stats.uniqueTrigrams}`);
  lines.push('');

  lines.push('--- TOP TALKED TOPIC CLUSTERS (Co-occurrence Graph) ---');
  if (topicClusters.length === 0) {
    lines.push('No significant topic clusters detected with current threshold.');
  } else {
    for (let i = 0; i < topicClusters.length; i++) {
      const cluster = topicClusters[i];
      lines.push(`${i + 1}. [${cluster.primaryTopic.toUpperCase()}] → ${cluster.keywords.join(', ')} (${cluster.occurrences} msgs)`);
    }
  }
  lines.push('');

  lines.push('--- TOP MEANINGFUL 2-WORD PHRASES (Filtered Bigrams) ---');
  const topBigrams = [...bigramFreq.entries()]
    .filter(([, count]) => count >= CONFIG.minBigramFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, CONFIG.maxBigramsInOutput);
  for (const [phrase, count] of topBigrams) lines.push(`${phrase} — ${count}`);
  lines.push('');

  lines.push('--- TOP 3-WORD PHRASES (Filtered Trigrams) ---');
  const topTrigrams = [...trigramFreq.entries()]
    .filter(([, count]) => count >= CONFIG.minTrigramFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, CONFIG.maxTrigramsInOutput);
  for (const [phrase, count] of topTrigrams) lines.push(`${phrase} — ${count}`);
  lines.push('');

  lines.push('--- KEYWORD FREQUENCY (Non-Stopwords) ---');
  const topWords = [...wordFreq.entries()]
    .filter(([, count]) => count >= CONFIG.minWordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, CONFIG.maxWordsInOutput);
  for (const [word, count] of topWords) lines.push(`${word} — ${count}`);

  return lines.join('\n');
}

// ---------------------------------------------------------------------
// Main CLI Runner
// ---------------------------------------------------------------------
function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node prepare-chat-for-ai.js <output.txt> <input1.txt> [input2.txt ...]');
    process.exit(1);
  }

  const outputPath = args[0];
  const inputPaths = args.slice(1);

  let allMessages = [];
  let totalOriginalSize = 0;

  for (const inputPath of inputPaths) {
    const resolvedPath = path.resolve(inputPath);
    if (!fs.existsSync(resolvedPath)) {
      console.warn(`Warning: File not found: ${inputPath}`);
      continue;
    }
    const rawText = fs.readFileSync(resolvedPath, 'utf8');
    totalOriginalSize += Buffer.byteLength(rawText, 'utf8');

    const messages = parseChat(rawText);
    allMessages = allMessages.concat(messages);
  }

  if (allMessages.length === 0) {
    console.error('Error: No messages parsed from any input files.');
    process.exit(1);
  }

  const systemCount = allMessages.filter((m) => m.isSystem).length;
  const { wordFreq, bigramFreq, trigramFreq } = buildFrequencies(allMessages);
  const topicClusters = extractTopicClusters(allMessages);

  const stats = {
    totalFiles: inputPaths.length,
    totalMessages: allMessages.length,
    systemMessages: systemCount,
    uniqueWords: wordFreq.size,
    uniqueBigrams: bigramFreq.size,
    uniqueTrigrams: trigramFreq.size,
  };

  const output = formatOutput(wordFreq, bigramFreq, trigramFreq, topicClusters, stats);
  fs.writeFileSync(path.resolve(outputPath), output, 'utf8');

  const outputSize = Buffer.byteLength(output, 'utf8');
  const reduction = (100 * (1 - outputSize / totalOriginalSize)).toFixed(1);

  console.log(`\nProcessed ${inputPaths.length} files.`);
  console.log(`Parsed ${stats.totalMessages} messages (${stats.systemMessages} system lines dropped).`);
  console.log(`Detected ${topicClusters.length} distinct topic clusters.`);
  console.log(`Output reduction: ${reduction}% (${(totalOriginalSize / 1024).toFixed(1)} KB -> ${(outputSize / 1024).toFixed(1)} KB)`);
  console.log(`Written to: ${outputPath}\n`);
}

main();