import type { ChatMessage, EmojiCount, MediaType, MonthlyCount, ParsedChatMetrics, EraMetrics } from '../types/chat';

const STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'yang', 'di', 'ke', 'dari', 'dan', 'dengan', 'itu', 'ini', 'untuk', 'pada', 'dalam', 'aku', 'saya', 'kamu', 'dia', 'kita', 'kami', 'mereka', 'bisa', 'ada', 'tidak', 'ya', 'gak', 'ga', 'gk', 'aja', 'sih', 'deh', 'udah', 'dah', 'belum', 'lagi', 'kok', 'banget', 'bgt', 'juga', 'jg', 'kalau', 'kalo', 'kl', 'kayak', 'kyk', 'kan', 'dong', 'punya', 'buat', 'sama', 'sm', 'terus', 'trs', 'nanti', 'ntar', 'sekarang', 'skrg', 'tapi', 'tp', 'atau', 'tau', 'tahu', 'mau', 'enggak', 'nggak', 'ngga', 'biar', 'jadi', 'jd', 'pas', 'lah', 'loh', 'lho', 'tuh', 'nih', 'mah',
  'wae', 'ae', 'iki', 'iku', 'kuwi', 'kui', 'sing', 'wis', 'wes', 'durung', 'ora', 'ra', 'iso', 'isa', 'arep', 'meh', 'neng', 'ning', 'karo', 'lan', 'nang', 'kanggo', 'kang', 'dadi', 'kowe', 'koe', 'awakmu', 'kulo', 'dalem', 'njenengan', 'panjenengan', 'menyang', 'saka', 'saking',
  'omitted', 'media', 'https'
]);

const OVERNIGHT_GAP_MINUTES = 360; // 6 hours — gaps larger than this are excluded from avg latency

// ──────────────────────────────────────────────
// Emoji extraction using Unicode property escapes
// ──────────────────────────────────────────────
const EMOJI_REGEX = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

function extractEmojisFromText(text: string): string[] {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    const segments = Array.from(segmenter.segment(text)).map(s => s.segment);
    return segments.filter(s => {
      const regex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
      return regex.test(s);
    });
  }
  return text.match(EMOJI_REGEX) ?? [];
}

function topN<T extends { count: number }>(arr: T[], n = 10): T[] {
  return arr.sort((a, b) => b.count - a.count).slice(0, n);
}

// ──────────────────────────────────────────────
// Core metrics calculations
// ──────────────────────────────────────────────

export function calculateMetrics(messages: ChatMessage[], fileName?: string): ParsedChatMetrics {
  const realMessages = messages.filter((m) => m.sender !== 'System' && m.sender !== 'WhatsApp' && m.sender !== 'Meta AI');
  const contentMessages = realMessages.filter((m) => !m.isMedia && !m.isSystem);

  if (realMessages.length === 0) {
    throw new Error('No parseable messages found in the export.');
  }

  const rawParticipants = Array.from(
    new Set(realMessages.map((m) => m.sender))
  ).filter(Boolean);

  const senderNonSystemCounts: Record<string, number> = {};
  for (const m of realMessages) {
    // A genuine participant is someone who sends a real text/media OR initiates a call
    if (!m.isSystem || m.isCall) {
      senderNonSystemCounts[m.sender] = (senderNonSystemCounts[m.sender] ?? 0) + 1;
    }
  }

  const participants = rawParticipants.filter(p => senderNonSystemCounts[p] > 0);
  const systemOnlySenders = rawParticipants.filter(p => !senderNonSystemCounts[p]);

  let dominantSystemSender: string | null = null;
  if (systemOnlySenders.length > 0) {
    const systemCounts: Record<string, number> = {};
    for (const m of realMessages) {
      if (m.isSystem && systemOnlySenders.includes(m.sender)) {
        systemCounts[m.sender] = (systemCounts[m.sender] ?? 0) + 1;
      }
    }
    dominantSystemSender = Object.keys(systemCounts).sort((a, b) => systemCounts[b] - systemCounts[a])[0];
  }

  const dateRange = {
    start: realMessages[0].timestamp,
    end: realMessages[realMessages.length - 1].timestamp,
  };

  // ── Group Name Detection ──
  let groupName: string | null = null;
  // Group name detection regexes.
  // NOTE: WhatsApp uses different left " (U+201C) and right " (U+201D) curly quotes.
  // A backreference \1 would fail since the opening and closing quotes differ.
  // We match any quote character for both open and close independently.
  const renameRegex = /(?:changed the group name to|changed this group's name to|changed the subject to|mengubah nama grup menjadi|mengubah subjek menjadi|mengubah subjek grup menjadi)\s*[\u201c\u201d"]?([^\u201c\u201d"]+)[\u201c\u201d"]?\s*$/i;
  const creationRegex = /(?:created group|membuat grup|telah membuat grup)\s+[\u201c\u201d"]?(.+?)[\u201c\u201d"]?\s*$/i;

  let latestRenameMatch: string | null = null;
  let creationMatch: string | null = null;

  // Group-name stop-words that should never be treated as a real group name
  const NAME_STOP_WORDS = new Set(['ini', 'itu', 'this', 'the', 'here', 'tersebut']);

  for (const m of messages) {
    if (m.isSystem) {
      const rename = m.content.match(renameRegex);
      if (rename && rename[1]) {
        latestRenameMatch = rename[1].trim();
      }
      if (!creationMatch) {
        const creation = m.content.match(creationRegex);
        // Guard: captured name must be >3 chars and not a pronoun/demonstrative
        if (creation && creation[1] && creation[1].trim().length > 3 && !NAME_STOP_WORDS.has(creation[1].trim().toLowerCase())) {
          creationMatch = creation[1].trim();
        }
      }
    }
  }

  if (latestRenameMatch) {
    groupName = latestRenameMatch;
  } else if (creationMatch) {
    groupName = creationMatch.replace(/^["“”]|["“”]$/g, '').trim();
  } else if (dominantSystemSender) {
    groupName = dominantSystemSender;
  } else if (fileName) {
    // Attempt to extract group name from "WhatsApp Chat with My Group.txt"
    // Or "WhatsApp Chat - My Group.txt"
    const fnMatch = fileName.match(/WhatsApp Chat (?:with|-)?\s*(.+)\.txt/i);
    if (fnMatch && fnMatch[1] && fnMatch[1].trim() !== '') {
      groupName = fnMatch[1].trim();
    } else if (participants.length > 2) {
      groupName = 'Group Chat';
    }
  } else if (participants.length > 2) {
    groupName = 'Group Chat';
  } else {
    groupName = null;
  }

  // ── Chat span & pace ──
  const uniqueDatesSet = new Set(
    realMessages.map((m) => {
      const d = m.timestamp;
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );
  const activeChatDays = uniqueDatesSet.size;

  const chatDurationDays = Math.max(
    1,
    Math.ceil(
      (dateRange.end.getTime() - dateRange.start.getTime()) / 86400000
    )
  );
  const avgMessagesPerDay = parseFloat((realMessages.length / activeChatDays).toFixed(1));

  // ── Message counts per sender ──
  const messagesPerSender: Record<string, number> = {};
  const editedMessageCount: Record<string, number> = {};
  const deletedMessageCount: Record<string, number> = {};
  for (const m of realMessages) {
    if (!m.isCall && !m.isSystem) {
      messagesPerSender[m.sender] = (messagesPerSender[m.sender] ?? 0) + 1;
    }
    // Note: deleted messages are system messages, so they won't count in messagesPerSender.
    // If you want them to count in messagesPerSender, remove the && !m.isSystem above.
    if (m.isEdited) {
      editedMessageCount[m.sender] = (editedMessageCount[m.sender] ?? 0) + 1;
    }
    if (m.isSystem && (m.content.toLowerCase().includes('deleted') || m.content.toLowerCase().includes('dihapus'))) {
      deletedMessageCount[m.sender] = (deletedMessageCount[m.sender] ?? 0) + 1;
    }
  }

  // ── Call metrics ──
  const callsInitiated: Record<string, number> = {};
  const callsMissed: Record<string, number> = {};
  const totalCallDurationSeconds: Record<string, number> = {};
  const totalVideoCallDurationSeconds: Record<string, number> = {};
  let longestVoiceCallSeconds = 0;
  let longestVideoCallSeconds = 0;

  for (const m of realMessages) {
    if (m.isCall) {
      callsInitiated[m.sender] = (callsInitiated[m.sender] ?? 0) + 1;

      if (m.callOutcome === 'missed' || m.callOutcome === 'no-answer') {
        callsMissed[m.sender] = (callsMissed[m.sender] ?? 0) + 1;
      }

      if (m.callDurationSeconds) {
        if (m.callType === 'video') {
          totalVideoCallDurationSeconds[m.sender] = (totalVideoCallDurationSeconds[m.sender] ?? 0) + m.callDurationSeconds;
          if (m.callDurationSeconds > longestVideoCallSeconds) {
            longestVideoCallSeconds = m.callDurationSeconds;
          }
        } else {
          // Voice (or unknown, treat as voice)
          totalCallDurationSeconds[m.sender] = (totalCallDurationSeconds[m.sender] ?? 0) + m.callDurationSeconds;
          if (m.callDurationSeconds > longestVoiceCallSeconds) {
            longestVoiceCallSeconds = m.callDurationSeconds;
          }
        }
      }
    }
  }

  // ── Media counts per sender (total) and per-type ──
  const mediaCounts: Record<string, number> = {};
  const stickerCount: Record<string, number> = {};
  const viewOnceCount: Record<string, number> = {};
  const MEDIA_TYPES: MediaType[] = ['image', 'video', 'audio', 'sticker', 'gif', 'document', 'contactCard', 'location', 'link'];
  const mediaLeaderboard: Record<MediaType, number> = Object.fromEntries(
    MEDIA_TYPES.map((t) => [t, 0])
  ) as Record<MediaType, number>;
  const mediaLeaderboardPerSender: Record<string, Record<MediaType, number>> = {};

  for (const p of participants) {
    mediaLeaderboardPerSender[p] = Object.fromEntries(
      MEDIA_TYPES.map((t) => [t, 0])
    ) as Record<MediaType, number>;
  }

  const sharedLinks: Record<string, number> = {
    'Spotify': 0,
    'Apple Music': 0,
    'YouTube': 0,
    'Instagram Reels': 0,
    'Instagram Stories': 0,
    'Instagram Profile': 0,
    'TikTok': 0,
    'X': 0,
    'Google Maps': 0,
    'Google Forms': 0,
    'Google Sheets': 0,
    'Google Docs': 0,
    'Google Slides': 0,
    'Google Drive': 0,
    'Google Meet': 0,
    'GitHub': 0,
    'Facebook': 0,
    'Tokopedia': 0,
    'Other Links': 0,
  };

  for (const m of realMessages.filter((m) => m.isMedia)) {
    const type = m.mediaType ?? 'image';
    
    if (type === 'sticker') {
      stickerCount[m.sender] = (stickerCount[m.sender] ?? 0) + 1;
    } else {
      mediaCounts[m.sender] = (mediaCounts[m.sender] ?? 0) + 1;
      mediaLeaderboard[type] = (mediaLeaderboard[type] ?? 0) + 1;
      if (mediaLeaderboardPerSender[m.sender]) {
        mediaLeaderboardPerSender[m.sender][type] = (mediaLeaderboardPerSender[m.sender][type] ?? 0) + 1;
      }
    }

    if (m.content.toLowerCase().includes('view once')) {
      viewOnceCount[m.sender] = (viewOnceCount[m.sender] ?? 0) + 1;
    }

   if (type === "link") {
     const c = m.content.toLowerCase();

     if (c.includes("open.spotify.com") || c.includes("spotify.link"))
       sharedLinks["Spotify"]++;
     else if (c.includes("music.apple.com")) sharedLinks["Apple Music"]++;
     else if (c.includes("youtu.be/") || c.includes("youtube.com/")) sharedLinks["YouTube"]++;
     else if (c.includes("instagram.com/reel/")) sharedLinks["Instagram Reels"]++;
     else if (c.includes("instagram.com/stories/")) sharedLinks["Instagram Stories"]++;
     else if (c.includes("instagram.com/")) sharedLinks["Instagram Profile"]++;
     else if (c.includes("twitter.com/") || c.includes("x.com/")) sharedLinks["X"]++;
     else if (
       c.includes("maps.google.com") ||
       c.includes("google.com/maps") ||
       c.includes("maps.app.goo.gl")
     )
       sharedLinks["Google Maps"]++;
     else if (c.includes("docs.google.com/forms")) sharedLinks["Google Forms"]++;
     else if (c.includes("docs.google.com/spreadsheets")) sharedLinks["Google Sheets"]++;
     else if (c.includes("docs.google.com/document")) sharedLinks["Google Docs"]++;
     else if (c.includes("docs.google.com/presentation")) sharedLinks["Google Slides"]++;
     else if (c.includes("drive.google.com")) sharedLinks["Google Drive"]++;
     else if (c.includes("meet.google.com")) sharedLinks["Google Meet"]++;
     else if (c.includes("github.com")) sharedLinks["GitHub"]++;
     else if (c.includes("facebook.com")) sharedLinks["Facebook"]++;
     // --- INDONESIAN E-COMMERCE SEPARATION ---
     // 1. TikTok Shop (Evaluated first to catch the integrated "tokopedia.com" backend links)
     else if (
       c.includes("seller-id.tokopedia.com") ||
       c.includes("affiliate-id.tokopedia.com") ||
       c.includes("shop.tokopedia.com") ||
       c.includes("://tiktokshop.com")
     ) {
       sharedLinks["TikTok Shop"]++;
     }

     // 2. TikTok (Standard Videos/Profiles)
     else if (c.includes("vt.tiktok.com") || c.includes("tiktok.com/")) {
       sharedLinks["TikTok"]++;
     }

     // 3. Shopee Indonesia
     else if (
       c.includes("shopee.co.id") ||
       c.includes("shp.ee") ||
       c.includes("seller.shopee.co.id") ||
       c.includes("affiliate.shopee.co.id")
     ) {
       sharedLinks["Shopee"]++;
     }

     // 4. Tokopedia Marketplace
     else if (
       c.includes("tokopedia.com") ||
       c.includes("tokopedia.link") ||
       c.includes("seller.tokopedia.com")
     ) {
       sharedLinks["Tokopedia"]++;
     }

     // ----------------------------------------
     else {
       sharedLinks["Other Links"]++;
     }
   }

  }

  // ── Response latency ──
  const responseTimes: Record<string, number[]> = {};
  for (let i = 0; i < realMessages.length - 1; i++) {
    const current = realMessages[i];
    const next = realMessages[i + 1];
    if (current.isCall || next.isCall) continue;

    if (next.sender !== current.sender) {
      const diffMinutes =
        (next.timestamp.getTime() - current.timestamp.getTime()) / 60000;
      if (diffMinutes > 0 && diffMinutes <= OVERNIGHT_GAP_MINUTES) {
        if (!responseTimes[next.sender]) responseTimes[next.sender] = [];
        responseTimes[next.sender].push(diffMinutes);
      }
    }
  }

  const avgResponseTimeMinutes: Record<string, number> = {};
  for (const [sender, times] of Object.entries(responseTimes)) {
    avgResponseTimeMinutes[sender] =
      times.reduce((a, b) => a + b, 0) / times.length;
  }

  // ── Double-text & Burst counts ──
  const doubleTextCounts: Record<string, number> = {};
  const burstCounts: Record<string, number> = {};

  if (realMessages.length > 0) {
    burstCounts[realMessages[0].sender] = 1;
  }

  for (let i = 1; i < realMessages.length; i++) {
    const current = realMessages[i];
    const prev = realMessages[i - 1];

    if (current.isCall || prev.isCall) continue;

    if (current.sender !== prev.sender) {
      burstCounts[current.sender] = (burstCounts[current.sender] ?? 0) + 1;
    } else {
      const diffSeconds = (current.timestamp.getTime() - prev.timestamp.getTime()) / 1000;
      if (diffSeconds >= 60) {
        burstCounts[current.sender] = (burstCounts[current.sender] ?? 0) + 1;
        doubleTextCounts[current.sender] = (doubleTextCounts[current.sender] ?? 0) + 1;
      }
    }
  }

  const avgMessagesPerBurst: Record<string, number> = {};
  for (const p of participants) {
    const totalMsg = messagesPerSender[p] ?? 0;
    const bursts = burstCounts[p] ?? 1;
    avgMessagesPerBurst[p] = parseFloat((totalMsg / bursts).toFixed(1));
  }

  // ── Ghosting instances ──
  const ghostingInstances: Record<string, number> = {};
  for (let i = 0; i < realMessages.length - 1; i++) {
    const current = realMessages[i];
    const next = realMessages[i + 1];

    if (current.isCall || next.isCall) continue;

    if (next.sender !== current.sender) {
      const diffMinutes =
        (next.timestamp.getTime() - current.timestamp.getTime()) / 60000;
      if (diffMinutes >= 720) {
        ghostingInstances[next.sender] =
          (ghostingInstances[next.sender] ?? 0) + 1;
      }
    }
  }

  // ── Top emojis per sender (top 10) ──
  const emojiFrequency: Record<string, Record<string, number>> = {};
  const emojiSpamOutliers: { sender: string; emoji: string; count: number }[] = [];

  for (const m of contentMessages) {
    const emojis = extractEmojisFromText(m.content);
    if (emojis.length === 0) continue;

    if (!emojiFrequency[m.sender]) emojiFrequency[m.sender] = {};

    // Count occurrences in this specific message
    const msgEmojiCount: Record<string, number> = {};
    for (const emoji of emojis) {
      msgEmojiCount[emoji] = (msgEmojiCount[emoji] ?? 0) + 1;
    }

    // Add to global frequency, capping at 15 per message
    for (const [emoji, count] of Object.entries(msgEmojiCount)) {
      if (count > 15) {
        emojiSpamOutliers.push({ sender: m.sender, emoji, count });
      }
      const cappedCount = Math.min(count, 15);
      emojiFrequency[m.sender][emoji] = (emojiFrequency[m.sender][emoji] ?? 0) + cappedCount;
    }
  }

  // Sort outliers by most extreme
  emojiSpamOutliers.sort((a, b) => b.count - a.count);

  const topEmojisPerSender: Record<string, EmojiCount[]> = {};
  const emojiLeaderboardPerSender: Record<string, EmojiCount[]> = {};
  for (const [sender, freq] of Object.entries(emojiFrequency)) {
    const sorted: EmojiCount[] = Object.entries(freq).map(([emoji, count]) => ({
      emoji,
      count,
    }));
    topEmojisPerSender[sender] = topN(sorted, 5);
    emojiLeaderboardPerSender[sender] = topN([...sorted], 10);
  }

  // ── Hourly heatmap ──
  const hourlyHeatmap = new Array(24).fill(0);
  for (const m of realMessages) {
    const hour = m.timestamp.getHours();
    hourlyHeatmap[hour]++;
  }

  // ── Monthly message counts ──
  const monthlyMap: Record<string, number> = {};
  for (const m of realMessages) {
    const d = m.timestamp;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap[key] = (monthlyMap[key] ?? 0) + 1;
  }
  const monthlyMessageCounts: MonthlyCount[] = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));
  const peakMonth = monthlyMessageCounts.reduce(
    (best, curr) => (curr.count > best.count ? curr : best),
    monthlyMessageCounts[0]
  );

  // ── Era Sampling & Keywords ──
  // Filter BEFORE slicing: exclude system messages (encryption notices, admin changes, etc.)
  // and media-only lines so era boundaries represent genuine conversation, not boilerplate.
  // This applies to both the AI payload excerpts and the local UI "chat phases" display.
  const genuineMessages = realMessages.filter(m => !m.isSystem && !m.isMedia && !m.isCall);
  const third = Math.floor(genuineMessages.length / 3);
  const earlyMessages = genuineMessages.slice(0, third);
  const medianMessages = genuineMessages.slice(third, third * 2);
  const lateMessages = genuineMessages.slice(third * 2);

  const eraMetrics = {
    early: computeEraMetrics(earlyMessages),
    median: computeEraMetrics(medianMessages),
    late: computeEraMetrics(lateMessages),
  };

  // ── Mirrored Phrases ──
  // Exclude system messages regardless of locale-table completeness (defensive backstop).
  // Also exclude short phrases (< 4 chars) to filter fillers like "yah", "ya", etc.
  const phraseSenders: Record<string, Set<string>> = {};
  for (const m of contentMessages) {
    if (m.isSystem) continue; // Skip system messages — prevents locale-unmapped strings leaking in
    const raw = m.content.trim().toLowerCase();
    if (raw.length >= 4 && !STOP_WORDS.has(raw)) {
      if (!phraseSenders[raw]) phraseSenders[raw] = new Set();
      phraseSenders[raw].add(m.sender);
    }
  }

  const mirroredPhrases: { phrase: string; count: number }[] = [];
  for (const [phrase, senders] of Object.entries(phraseSenders)) {
    if (senders.size >= 2) {
      const count = contentMessages.filter(m => m.content.trim().toLowerCase() === phrase).length;
      mirroredPhrases.push({ phrase, count });
    }
  }
  mirroredPhrases.sort((a, b) => b.count - a.count);

  const sampleExcerpts = {
    // earlyMessages/medianMessages/lateMessages are already filtered (no system/media/calls)
    early: selectContinuousExcerpts(earlyMessages, 15, 'start'),
    median: selectContinuousExcerpts(medianMessages, 15, 'middle'),
    late: selectContinuousExcerpts(lateMessages, 15, 'end'),
  };

  const topKeywords = computeTopKeywords(contentMessages);

  // ── Longest streak by day ──
  const longestStreakByDay = calculateLongestStreak(realMessages);

  return {
    totalMessages: realMessages.length,
    dateRange,
    participants,
    messagesPerSender,
    avgResponseTimeMinutes,
    avgMessagesPerBurst,
    doubleTextCounts,
    ghostingInstances,
    groupName,
    sharedLinks,
    mediaCounts,
    topEmojisPerSender,
    emojiLeaderboardPerSender,
    hourlyHeatmap,
    sampleExcerpts,
    eraMetrics,
    topKeywords,
    longestStreakByDay,
    chatDurationDays,
    avgMessagesPerDay,
    monthlyMessageCounts,
    peakMonth,
    mediaLeaderboard,
    mediaLeaderboardPerSender,
    emojiSpamOutliers,
    callsInitiated,
    callsMissed,
    totalCallDurationSeconds,
    totalVideoCallDurationSeconds,
    longestVoiceCallSeconds,
    longestVideoCallSeconds,
    viewOnceCount,
    editedMessageCount,
    deletedMessageCount,
    activeChatDays,
    stickerCount,
    mirroredPhrases,
  };
}

function computeEraMetrics(messages: ChatMessage[]): EraMetrics {
  if (messages.length === 0) return { avgResponseTimeMinutes: 0, avgMessageLength: 0, topEmoji: null };

  let totalDiff = 0;
  let responseCount = 0;
  for (let i = 0; i < messages.length - 1; i++) {
    const current = messages[i];
    const next = messages[i + 1];
    if (next.sender !== current.sender) {
      const diffMinutes = (next.timestamp.getTime() - current.timestamp.getTime()) / 60000;
      if (diffMinutes > 0 && diffMinutes <= OVERNIGHT_GAP_MINUTES) {
        totalDiff += diffMinutes;
        responseCount++;
      }
    }
  }
  const avgResponseTimeMinutes = responseCount > 0 ? totalDiff / responseCount : 0;

  const contentMsgs = messages.filter(m => !m.isSystem && !m.isMedia);
  const totalLength = contentMsgs.reduce((sum, m) => sum + m.content.length, 0);
  const avgMessageLength = contentMsgs.length > 0 ? Math.round(totalLength / contentMsgs.length) : 0;

  const emojiCount: Record<string, number> = {};
  for (const m of contentMsgs) {
    const emojis = extractEmojisFromText(m.content);
    for (const e of emojis) {
      emojiCount[e] = (emojiCount[e] ?? 0) + 1;
    }
  }
  const topEmoji = Object.entries(emojiCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return { avgResponseTimeMinutes, avgMessageLength, topEmoji };
}

function computeTopKeywords(messages: ChatMessage[]): { word: string; count: number }[] {
  const wordCount: Record<string, number> = {};
  const bigramCount: Record<string, number> = {};

  for (const m of messages) {
    const words = m.content.toLowerCase().match(/\b[a-z]{3,}\b/g) ?? [];

    // Count single words
    for (const w of words) {
      if (!STOP_WORDS.has(w)) {
        wordCount[w] = (wordCount[w] ?? 0) + 1;
      }
    }

    // Count bigrams
    for (let i = 0; i < words.length - 1; i++) {
      const w1 = words[i];
      const w2 = words[i + 1];
      if (!STOP_WORDS.has(w1) && !STOP_WORDS.has(w2)) {
        const bigram = `${w1} ${w2}`;
        bigramCount[bigram] = (bigramCount[bigram] ?? 0) + 1;
      }
    }
  }

  // Filter bigrams with frequency > 8
  const validBigrams = Object.entries(bigramCount)
    .filter(([_, count]) => count > 8);

  const combined = [
    ...Object.entries(wordCount),
    ...validBigrams
  ].sort((a, b) => b[1] - a[1]);

  return combined.slice(0, 150).map(([word, count]) => ({ word, count }));
}

function selectContinuousExcerpts(messages: ChatMessage[], count: number, position: 'start' | 'middle' | 'end'): string[] {
  const validMessages = messages.filter(m => m.content.trim().length > 3 && !m.isSystem);

  if (validMessages.length <= count) {
    return validMessages.map((m) => `${m.sender}: ${m.content.slice(0, 120)}`);
  }

  let startIndex = 0;
  if (position === 'middle') {
    startIndex = Math.floor(validMessages.length / 2) - Math.floor(count / 2);
  } else if (position === 'end') {
    startIndex = validMessages.length - count;
  }

  return validMessages
    .slice(startIndex, startIndex + count)
    .map((m) => `${m.sender}: ${m.content.slice(0, 120)}`);
}

function calculateLongestStreak(messages: ChatMessage[]): number {
  if (messages.length === 0) return 0;

  const uniqueDays = new Set(
    messages.map((m) => {
      const d = m.timestamp;
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );

  const sortedDays = Array.from(uniqueDays)
    .map((d) => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  let longest = 1;
  let current = 1;

  for (let i = 1; i < sortedDays.length; i++) {
    const diff =
      (sortedDays[i].getTime() - sortedDays[i - 1].getTime()) / 86400000;
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

export function formatDuration(minutes: number): string {
  if (minutes < 1) return 'under a minute';
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours < 24) return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}
