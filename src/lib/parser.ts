import type { ChatMessage } from '../types/chat';
import { getMediaType, isSystemLine, getCallInfo } from './localeTable';

/**
 * Unified WhatsApp export regex.
 * Handles:
 *  - iOS:     [DD/MM/YYYY, HH:MM:SS] or [DD/MM/YYYY, HH.MM.SS] Sender: Message
 *  - Android: DD/MM/YYYY, HH:MM - Sender: Message
 *  - 12h/24h clocks, 2/4-digit years, / . - date separators
 *  - Time separators can be `:` (most locales) or `.` (e.g. Indonesian exports)
 */
const MESSAGE_REGEX =
  /^(?:\[(\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}),?\s(\d{1,2}[:.\uFF0E]\d{2}(?:[:.\uFF0E]\d{2})?(?:\s?[AP]M)?)\]|(\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}),?\s(\d{1,2}[:.\uFF0E]\d{2}(?:[:.\uFF0E]\d{2})?(?:\s?[AP]M)?)\s[-–])\s([^:]+):\s([\s\S]*)$/i;

function parseTimestamp(dateStr: string, timeStr: string): Date {
  // Normalize separators
  const normalizedDate = dateStr.replace(/[.\-]/g, '/');
  const parts = normalizedDate.split('/');

  // Try to detect DD/MM/YYYY vs MM/DD/YYYY heuristically
  // WhatsApp predominantly uses DD/MM/YYYY globally
  let day: number, month: number, year: number;

  if (parts.length === 3) {
    const a = parseInt(parts[0]);
    const b = parseInt(parts[1]);
    const c = parseInt(parts[2]);

    if (c > 31) {
      // YYYY is the third part — likely D/M/YYYY
      day = a;
      month = b;
      year = c;
    } else if (a > 12) {
      // First part > 12, must be day
      day = a;
      month = b;
      year = c < 100 ? 2000 + c : c;
    } else {
      // Default to DD/MM/YYYY (most common globally)
      day = a;
      month = b;
      year = c < 100 ? 2000 + c : c;
    }
  } else {
    return new Date(NaN);
  }

  // Normalize time string (remove AM/PM for 24h conversion)
  let normalizedTime = timeStr.trim();
  let isPM = false;
  let isAM = false;

  if (/pm$/i.test(normalizedTime)) {
    isPM = true;
    normalizedTime = normalizedTime.replace(/\s?[AP]M$/i, '').trim();
  } else if (/am$/i.test(normalizedTime)) {
    isAM = true;
    normalizedTime = normalizedTime.replace(/\s?[AP]M$/i, '').trim();
  }

  // Split on either `:` or `.` — WhatsApp uses both depending on locale/OS
  const timeParts = normalizedTime.split(/[:.]/);
  let hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);
  const seconds = timeParts[2] ? parseInt(timeParts[2]) : 0;

  if (isPM && hours !== 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return new Date(year, month - 1, day, hours, minutes, seconds);
}

export interface ParseResult {
  messages: ChatMessage[];
  unparsedLineCount: number;
  detectedFormat: 'ios' | 'android' | 'unknown';
}

export function parseWhatsAppExport(rawText: string): ParseResult {
  const lines = rawText.split('\n');
  const messages: ChatMessage[] = [];
  let unparsedLineCount = 0;
  let detectedFormat: 'ios' | 'android' | 'unknown' = 'unknown';

  let currentMessage: ChatMessage | null = null;

  for (let i = 0; i < lines.length; i++) {
    // Strip invisible bidirectional formatting chars (like LRM \u200e) and their literal 
    // string representations which macOS WhatsApp sometimes inserts.
    const line = lines[i].replace(/[\u200E\u200F\u202A-\u202E]|<0x200e>|<0x200f>/gi, '');
    if (!line.trim()) continue;

    const match = MESSAGE_REGEX.exec(line);

    if (match) {
      // Save previous message before starting a new one
      if (currentMessage) {
        messages.push(currentMessage);
      }

      // Detect format from which capture group matched
      const isIOS = Boolean(match[1]);
      const dateStr = match[1] || match[3];
      const timeStr = match[2] || match[4];
      const sender = match[5].trim();
      const content = match[6];

      if (detectedFormat === 'unknown') {
        detectedFormat = isIOS ? 'ios' : 'android';
      }

      const timestamp = parseTimestamp(dateStr, timeStr);
      const mediaType = getMediaType(content);
      const isMedia = mediaType !== null;
      
      // Check if it's a call
      const callInfo = getCallInfo(content);
      const isCall = callInfo !== null;
      const isSystem = isSystemLine(content);

      // Check if message was edited (appended text)
      const editedRegex = /<this message was edited>|<pesan ini telah diedit>|<telah diedit>|this message was edited|telah diedit/i;
      const isEdited = editedRegex.test(content);
      const cleanContent = content.replace(editedRegex, '').trim();

      currentMessage = {
        timestamp,
        sender,
        content: cleanContent,
        isMedia,
        mediaType: mediaType || undefined,
        isSystem,
        isEdited,
        ...(isCall ? {
          isCall: true,
          callType: callInfo.callType,
          callDurationSeconds: callInfo.durationSeconds,
          callOutcome: callInfo.outcome,
          callJoinedCount: callInfo.joinedCount
        } : {})
      };
    } else if (currentMessage) {
      // Multi-line continuation — append to the last message's content
      currentMessage.content += '\n' + line;
    } else {
      // Could not parse line and no current message context
      unparsedLineCount++;
    }
  }

  // Push the final message
  if (currentMessage) {
    messages.push(currentMessage);
  }

  return { messages, unparsedLineCount, detectedFormat };
}
