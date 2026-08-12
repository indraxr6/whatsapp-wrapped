import type { GeminiInsights, ParsedChatMetrics } from '../types/chat';
import { formatDuration } from './metrics';
import { formatParticipantPhrase } from '../utils/pluralize';

// ──────────────────────────────────────────────
// Demo/fallback insights (no API required)
// ──────────────────────────────────────────────

function getDeterministicHash(metrics: ParsedChatMetrics): number {
  let hash = 0;
  const str = metrics.participants.join('') + metrics.totalMessages + (metrics.groupName ?? '');
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function generateDemoInsights(metrics: ParsedChatMetrics, language: 'en' | 'id' = 'en', chatMode: 'dm' | 'group' = 'dm'): GeminiInsights {
  const hash = getDeterministicHash(metrics);
  const v = hash % 3; // 3 variants
  
  const participants = metrics.participants;
  const totalMsg = metrics.totalMessages;
  const p1 = participants[0];
  const p1Count = metrics.messagesPerSender[p1] ?? 0;
  const p1Pct = Math.round((p1Count / totalMsg) * 100);

  const ghostCount = Object.values(metrics.ghostingInstances).reduce((a, b) => a + b, 0);

  if (chatMode === 'group') {
    if (language === 'id') {
      const summaries = [
        `Grup ini adalah studi kekacauan: ${p1} mendominasi dengan mengirimkan ${p1Pct}% dari total ${totalMsg.toLocaleString()} pesan, memperlakukan grup ini seperti channel broadcast pribadi, sementara yang lain lebih banyak jadi penonton. ${ghostCount > 0 ? `Ada ${ghostCount} kali obrolan mati total selama 12+ jam sebelum dihidupkan lagi.` : `Grup ini cukup aktif—jarang sepi lebih dari 12 jam.`} Bersama-sama, kalian membangun dinamika sirkus yang konsisten.`,
        `Dinamika grup ini didorong penuh oleh energi ${p1} yang mengirimkan ${p1Pct}% dari ${totalMsg.toLocaleString()} pesan. Sementara sisanya hanya ikut meramaikan sesekali. ${ghostCount > 0 ? `Buktinya, ada ${ghostCount} momen di mana grup ini seperti kuburan sebelum akhirnya bangkit lagi.` : `Hebatnya, percakapan mengalir hampir tanpa henti.`} Grup ini pada dasarnya adalah panggung komedi.`,
        `Kalian telah mengirim total ${totalMsg.toLocaleString()} pesan, namun secara statistik ini adalah monolog ${p1} (${p1Pct}%) yang diselingi oleh balasan sporadis anggota lain. ${ghostCount > 0 ? `Grup ini juga punya hobi mati suri, tercatat ${ghostCount} kali diam lebih dari 12 jam.` : `Tidak ada kata istirahat di sini, selalu ada yang dibahas.`} Sebuah ekosistem digital yang unik dan tak terduga.`
      ];
      const roasts = [
        `${p1}, rasio pesanmu menunjukkan kamu butuh grup lain biar gak monolog terus. Yang paling diam, kalian ada buat baca atau cuma nunggu ditraktir?`,
        `${p1}, apakah jarimu tidak lelah mendominasi chat ini? Untuk sisanya, apakah kalian cuma NPC di sini?`,
        `Grup ini isinya 90% spam dari ${p1} dan 10% orang lain yang bingung mau merespon apa.`
      ];
      const topics = ['wacana jalan', 'stiker random', 'ngomongin orang', 'makanan'];
      const evolution_note = `Seiring waktu, grup kalian berubah dari obrolan formal menjadi kumpulan stiker tanpa konteks.`;
      return { personality_summary: summaries[v], roast: roasts[v], topics, evolution_note };
    }
    const summaries = [
      `This group is a study in chaos: ${p1} dominates by sending ${p1Pct}% of all ${totalMsg.toLocaleString()} messages, treating the chat like a personal broadcast channel, while others mostly spectate. ${ghostCount > 0 ? `There were ${ghostCount} instances of the chat dying completely for 12+ hours before being revived.` : `The group is highly active—rarely quiet for more than 12 hours.`} Together you've built a dynamic that is, at minimum, a consistent circus.`,
      `The dynamic here is heavily skewed: ${p1} drives the bus, sending ${p1Pct}% of the ${totalMsg.toLocaleString()} total messages, leaving everyone else as mere passengers. ${ghostCount > 0 ? `The chat also exhibits ${ghostCount} moments of total radio silence for 12+ hours.` : `Impressively, the conversation almost never stops.`} It's a digital ecosystem that defies explanation.`,
      `With ${totalMsg.toLocaleString()} messages in the vault, this is less of a group chat and more of ${p1}'s personal diary (${p1Pct}%), featuring occasional guest appearances. ${ghostCount > 0 ? `You also collectively ghost each other, with ${ghostCount} deep silences of 12+ hours.` : `The pacing is relentless, with barely a pause to breathe.`} Truly an unhinged masterpiece of modern communication.`
    ];
    const roasts = [
      `${p1}, your message ratio suggests you need another group so you stop monologuing. The quiet ones, are you here to read or just waiting for free food?`,
      `${p1}, does your back hurt from carrying this entire group chat? Everyone else, blink twice if you need rescuing.`,
      `This is basically ${p1}'s podcast, and the rest of you are just forced listeners.`
    ];
    const topics = ['cancelled plans', 'random stickers', 'gossiping', 'food'];
    const evolution_note = `Over time, your group evolved from polite discussions to an unfiltered stream of out-of-context stickers.`;
    return { personality_summary: summaries[v], roast: roasts[v], topics, evolution_note };
  }

  // DM mode
  const p2 = participants[1] ?? p1;
  const p2Pct = 100 - p1Pct;
  const bigTexter = p1Pct >= p2Pct ? p1 : p2;
  const quietOne = p1Pct >= p2Pct ? p2 : p1;
  const quickReplier = (metrics.avgResponseTimeMinutes[p1] ?? 999) <= (metrics.avgResponseTimeMinutes[p2] ?? 999) ? p1 : p2;
  const quickSpeed = formatDuration(metrics.avgResponseTimeMinutes[quickReplier] ?? 5);

  if (language === 'id') {
    const summaries = [
      `Percakapan ini adalah studi kontras: ${bigTexter} mengirimkan ${p1Pct >= p2Pct ? p1Pct : p2Pct}% dari total ${totalMsg.toLocaleString()} pesan, memperlakukan chat ini seperti channel broadcast pribadi, sementara ${quietOne} beroperasi dengan lebih santai. ${quickReplier} adalah pembalas tercepat dengan rata-rata ${quickSpeed} — tipe orang yang ponselnya selalu di tangan. ${ghostCount > 0 ? `Ada ${ghostCount} kali seseorang menghilang selama 12+ jam, entah karena sibuk atau cuma baca doang.` : `Menariknya, tidak ada yang suka ghosting — kecepatan balas cukup bagus.`} Bersama-sama, kalian membangun dinamika yang, paling tidak, konsisten kacau.`,
      `Dinamika percakapan ini didorong oleh ${bigTexter} yang menyumbang ${p1Pct >= p2Pct ? p1Pct : p2Pct}% dari ${totalMsg.toLocaleString()} pesan, meninggalkan ${quietOne} untuk merespon seperlunya saja. Di sisi lain, jari ${quickReplier} bergerak secepat kilat dengan balasan rata-rata ${quickSpeed}. ${ghostCount > 0 ? `Sisi gelapnya, kalian tercatat saling diam 12+ jam sebanyak ${ghostCount} kali.` : `Hebatnya kalian nyaris tidak pernah membiarkan chat menggantung.`} Interaksi ini mendefinisikan apa itu tarik-ulur digital.`,
      `Kalian berdua telah menumpuk ${totalMsg.toLocaleString()} pesan, di mana ${bigTexter} mendominasi ${p1Pct >= p2Pct ? p1Pct : p2Pct}% darinya seolah mengejar kuota kata. ${quietOne} jauh lebih hemat energi. ${quickReplier} pantas dapat piala fast-response karena rekor balas ${quickSpeed}-nya. ${ghostCount > 0 ? `Walau begitu, kebiasaan ngilang belasan jam sebanyak ${ghostCount} kali cukup membuktikan prioritas ` + formatParticipantPhrase(metrics.participants.length, 'kalian berdua', 'kalian') + `.` : `Konsistensi balas kalian patut diacungi jempol.`} Kombinasi yang unik antara agresif dan pasif.`
    ];
    const roasts = [
      `${bigTexter}, rasio pesan-terbalasmu menunjukkan kamu gak kenal konsep "nunggu dibalas." ${quietOne}, balasan singkatmu berteriak efisiensi ekstrem atau sekadar malas ketik.`,
      `${bigTexter}, apakah kamu dibayar per kata? Karena pesannya banyak banget. ${quietOne}, pelit amat jempolnya.`,
      `Percakapan ini membuktikan bahwa ${bigTexter} sangat suka ngomong sendiri, dan ${quietOne} sangat sabar meladeninya.`
    ];
    const topics = ['update harian', 'link random', 'krisis eksistensial', 'makanan'];
    const evolution_note = `Seiring waktu, percakapan kalian berubah dari sapaan sopan menjadi obrolan ngalor-ngidul tanpa filter.`;
    return { personality_summary: summaries[v], roast: roasts[v], topics, evolution_note };
  }

  const summaries = [
    `This chat is a study in contrast: ${bigTexter} sends ${p1Pct >= p2Pct ? p1Pct : p2Pct}% of all ${totalMsg.toLocaleString()} messages, treating the conversation like a personal broadcast channel, while ${quietOne} operates at a more measured pace. ${quickReplier} is the faster responder at an average of ${quickSpeed} — the kind of person who always has their phone in hand. ${ghostCount > 0 ? `There were ${ghostCount} instances of someone going radio-silent for 12+ hours, which is either a sign of a busy life or selective reading.` : `Notably, neither person is a serial ghoster — response rates are respectable across the board.`} Together they've built a dynamic that is, at minimum, reliably chaotic.`,
    `The energy in this chat is deeply asymmetrical: ${bigTexter} churns out ${p1Pct >= p2Pct ? p1Pct : p2Pct}% of the ${totalMsg.toLocaleString()} messages, leaving ${quietOne} to just nod along. Meanwhile, ${quickReplier} is the undisputed speed demon with a ${quickSpeed} average reply time. ${ghostCount > 0 ? `You do have a habit of disappearing though, logging ${ghostCount} silences of 12+ hours.` : `You somehow never let the conversation die completely.`} It’s an exercise in extreme over-communication meets strategic minimalism.`,
    `With ${totalMsg.toLocaleString()} total messages, this looks less like a conversation and more like ${bigTexter}’s digital journal (${p1Pct >= p2Pct ? p1Pct : p2Pct}%) with occasional feedback from ${quietOne}. But ${quickReplier} wins the reflex test, answering in ${quickSpeed} on average. ${ghostCount > 0 ? `Still, the ${ghostCount} times you totally ignored each other for half a day suggests ` + formatParticipantPhrase(metrics.participants.length, 'you both', 'you all') + ` have lives outside this app.` : formatParticipantPhrase(metrics.participants.length, 'You two', 'You all') + ` are basically tethered to each other—no major gaps in replying at all.`} A true yin-and-yang friendship.`
  ];
  const roasts = [
    `${bigTexter}, your message-to-reply ratio suggests you've never heard of the concept of "waiting for a response." ${quietOne}, your average screams either extreme efficiency or a deep commitment to doing the bare minimum.`,
    `${bigTexter}, do you get paid per text sent? ${quietOne}, I admire your refusal to match their chaotic energy.`,
    `This chat proves ${bigTexter} is terrified of silence, and ${quietOne} is just along for the ride.`
  ];
  const topics = ['daily updates', 'random links', 'existential dread', 'food'];
  const evolution_note = `Over time, your conversation evolved from polite check-ins to unfiltered stream of consciousness.`;

  return { personality_summary: summaries[v], roast: roasts[v], topics, evolution_note };
}

// ──────────────────────────────────────────────
// Model priority — edit this list to add/remove models
// ──────────────────────────────────────────────

/**
 * Models tried in order — first one that succeeds wins.
 * gemini-flash-latest has the best success rate for new AQ. keys.
 * Keep this as an editable config — model names drift as Google deprecates/renames.
 */
const MODEL_PRIORITY = [
  'gemini-flash-latest',
  'gemini-2.5-flash-lite-preview-06-17',
  'gemini-2.5-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-001',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash-8b-001',
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
];



const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function buildPromptPayload(metrics: ParsedChatMetrics): object {
  const {
    participants,
    messagesPerSender,
    avgResponseTimeMinutes,
    mediaCounts,
    topEmojisPerSender,
    sampleExcerpts,
    eraMetrics,
    topKeywords,
    totalMessages,
    doubleTextCounts,
    ghostingInstances,
    chatDurationDays,
    avgMessagesPerDay,
  } = metrics;

  const senderDistribution: Record<string, number> = {};
  const avgLatency: Record<string, string> = {};
  const mediaSent: Record<string, number> = {};
  const topEmojis: Record<string, string[]> = {};

  for (const p of participants) {
    senderDistribution[p] = messagesPerSender[p] ?? 0;
    avgLatency[p] = formatDuration(avgResponseTimeMinutes[p] ?? 0);
    mediaSent[p] = mediaCounts[p] ?? 0;
    topEmojis[p] = (topEmojisPerSender[p] ?? []).slice(0, 5).map((e) => e.emoji);
  }

  return {
    total_messages: totalMessages,
    participants,
    date_range: {
      start: metrics.dateRange.start.toDateString(),
      end: metrics.dateRange.end.toDateString(),
    },
    chat_duration_days: chatDurationDays,
    avg_messages_per_day: avgMessagesPerDay,
    metrics: {
      sender_distribution: senderDistribution,
      avg_response_latency: avgLatency,
      media_sent: mediaSent,
      top_emojis: topEmojis,
      double_texts: doubleTextCounts,
      ghosting_instances: ghostingInstances,
    },
    top_keywords: topKeywords.slice(0, 30).map(k => ({ word: k.word, count: k.count })),
    era_metrics: eraMetrics,
    // Capped to stay within strict free-tier input-token limits
    sample_excerpts: {
      early: sampleExcerpts.early.slice(0, 15),
      median: sampleExcerpts.median.slice(0, 10),
      late: sampleExcerpts.late.slice(0, 10),
    }
  };
}

const SYSTEM_PROMPT = `You are a sharp, opinionated analyst writing "Chat Wrapped" personality summaries — think a brutally honest friend who has read all 14,000 messages and is not going to be polite about what they found.

You MUST respond with valid JSON only, no markdown, no explanation. The JSON must exactly match this schema:
{
  "personality_summary": "One paragraph, 4-5 sentences max. Merge the archetype, vibe, and power balance into a single cohesive read. Reference at least one concrete number (message count, response time, etc.) or a specific observation from the excerpts — no generic personality-quiz language that could apply to any chat. Be direct, punchy, and specific.",
  "roast": "1-2 sentences max. A genuinely witty, specific roast of the chat dynamic — reference something real from the data. Short is funnier than long.",
  "topics": ["Array of 3-6 topics. A topic MUST be backed by a top_keywords entry with a meaningfully high count relative to the others in the list — do not invent a topic from a single mention in sample_excerpts alone, even if it seems interesting. Excerpts are for tone/phrasing color only, not topic sourcing. If in doubt, prefer a topic you can point to a specific keyword count for over a vivid but rare detail."],
  "evolution_note": "1 sentence describing how the dynamic changed over time (early -> late). Identify the qualitative shift (formality, pacing, emoji use, message length). DO NOT cite specific numbers in this sentence. Use a narrative, contrast-based structure.\\nExamples:\\n- 'Over time, your conversation evolved from polite check-ins to an unfiltered stream of consciousness.'\\n- 'Conversations that used to take a breath between replies now arrive in a breathless rush.'\\n- 'Seiring berjalannya waktu, gaya komunikasi bergeser dari sapaan kaku menjadi rentetan stiker tanpa henti.'\\n- 'Dari obrolan sporadis di awal, grup ini bertransformasi menjadi markas diskusi harian yang intens.'"
}

CRITICAL RULES:
- personality_summary: 4-5 sentences MAXIMUM. Do not exceed this.
- roast: 1-2 sentences MAXIMUM. Do not exceed this.
- Never start sentences with "It's clear that", "Overall,", "In conclusion,", "It's worth noting that", or similar filler openers.
- No em-dash-heavy filler, no hedge-everything language, no corporate transitions.
- No meta-commentary like "This chat shows..." or "These statistics reveal..." — just say the thing.
- No "AI Generated" labels or any self-reference to being a model.
- Ground everything in the actual stats and excerpts provided — generic output that ignores the data is a failure.
- A topic must be evidenced by a high top_keywords count, not a single memorable line from sample_excerpts. One-off mentions (a place, a brand, an event named once) are not topics even if specific and quotable.`;

// ──────────────────────────────────────────────
// Auth helpers
// ──────────────────────────────────────────────

function isOAuthToken(key: string): boolean {
  return key.startsWith('ya29.');
}

function buildHeaders(apiKey: string): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (isOAuthToken(apiKey)) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  return headers;
}

function buildUrl(model: string, apiKey: string): string {
  const base = `${GEMINI_BASE}/${model}:generateContent`;
  return isOAuthToken(apiKey) ? base : `${base}?key=${apiKey}`;
}

async function tryModel(apiKey: string, model: string, body: object): Promise<string | null> {
  const url = buildUrl(model, apiKey);
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: buildHeaders(apiKey),
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      'Network request blocked — likely by a browser extension.\n\n' +
      '👉 Fix: Open this app in an Incognito / Private window (extensions are disabled there), or temporarily turn off your ad blocker / privacy extension and try again.'
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message: string = (errorData as any)?.error?.message ?? '';
    const status = response.status;

    // Skip to next model — this model isn't available or quota is exhausted
    if (
      status === 404 ||
      (status === 400 && message.toLowerCase().includes('no longer available')) ||
      (status === 400 && message.toLowerCase().includes('not found')) ||
      (status === 400 && message.toLowerCase().includes('deprecated')) ||
      (status === 403 && message.toLowerCase().includes('model'))
    ) {
      return null;
    }

    if (status === 429) {
      // If limit is 0, no point retrying this model — try next
      if (message.includes('limit: 0')) {
        return null;
      }
      throw new Error(`429_RATE_LIMITED`);
    }

    if (status === 503) {
      throw new Error(`503_UNAVAILABLE`);
    }

    throw new Error(`Gemini API error (${status}): ${message}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text ?? null;
}

function parseInsights(raw: string): GeminiInsights {
  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
  const parsed = JSON.parse(cleaned);

  // Defensive: truncate personality_summary to 5 sentences if model overshot
  let summary: string = parsed.personality_summary ?? '';
  const sentences = summary.match(/[^.!?]*[.!?]+/g) ?? [];
  if (sentences.length > 5) {
    summary = sentences.slice(0, 5).join(' ').trim();
  }

  let roast: string = parsed.roast ?? '';
  const roastSentences = roast.match(/[^.!?]*[.!?]+/g) ?? [];
  if (roastSentences.length > 2) {
    roast = roastSentences.slice(0, 2).join(' ').trim();
  }

  const topics: string[] = Array.isArray(parsed.topics) ? parsed.topics.slice(0, 6) : [];
  const evolution_note: string = parsed.evolution_note ?? '';

  return {
    personality_summary: summary,
    roast,
    topics,
    evolution_note,
  };
}

export async function analyzeWithGemini(
  apiKey: string,
  metrics: ParsedChatMetrics,
  language: 'en' | 'id' = 'en',
  chatMode: 'dm' | 'group' = 'dm'
): Promise<GeminiInsights> {
  const payload = buildPromptPayload(metrics);

  const langInstruction = language === 'id'
    ? '\nCRITICAL RULE: You MUST output all JSON values in Indonesian language.'
    : '\nCRITICAL RULE: You MUST output all JSON values in English language.';

  const modeInstruction = chatMode === 'group'
    ? '\nCONTEXT: This is a GROUP CHAT with 3+ participants. Summarize the GROUP dynamic, who dominates, and who lurks.'
    : '\nCONTEXT: This is a DIRECT MESSAGE between 2 participants. Summarize the TWO-PERSON dynamic and contrast them.';

  const requestBody = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT + langInstruction + modeInstruction }],
    },
    contents: [
      {
        parts: [
          { text: `Here is the WhatsApp chat data to analyze:\n\n${JSON.stringify(payload, null, 2)}` },
        ],
      },
    ],
    generationConfig: {
      response_mime_type: 'application/json',
      temperature: 1,
    },
  };

  for (const model of MODEL_PRIORITY) {
    const raw = await tryModel(apiKey, model, requestBody);
    if (raw) {
      return parseInsights(raw);
    }
  }

  throw new Error(
    'All Gemini models are unavailable or quota-exhausted for your API key. ' +
    'Using demo insights instead.'
  );
}

/** Generates a roast-only call for the Roast More feature */
export async function generateNewRoast(
  apiKey: string,
  metrics: ParsedChatMetrics,
  existingRoasts: string[]
): Promise<string> {
  const payload = buildPromptPayload(metrics);

  const avoidList = existingRoasts.length > 0
    ? `\n\nIMPORTANT: You have already generated these roasts — do NOT repeat the same jokes or angles:\n${existingRoasts.map((r, i) => `${i + 1}. "${r}"`).join('\n')}`
    : '';

  const roastPrompt = `You are writing a fresh 1-2 sentence roast of this WhatsApp chat. Be specific to the data provided. No repeating previous roasts.${avoidList}

Respond with valid JSON only: { "roast": "your roast text here" }`;

  const requestBody = {
    system_instruction: {
      parts: [{ text: roastPrompt }],
    },
    contents: [
      {
        parts: [
          { text: `Chat data:\n\n${JSON.stringify(payload, null, 2)}` },
        ],
      },
    ],
    generationConfig: {
      response_mime_type: 'application/json',
      temperature: 1.2, // slightly higher temp for variety
    },
  };

  for (const model of MODEL_PRIORITY) {
    const raw = await tryModel(apiKey, model, requestBody);
    if (raw) {
      const cleaned = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
      const parsed = JSON.parse(cleaned);
      let roast: string = parsed.roast ?? '';
      const sentences = roast.match(/[^.!?]*[.!?]+/g) ?? [];
      if (sentences.length > 2) roast = sentences.slice(0, 2).join(' ').trim();
      return roast;
    }
  }

  throw new Error('Could not generate a new roast — all models exhausted.');
}
