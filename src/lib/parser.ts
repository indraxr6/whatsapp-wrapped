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
  /^(?:\[(\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}),?\s(\d{1,2}[:.\uFF0E]\d{2}(?:[:.\uFF0E]\d{2})?(?:\s?[AP]M)?)\]|(\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}),?\s(\d{1,2}[:.\uFF0E]\d{2}(?:[:.\uFF0E]\d{2})?(?:\s?[AP]M)?)\s[-–])\s([\s\S]*)$/i;

function parseTimestamp(dateStr: string, timeStr: string, format: 'DD/MM' | 'MM/DD'): Date | null {
  // Normalize separators
  const normalizedDate = dateStr.replace(/[.\-]/g, '/');
  const parts = normalizedDate.split('/');

  let day: number, month: number, year: number;

  if (parts.length === 3) {
    const a = parseInt(parts[0], 10);
    const b = parseInt(parts[1], 10);
    const c = parseInt(parts[2], 10);

    if (c > 31) {
      // YYYY is the third part
      year = c;
      if (format === 'DD/MM') { day = a; month = b; }
      else { month = a; day = b; }
    } else if (a > 31) {
      // YYYY is the first part (rare in WhatsApp, but safe to handle)
      year = a; month = b; day = c;
    } else {
      // 2-digit year at the end
      year = c < 100 ? 2000 + c : c;
      if (format === 'DD/MM') { day = a; month = b; }
      else { month = a; day = b; }
    }
  } else {
    return null;
  }

  // Defensive validation
  if (month < 1 || month > 12) return null;
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return null;

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

  // Split on either `:` or `.` - WhatsApp uses both depending on locale/OS
  const timeParts = normalizedTime.split(/[:.]/);
  let hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);
  const seconds = timeParts[2] ? parseInt(timeParts[2]) : 0;

  if (isPM && hours !== 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return new Date(year, month - 1, day, hours, minutes, seconds);
}

function detectDateFormat(lines: string[]): 'DD/MM' | 'MM/DD' {
  for (const line of lines) {
    // Strip invisible bidirectional formatting chars first, same as parsing loop
    const cleanLine = line.replace(/[\u200E\u200F\u202A-\u202E\u2068\u2069]|<0x200e>|<0x200f>/gi, '');
    if (!cleanLine.trim()) continue;

    const match = MESSAGE_REGEX.exec(cleanLine);
    if (!match) continue;

    const dateStr = match[1] || match[3];
    const parts = dateStr.replace(/[.\-]/g, '/').split('/');
    if (parts.length === 3) {
      const a = parseInt(parts[0], 10);
      const b = parseInt(parts[1], 10);
      // We only care about A and B since C is usually year
      if (a > 12 && a <= 31) {
        return 'DD/MM';
      } else if (b > 12 && b <= 31) {
        return 'MM/DD';
      }
    }
  }
  return 'DD/MM'; // Fallback
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
  const dateFormat = detectDateFormat(lines);

  for (let i = 0; i < lines.length; i++) {
    // Strip invisible bidirectional formatting chars (like LRM \u200e) and their literal 
    // string representations which macOS WhatsApp sometimes inserts.
    const line = lines[i].replace(/[\u200E\u200F\u202A-\u202E\u2068\u2069]|<0x200e>|<0x200f>/gi, '');
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
      const rawRest = match[5].trim();

      let sender = 'System';
      let content = rawRest;
      let isSystem = false;

      const colonIndex = rawRest.indexOf(':');
      if (colonIndex !== -1) {
        const pSender = rawRest.substring(0, colonIndex).trim();
        const pContent = rawRest.substring(colonIndex + 1).trim();

        if (isSystemLine(pContent)) {
          sender = pSender;
          content = pContent;
          isSystem = true;
        } else if (isSystemLine(rawRest)) {
          sender = 'System';
          content = rawRest;
          isSystem = true;
        } else {
          sender = pSender;
          content = pContent;
        }
      } else {
        isSystem = isSystemLine(rawRest) || true; // If no colon, we safely assume it's a system message.
      }

      if (detectedFormat === 'unknown') {
        detectedFormat = isIOS ? 'ios' : 'android';
      }

      const timestamp = parseTimestamp(dateStr, timeStr, dateFormat);
      if (!timestamp) {
        // Invalid date - treat as unparsed line
        unparsedLineCount++;
        if (currentMessage) {
          currentMessage.content += '\n' + line;
        }
        continue;
      }

      const mediaType = getMediaType(content);
      const isMedia = mediaType !== null;
      
      // Check if it's a call
      const callInfo = getCallInfo(content);
      const isCall = callInfo !== null;
      if (isCall) isSystem = true;

      // Check if message was edited (appended text)
      const editedRegex = /<this message was edited>|<pesan ini diedit>|<pesan ini telah diedit>|<telah diedit>|this message was edited|telah diedit/i;
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
      // Multi-line continuation - append to the last message's content
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
