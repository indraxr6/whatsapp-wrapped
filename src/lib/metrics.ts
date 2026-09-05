import type { ChatMessage, EmojiCount, MediaType, MonthlyCount, ParsedChatMetrics, EraMetrics } from '../types/chat';

import { detectTopics } from './topics';
import { ALL_STOPWORDS } from './stopwords';

const OVERNIGHT_GAP_MINUTES = 360; // 6 hours - gaps larger than this are excluded from avg latency

const ABUSIVE_TERMS_ID = new Set([
  'kontol', 'memek', 'mmk', 'tai', 'bangsat', 'bajingan', 'jingan', 'keparat', 'anjing', 'anjeng',
  'goblok', 'gblg', 'gblk', 'goblog', 'bego', 'bodo', 'tempek', 'tempik', 'asu', 'jancuk',
  'pantek', 'peler', 'pler', 'anjg', 'njing', 'persetan'
]);

const ABUSIVE_TERMS_JV = new Set([
  'cok', 'cuk', 'jancok', 'jancuk', 'hancok', 'dancok', 'jembot', 'jembut', 'jmbt', 'taek',
  'ajg', 'asu', 'ngentod', 'ngentot', 'perek', 'lonte'
]);

const ABUSIVE_TERMS_EN = new Set([
  'fak', 'fuck', 'fucker', 'fucking', 'motherfucker', 'shit', 'shithead', 'bullshit', 'horseshit',
  'hell', 'crap', 'ass', 'asshole', 'arsehole', 'bastard', 'bitch', 'dick',
  'dickhead', 'dumbass', 'jackass', 'dipshit', 'piss', 'prick', 'pussy', 'cunt', 'twat',
  'wanker', 'jerkoff', 'slut', 'whore', 'sonofabitch', 'nigga', 'nigger', 'niqqa', 'niggah',
  'fag', 'faggot', 'dyke', 'tranny', 'retard', 'retarded'
]);

const ALL_ABUSIVE_TERMS = new Set([
  ...ABUSIVE_TERMS_ID,
  ...ABUSIVE_TERMS_JV,
  ...ABUSIVE_TERMS_EN
]);

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

  // ── 1. Group Name Detection & History ──
  let latestRenameMatch: string | null = null;
  let creationMatch: string | null = null;
  let groupNameHistory: import('../types/chat').GroupRenameEvent[] = [];
  let iconChangeCount = 0;

  const renameRegex = /^(?:(.+?)\s+)?(?:changed the group name(?: from\s+[\u201c\u201d"]?.*?[\u201c\u201d"]?)?\s*to|changed this group's name to|changed the subject(?: from\s+[\u201c\u201d"]?.*?[\u201c\u201d"]?)?\s*to|mengubah nama grup(?: dari\s+[\u201c\u201d"]?.*?[\u201c\u201d"]?)?\s*menjadi|mengubah subjek(?: dari\s+[\u201c\u201d"]?.*?[\u201c\u201d"]?)?\s*menjadi|mengubah subjek grup menjadi)\s*[\u201c\u201d"]?([^\u201c\u201d"]+)[\u201c\u201d"]?\s*$/i;
  const creationRegex = /^(?:(.+?)\s+)?(?:created group|membuat grup|telah membuat grup)\s+[\u201c\u201d"]?(.+?)[\u201c\u201d"]?\s*$/i;
  const iconChangeRegex = /^(?:(.+?)\s+)?(?:changed this group's icon|mengubah ikon grup ini)\s*$/i;
  const NAME_STOP_WORDS = new Set(['ini', 'itu', 'this', 'the', 'here', 'tersebut']);

  for (const m of messages) {
    if (m.isSystem) {
      if (iconChangeRegex.test(m.content)) {
        iconChangeCount++;
      }

      const rename = m.content.match(renameRegex);
      if (rename && rename[2]) {
        latestRenameMatch = rename[2].trim();
        let rawActor = rename[1] ? rename[1].trim() : (m.sender !== 'System' ? m.sender : 'Unknown');
        if (rawActor.toLowerCase() === 'you' || rawActor.toLowerCase() === 'anda') {
          rawActor = 'You';
        }
        const newName = latestRenameMatch;
        const oldName = groupNameHistory.length > 0 ? groupNameHistory[groupNameHistory.length - 1].newName : null;

        groupNameHistory.push({
          date: m.timestamp,
          actor: rawActor,
          oldName,
          newName
        });
      }

      if (!creationMatch) {
        const creation = m.content.match(creationRegex);
        if (creation && creation[2] && creation[2].trim().length > 3 && !NAME_STOP_WORDS.has(creation[2].trim().toLowerCase())) {
          creationMatch = creation[2].trim();
          if (groupNameHistory.length > 0 && groupNameHistory[0].oldName === null) {
            groupNameHistory[0].oldName = creationMatch;
          }
        }
      }
    }
  }

  let groupName: string | null = null;
  if (latestRenameMatch) {
    groupName = latestRenameMatch;
  } else if (creationMatch) {
    groupName = creationMatch.replace(/^["“”]|["“”]$/g, '').trim();
  }

  // Fallback 1: Find the iOS encryption notice sender (iOS attributes system messages to the group name)
  if (!groupName) {
    const encryptionMsg = realMessages.find(m =>
      m.isSystem &&
      m.sender !== 'System' &&
      (m.content.toLowerCase().includes('end-to-end') || m.content.toLowerCase().includes('dienkripsi'))
    );

    // Safety check: ensure it's not a DM by verifying this sender has very few "real" messages.
    // In a DM, Alice sends the encryption message but also thousands of real messages.
    // In a Group, the Group Name sends the encryption message and < 50 real messages (unrecognized system messages).
    if (encryptionMsg && !NAME_STOP_WORDS.has(encryptionMsg.sender.toLowerCase())) {
      let realMessageCount = 0;
      for (const m of realMessages) {
        if (!m.isSystem && m.sender === encryptionMsg.sender) {
          realMessageCount++;
        }
      }

      if (realMessageCount < 50) {
        groupName = encryptionMsg.sender;
      }
    }
  }

  // Fallback 2: Removed because it incorrectly identifies users who delete messages as the group name.
  if (!groupName && fileName) {
    const fnMatch = fileName.match(/WhatsApp Chat (?:with|-)?\s*(.+)\.txt/i);
    if (fnMatch && fnMatch[1] && fnMatch[1].trim() !== '') {
      groupName = fnMatch[1].trim();
    }
  }

  // ── 3. Calculate Participants ──
  const senderNonSystemCounts: Record<string, number> = {};
  for (const m of realMessages) {
    if (!m.isSystem || m.isCall) {
      senderNonSystemCounts[m.sender] = (senderNonSystemCounts[m.sender] ?? 0) + 1;
    }
  }

  const participants = Object.keys(senderNonSystemCounts).filter(p => senderNonSystemCounts[p] > 0);

  if (!groupName && participants.length > 2) {
    groupName = 'Group Chat';
  } else if (!groupName) {
    groupName = null;
  }

  const dateRange = {
    start: realMessages[0].timestamp,
    end: realMessages[realMessages.length - 1].timestamp,
  };

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
  const pingCount: Record<string, number> = {};
  const paragraphsPerSender: Record<string, number> = {};
  const slurCount: Record<string, number> = {};
  const slurWordCounts: Record<string, number> = {};
  const editedMessageCount: Record<string, number> = {};
  const deletedMessageCount: Record<string, number> = {};
  for (const m of realMessages) {
    if (!m.isCall && !m.isSystem) {
      messagesPerSender[m.sender] = (messagesPerSender[m.sender] ?? 0) + 1;

      // Slur / Abusive words check
      const words = m.content.toLowerCase().split(/\s+/);
      for (const word of words) {
        const cleanWord = word.replace(/[^\w]/g, '');
        if (ALL_ABUSIVE_TERMS.has(cleanWord)) {
          slurCount[m.sender] = (slurCount[m.sender] ?? 0) + 1;
          slurWordCounts[cleanWord] = (slurWordCounts[cleanWord] ?? 0) + 1;
        }
      }

      // Ping Check: Match exactly "p" or "ppp", case insensitive
      if (/^p+$/i.test(m.content.trim())) {
        pingCount[m.sender] = (pingCount[m.sender] ?? 0) + 1;
      }

      // Monologue / Paragraph Check
      if (m.content.length > 300 || m.content.split('\n').length >= 4) {
        paragraphsPerSender[m.sender] = (paragraphsPerSender[m.sender] ?? 0) + 1;
      }
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
  let lastCallTimestamp: Date | undefined;

  for (const m of realMessages) {
    if (m.isCall) {
      callsInitiated[m.sender] = (callsInitiated[m.sender] ?? 0) + 1;
      lastCallTimestamp = m.timestamp;

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
  const MEDIA_TYPES: MediaType[] = ['image', 'video', 'audio', 'sticker', 'gif', 'document', 'contactCard', 'location', 'link', 'unknown'];
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
    'Zoom': 0,
    'Microsoft Teams': 0,
    'GitHub': 0,
    'Facebook': 0,
    'Tokopedia': 0,
    'Shopee': 0,
    'TikTok Shop': 0,
    'Lazada': 0,
    'Amazon': 0,
    'Bukalapak': 0,
    'Blibli': 0,
    'LinkedIn': 0,
    'Letterboxd': 0,
    'Other Links': 0,
  };

  const spotifyLinks: string[] = [];
  let movieLinksCount = 0;
  let workLinksCount = 0;

  for (const m of realMessages) {
    const c = m.content.toLowerCase();

    // Quick filter to avoid running string checks on every single message
    if (!c.includes('http') && !c.includes('www.') && !c.includes('.com') && !c.includes('.id') && !c.includes('.ee') && !c.includes('.gl') && !c.includes('.in') && !c.includes('.be')) {
      continue;
    }



    if (c.includes("open.spotify.com") || c.includes("spotify.link")) {
      sharedLinks["Spotify"]++;
      const match = m.content.match(/https?:\/\/(?:open\.spotify\.com|spotify\.link)[^\s]+/i);
      if (match) {
        const url = match[0];
        const isTrackOrAlbum = url.includes('/track/') || url.includes('/album/') || url.includes('/playlist/');
        const isShortLink = url.includes('spotify.link');

        if (!spotifyLinks.includes(url) && (isTrackOrAlbum || isShortLink)) {
          spotifyLinks.push(url);
        }
      }
    }
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
    ) {
      sharedLinks["Google Maps"]++;
    }
    else if (c.includes("docs.google.com/forms")) sharedLinks["Google Forms"]++;
    else if (c.includes("docs.google.com/spreadsheets")) sharedLinks["Google Sheets"]++;
    else if (c.includes("docs.google.com/document")) sharedLinks["Google Docs"]++;
    else if (c.includes("docs.google.com/presentation")) sharedLinks["Google Slides"]++;
    else if (c.includes("drive.google.com")) sharedLinks["Google Drive"]++;
    else if (c.includes("meet.google.com")) sharedLinks["Google Meet"]++;
    else if (c.includes("zoom.us")) sharedLinks["Zoom"]++;
    else if (c.includes("teams.microsoft.com") || c.includes("teams.live.com")) sharedLinks["Microsoft Teams"]++;
    else if (c.includes("github.com")) sharedLinks["GitHub"]++;
    else if (c.includes("linkedin.com") || c.includes("lnkd.in")) sharedLinks["LinkedIn"]++;
    else if (c.includes("facebook.com")) sharedLinks["Facebook"]++;
    else if (c.includes("letterboxd.com") || c.includes("boxd.it")) sharedLinks["Letterboxd"]++;

    // --- TIKTOK ---
    else if (
      c.includes("://tiktokshop.com") ||
      c.includes("shop.tiktok.com") ||
      c.includes("tiktok.com/t/")
    ) {
      sharedLinks["TikTok Shop"]++;
    }
    else if (c.includes("vt.tiktok.com") || c.includes("tiktok.com/")) {
      sharedLinks["TikTok"]++;
    }
    // --- E-COMMERCE SEPARATION ---
    else if (
      c.includes("tokopedia.com") ||
      c.includes("tokopedia.link") ||
      c.includes("seller.tokopedia.com") ||
      c.includes("seller-id.tokopedia.com") ||
      c.includes("affiliate-id.tokopedia.com") ||
      c.includes("shop.tokopedia.com")
    ) {
      sharedLinks["Tokopedia"]++;
    } else if (
      c.includes("shopee.co.id") ||
      c.includes("shp.ee") ||
      c.includes("seller.shopee.co.id") ||
      c.includes("affiliate.shopee.co.id")
    ) {
      sharedLinks["Shopee"]++;
    } else if (c.includes("lazada.co.id")) {
      sharedLinks["Lazada"]++;
    } else if (c.includes("amazon.com")) {
      sharedLinks["Amazon"]++;
    } else if (c.includes("bukalapak.com")) {
      sharedLinks["Bukalapak"]++;
    } else if (c.includes("blibli.com")) {
      sharedLinks["Blibli"]++;
    }
    else if (c.includes('http://') || c.includes('https://')) {
      // Only count as "Other Links" if it's explicitly a url scheme 
      // (to avoid false positives on sentences that just happen to end in a dot then word)
      sharedLinks["Other Links"]++;
    }

    // --- BACKGROUND METRICS (Independent of sharedLinks) ---
    if (
      c.includes("netflix.com") ||
      c.includes("mubi.com") || c.includes("mobi.com") ||
      c.includes("disneyplus.com") || c.includes("hotstar.com") ||
      c.includes("primevideo.com") || c.includes("amazon.com/primevideo") ||
      c.includes("tv.apple.com")
    ) {
      movieLinksCount++;
    }

    if (
      c.includes("docs.google.com") ||
      c.includes("drive.google.com") ||
      c.includes("meet.google.com") ||
      c.includes("zoom.us") ||
      c.includes("zoom.com") ||
      c.includes("teams.microsoft.com") || c.includes("teams.live.com") ||
      c.includes("figma.com") ||
      c.includes("trello.com") ||
      c.includes("github.com") ||
      c.includes("gitlab.com") ||
      c.includes("notion.so") ||
      c.includes("slack.com")
    ) {
      workLinksCount++;
    }
  }

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

    // Removed from here: sharedLinks logic extracted to a separate loop

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
      if (diffMinutes >= 4320) {
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
    if (m.isSystem) continue; // Skip system messages - prevents locale-unmapped strings leaking in
    const raw = m.content.trim().toLowerCase();
    if (raw.length >= 4 && !ALL_STOPWORDS.has(raw)) {
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

  const earlyExcerptData = selectContinuousExcerpts(earlyMessages, 60, 'start');
  const medianExcerptData = selectContinuousExcerpts(medianMessages, 60, 'middle');
  const lateExcerptData = selectContinuousExcerpts(lateMessages, 15, 'end');

  const sampleExcerpts = {
    early: earlyExcerptData.excerpts,
    median: medianExcerptData.excerpts,
    late: lateExcerptData.excerpts,
  };

  const eraDateRanges = {
    early: earlyExcerptData.dateRange,
    median: medianExcerptData.dateRange,
    late: lateExcerptData.dateRange,
  };

  const topKeywords = computeTopKeywords(contentMessages);
  const detectedTopics = detectTopics({ topKeywords, hourlyHeatmap, sharedLinks, ghostingInstances }, contentMessages);

  // ── Longest streak by day ──
  const longestStreakByDay = calculateLongestStreak(realMessages);

  const topSlurs = Object.entries(slurWordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

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
    recentSpotifyLinks: spotifyLinks.slice(-10),
    mirroredPhrases,
    activeChatDays,
    movieLinksCount,
    workLinksCount,
    pingCount,
    paragraphsPerSender,
    slurCount,
    topSlurs,
    mediaCounts,
    topEmojisPerSender,
    emojiLeaderboardPerSender,
    hourlyHeatmap,
    sampleExcerpts,
    eraDateRanges,
    eraMetrics,
    topKeywords,
    detectedTopics,
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
    lastCallTimestamp,
    viewOnceCount,
    editedMessageCount,
    deletedMessageCount,
    stickerCount,
    groupNameHistory,
    iconChangeCount,
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
      if (!ALL_STOPWORDS.has(w)) {
        wordCount[w] = (wordCount[w] ?? 0) + 1;
      }
    }

    // Count bigrams
    for (let i = 0; i < words.length - 1; i++) {
      const w1 = words[i];
      const w2 = words[i + 1];
      if (!ALL_STOPWORDS.has(w1) && !ALL_STOPWORDS.has(w2)) {
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

function selectContinuousExcerpts(messages: ChatMessage[], count: number, position: 'start' | 'middle' | 'end'): { excerpts: string[]; dateRange: { start: Date; end: Date } | null } {
  const validMessages = messages.filter(m => m.content.trim().length > 3 && !m.isSystem);

  if (validMessages.length === 0) {
    return { excerpts: [], dateRange: null };
  }

  if (validMessages.length <= count) {
    return {
      excerpts: validMessages.map((m) => `${m.sender}: ${m.content.slice(0, 120)}`),
      dateRange: {
        start: validMessages[0].timestamp,
        end: validMessages[validMessages.length - 1].timestamp
      }
    };
  }

  let startIndex = 0;
  if (position === 'middle') {
    startIndex = Math.floor(validMessages.length / 2) - Math.floor(count / 2);
  } else if (position === 'end') {
    startIndex = validMessages.length - count;
  }

  const selectedMessages = validMessages.slice(startIndex, startIndex + count);

  return {
    excerpts: selectedMessages.map((m) => `${m.sender}: ${m.content.slice(0, 120)}`),
    dateRange: {
      start: selectedMessages[0].timestamp,
      end: selectedMessages[selectedMessages.length - 1].timestamp
    }
  };
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
