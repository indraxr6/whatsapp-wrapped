import type { GeminiInsights, ParsedChatMetrics } from '../types/chat';
import { formatDuration } from './metrics';
import { generateOfflineInsights } from './fallbacks';
export const generateDemoInsights = generateOfflineInsights;

// ──────────────────────────────────────────────
// Model priority - edit this list to add/remove models
// ──────────────────────────────────────────────

/**
 * Models tried in order - first one that succeeds wins.
 * gemini-flash-latest has the best success rate for new AQ. keys.
 * Keep this as an editable config - model names drift as Google deprecates/renames.
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

  const totalSlurs = Object.values(metrics.slurCount || {}).reduce((a, b) => a + b, 0);

  const payload: any = {
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

  if (totalSlurs > 45) {
    payload.metrics.total_slurs = totalSlurs;
    payload.metrics.top_slurs = (metrics.topSlurs || []).map(s => s.word);
  }

  return payload;
}

const SYSTEM_PROMPT = `You are a sharp, opinionated analyst writing "Chat Wrapped" personality summaries - think a brutally honest friend who has read all 14,000 messages and is not going to be polite about what they found.

You MUST respond with valid JSON only, no markdown, no explanation. The JSON must exactly match this schema:
{
  "personality_summary": "One paragraph, 4-5 sentences max. Merge the archetype, vibe, and power balance into a single cohesive read. Reference at least one concrete number (message count, response time, etc.) or a specific observation from the excerpts - no generic personality-quiz language that could apply to any chat. Be direct, punchy, and specific.",
  "chat_insight": "1-2 sentences max. A genuinely witty, specific roast of the chat dynamic - reference something real from the data. Short is funnier than long.",
  "evolution_note": "1 sentence describing how the dynamic changed over time (early -> late). Identify the qualitative shift (formality, pacing, emoji use, message length). DO NOT cite specific numbers in this sentence. Use a narrative, contrast-based structure."
}

CRITICAL RULES:
- personality_summary: 4-5 sentences MAXIMUM. Do not exceed this.
- chat_insight: 1-2 sentences MAXIMUM. Do not exceed this.
- Never start sentences with "It's clear that", "Overall,", "In conclusion,", "It's worth noting that", or similar filler openers.
- No em-dash-heavy filler, no hedge-everything language, no corporate transitions.
- No meta-commentary like "This chat shows..." or "These statistics reveal..." - just say the thing.
- No "AI Generated" labels or any self-reference to being a model.
- Ground everything in the actual stats and excerpts provided - generic output that ignores the data is a failure.`;

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
      'Network request blocked - likely by a browser extension.\n\n' +
      '👉 Fix: Open this app in an Incognito / Private window (extensions are disabled there), or temporarily turn off your ad blocker / privacy extension and try again.'
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message: string = (errorData as any)?.error?.message ?? '';
    const status = response.status;

    // Skip to next model - this model isn't available or quota is exhausted
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
      // If limit is 0, no point retrying this model - try next
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

  let chat_insight: string = parsed.chat_insight ?? '';
  const roastSentences = chat_insight.match(/[^.!?]*[.!?]+/g) ?? [];
  if (roastSentences.length > 2) {
    chat_insight = roastSentences.slice(0, 2).join(' ').trim();
  }

  const evolution_note: string = parsed.evolution_note ?? '';

  return {
    personality_summary: summary,
    chat_insight,
    topics: [], // We calculate topics in metrics.ts now
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

/** Generates a roast-only call for the More Insight feature */
export async function generateNewInsight(
  apiKey: string,
  metrics: ParsedChatMetrics,
  existingInsights: string[],
  language: 'en' | 'id' = 'en',
  isOffline: boolean = false
): Promise<string | null> {
  if (isOffline) {
    const newInsight = await import('./fallbacks').then(m => m.generateOfflineInsights(metrics, language, existingInsights).chat_insight);
    // If the newly generated insight is already in the existing insights, it means we've exhausted all deterministic offline variants.
    if (existingInsights.includes(newInsight)) {
      return null;
    }
    return newInsight;
  }

  const payload = buildPromptPayload(metrics);

  const avoidList = existingInsights.length > 0
    ? `\n\nIMPORTANT: You have already generated these insights - do NOT repeat the same jokes or angles:\n${existingInsights.map((r, i) => `${i + 1}. "${r}"`).join('\n')}`
    : '';

  const roastPrompt = `You are writing a fresh 1-2 sentence roast of this WhatsApp chat. Be specific to the data provided. No repeating previous roasts.${avoidList}

Respond with valid JSON only: { "chat_insight": "your roast text here" }`;

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
      let insight: string = parsed.chat_insight ?? parsed.roast ?? '';
      const sentences = insight.match(/[^.!?]*[.!?]+/g) ?? [];
      if (sentences.length > 2) insight = sentences.slice(0, 2).join(' ').trim();
      return insight;
    }
  }

  throw new Error('Could not generate a new insight - all models exhausted.');
}
