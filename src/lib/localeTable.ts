/**
 * Locale-keyed lookup table for WhatsApp system messages and media placeholders.
 * Each entry lists known strings for that locale.
 * Extend this table as new locales are tested and confirmed.
 *
 * Supported locales: en, id, de, fr, es, pt
 */

import type { MediaType } from '../types/chat';

export type LocaleCode = string;

interface LocaleEntry {
  systemMessages: string[];      // substrings that flag a line as a system message
  mediaPlaceholders: Array<{ pattern: string; type: MediaType }>; // pattern + detected type
}

export const LOCALE_TABLE: Record<LocaleCode, LocaleEntry> = {
  en: {
    systemMessages: [
      'messages and calls are end-to-end encrypted',
      'end-to-end encrypted',
      'changed their phone number',
      'added you',
      'removed you',
      'created group',
      'changed the group name',
      "changed this group's icon",
      'left',
      "joined using this group's invite link",
      'you were added',
      'this message was deleted',
      'you deleted this message',
      'missed voice call',
      'missed video call',
      'null'
    ],
    mediaPlaceholders: [
      { pattern: '<media omitted>', type: 'image' },
      { pattern: 'image omitted', type: 'image' },
      { pattern: 'photo omitted', type: 'image' },
      { pattern: 'video omitted', type: 'video' },
      { pattern: 'audio omitted', type: 'audio' },
      { pattern: 'voice message omitted', type: 'audio' },
      { pattern: 'ptt omitted', type: 'audio' },
      { pattern: 'document omitted', type: 'document' },
      { pattern: 'gif omitted', type: 'gif' },
      { pattern: 'sticker omitted', type: 'sticker' },
      { pattern: '<attached:', type: 'document' },
      { pattern: 'contact card omitted', type: 'contactCard' },
      { pattern: 'location: https://', type: 'link' },
      { pattern: 'live location shared', type: 'link' },
      // Catch-all for missing prefixes in some exports
      { pattern: 'omitted', type: 'image' },
      { pattern: 'view once', type: 'image' },
    ],
  },
  id: {
    systemMessages: [
      'pesan dan panggilan dienkripsi',
      'mengubah nomor telepon',
      'menambahkan anda',
      'menghapus anda',
      'membuat grup',
      'mengubah nama grup',
      'keluar',
      'pesan ini telah dihapus',
      'anda menghapus pesan ini',
      'panggilan suara tak terjawab',
      'panggilan video tak terjawab'
    ],
    mediaPlaceholders: [
      { pattern: '<media dihilangkan>', type: 'image' },
      { pattern: '<media omitted>', type: 'image' },
      { pattern: 'gambar dihilangkan', type: 'image' },
      { pattern: 'video dihilangkan', type: 'video' },
      { pattern: 'audio dihilangkan', type: 'audio' },
      { pattern: 'dokumen dihilangkan', type: 'document' },
      { pattern: 'stiker dihilangkan', type: 'sticker' },
      { pattern: '<terlampir:', type: 'document' },
      { pattern: 'dihilangkan', type: 'image' },
      { pattern: 'view once', type: 'image' },
    ],
  },
  de: {
    systemMessages: [
      'nachrichten und anrufe sind end-to-end-verschlüsselt',
      'hat seine telefonnummer geändert',
      'hast du hinzugefügt',
      'wurde entfernt',
      'gruppe erstellt',
      'hat den gruppenbetreff geändert',
      'hat die gruppe verlassen',
      'diese nachricht wurde gelöscht',
      'du hast diese nachricht gelöscht',
    ],
    mediaPlaceholders: [
      { pattern: '<medien weggelassen>', type: 'image' },
      { pattern: '<media omitted>', type: 'image' },
      { pattern: 'bild weggelassen', type: 'image' },
      { pattern: 'video weggelassen', type: 'video' },
      { pattern: '<angehängt:', type: 'document' },
    ],
  },
  fr: {
    systemMessages: [
      'les messages et appels sont chiffrés de bout en bout',
      'a changé son numéro de téléphone',
      'vous a ajouté',
      'a été supprimé',
      'a créé le groupe',
      'a modifié le nom du groupe',
      'a quitté le groupe',
      'ce message a été supprimé',
      'vous avez supprimé ce message',
    ],
    mediaPlaceholders: [
      { pattern: '<média omis>', type: 'image' },
      { pattern: '<media omitted>', type: 'image' },
      { pattern: 'image omise', type: 'image' },
      { pattern: 'vidéo omise', type: 'video' },
      { pattern: '<joint :', type: 'document' },
    ],
  },
  es: {
    systemMessages: [
      'los mensajes y llamadas están cifrados de extremo a extremo',
      'cambió su número de teléfono',
      'te añadió',
      'fue eliminado',
      'creó el grupo',
      'cambió el nombre del grupo',
      'salió del grupo',
      'se eliminó este mensaje',
      'eliminaste este mensaje',
    ],
    mediaPlaceholders: [
      { pattern: '<multimedia omitido>', type: 'image' },
      { pattern: '<media omitted>', type: 'image' },
      { pattern: 'imagen omitida', type: 'image' },
      { pattern: 'video omitido', type: 'video' },
      { pattern: '<adjunto:', type: 'document' },
    ],
  },
  pt: {
    systemMessages: [
      'as mensagens e ligações são criptografadas de ponta a ponta',
      'mudou o número de telefone',
      'adicionou você',
      'foi removido',
      'criou o grupo',
      'alterou o nome do grupo',
      'saiu do grupo',
      'esta mensagem foi apagada',
      'você apagou esta mensagem',
    ],
    mediaPlaceholders: [
      { pattern: '<mídia omitida>', type: 'image' },
      { pattern: '<media omitted>', type: 'image' },
      { pattern: 'imagem omitida', type: 'image' },
      { pattern: 'vídeo omitido', type: 'video' },
      { pattern: '<arquivo:', type: 'document' },
    ],
  },
};

/** Flattened list of all media placeholder entries across all locales */
const ALL_MEDIA_ENTRIES = Object.values(LOCALE_TABLE).flatMap(
  (entry) => entry.mediaPlaceholders
);

/** All known system message substrings across all locales (lowercased) */
export const ALL_SYSTEM_MESSAGES: string[] = Array.from(
  new Set(
    Object.values(LOCALE_TABLE).flatMap((entry) =>
      entry.systemMessages.map((s) => s.toLowerCase())
    )
  )
);

/** URL regex for detecting links in message text */
const URL_REGEX = /https?:\/\/\S+|www\.\S+/i;

/**
 * Returns the MediaType if the content is a media placeholder, or null otherwise.
 * Checks URL pattern separately (links are not in the locale placeholder table).
 */
export function getMediaType(content: string): import('../types/chat').MediaType | null {
  const lower = content.toLowerCase().trim();

  // "view once" is treated as an image
  if (lower.includes('view once')) return 'image';

  for (const entry of ALL_MEDIA_ENTRIES) {
    if (lower.includes(entry.pattern.toLowerCase())) {
      return entry.type;
    }
  }

  // URL detection (links are not in locale table — separate regex)
  // We ONLY treat it as "media" if the entire message is JUST a link or starts with one.
  // Actually, let's just return 'link' if it's a standalone link, otherwise null,
  // so we don't drop content messages that happen to contain a link.
  if (URL_REGEX.test(lower) && lower.split(/\s+/).length <= 3) {
    return 'link';
  }

  return null;
}

export function isMediaLine(content: string): boolean {
  return getMediaType(content) !== null;
}

export function isSystemLine(content: string): boolean {
  const lower = content.toLowerCase().trim();
  return ALL_SYSTEM_MESSAGES.some((msg) => lower.includes(msg));
}

export interface CallInfo {
  callType: 'voice' | 'video';
  durationSeconds?: number;
  outcome: 'missed' | 'answered' | 'no-answer';
  joinedCount?: number;
}

export function getCallInfo(content: string): CallInfo | null {
  const lower = content.toLowerCase().replace(/[\u200E\u200F]/g, '').trim();

  // 1. Detect call type
  let callType: 'voice' | 'video' | null = null;
  if (lower.includes('voice call') || lower.includes('panggilan suara') || lower.includes('audio call') || lower.includes('sprach-anruf') || lower.includes('appel vocal') || lower.includes('llamada de voz')) {
    callType = 'voice';
  } else if (lower.includes('video call') || lower.includes('panggilan video') || lower.includes('videoanruf') || lower.includes('appel vidéo') || lower.includes('llamada de video') || lower.includes('videollamada') || lower.includes('chamada de vídeo')) {
    callType = 'video';
  }

  if (!callType) return null;

  // 2. Detect duration
  let durationSeconds: number | undefined;
  const durationMatch = lower.match(/(\d+)\s*(sec|min|hr|detik|menit|jam|s|m|h)/i);
  if (durationMatch) {
    const val = parseInt(durationMatch[1], 10);
    const unit = durationMatch[2].toLowerCase();
    if (unit.startsWith('sec') || unit.startsWith('detik') || unit === 's') {
      durationSeconds = val;
    } else if (unit.startsWith('min') || unit.startsWith('menit') || unit === 'm') {
      durationSeconds = val * 60;
    } else if (unit.startsWith('hr') || unit.startsWith('jam') || unit === 'h') {
      durationSeconds = val * 3600;
    }
  }

  // 3. Detect joined count (for groups)
  let joinedCount: number | undefined;
  const joinedMatch = lower.match(/(\d+)\s*(joined|bergabung|beigetreten|rejoint|unieron|entraram)/i);
  if (joinedMatch) {
    joinedCount = parseInt(joinedMatch[1], 10);
  }

  // 4. Determine outcome
  let outcome: 'missed' | 'answered' | 'no-answer' = 'answered';
  if (durationSeconds !== undefined) {
    outcome = 'answered';
  } else if (lower.includes('missed') || lower.includes('tak terjawab') || lower.includes('verpasst') || lower.includes('manqué') || lower.includes('perdida') || lower.includes('não atendida')) {
    outcome = 'missed';
  } else {
    outcome = 'no-answer'; // Default for calls without duration and not explicitly missed
  }

  return { callType, durationSeconds, outcome, joinedCount };
}
