export type MediaType = 'image' | 'video' | 'audio' | 'sticker' | 'gif' | 'document' | 'contactCard' | 'link' | 'location' | 'unknown';

export interface ChatMessage {
  timestamp: Date;
  sender: string;
  content: string;
  isMedia: boolean;
  mediaType?: MediaType;
  isSystem: boolean;
  isCall?: boolean;
  callType?: 'voice' | 'video';
  callDurationSeconds?: number;
  callOutcome?: 'missed' | 'answered' | 'no-answer';
  callJoinedCount?: number;
  isEdited?: boolean;
}

export interface EmojiCount {
  emoji: string;
  count: number;
}

export interface MonthlyCount {
  month: string; // e.g. "2025-03"
  count: number;
}

export interface EraMetrics {
  avgResponseTimeMinutes: number;
  avgMessageLength: number;
  topEmoji: string | null;
}

export interface GroupRenameEvent {
  date: Date;
  actor: string;
  oldName: string | null;
  newName: string;
}

export interface ParsedChatMetrics {
  totalMessages: number;
  dateRange: { start: Date; end: Date };
  participants: string[];
  messagesPerSender: Record<string, number>;
  avgResponseTimeMinutes: Record<string, number>;
  avgMessagesPerBurst: Record<string, number>;
  doubleTextCounts: Record<string, number>;
  ghostingInstances: Record<string, number>;
  groupName: string | null;
  groupNameHistory: GroupRenameEvent[];
  iconChangeCount: number;
  sharedLinks: Record<string, number>;
  activeChatDays: number;
  mirroredPhrases: { phrase: string; count: number }[];

  // Media
  mediaCounts: Record<string, number>;
  viewOnceCount: Record<string, number>;
  editedMessageCount: Record<string, number>;
  deletedMessageCount: Record<string, number>;
  totalVoiceCalls: number;
  totalVideoCalls: number;
  callsInitiated: Record<string, number>;
  callsMissed: Record<string, number>;
  totalCallDurationSeconds: Record<string, number>;
  totalVideoCallDurationSeconds: Record<string, number>;
  longestVoiceCallSeconds: number;
  longestVideoCallSeconds: number;
  stickerCount: Record<string, number>;

  // Emoji - top 10 per sender (not merged)
  topEmojisPerSender: Record<string, EmojiCount[]>;
  emojiLeaderboardPerSender: Record<string, EmojiCount[]>;
  emojiSpamOutliers: { sender: string; emoji: string; count: number }[];

  // Activity patterns
  hourlyHeatmap: number[]; // 24-hour distribution
  longestStreakByDay: number;

  // V2 AI Era Sampling & Keywords
  sampleExcerpts: {
    early: string[];
    median: string[];
    late: string[];
  };
  eraDateRanges: {
    early: { start: Date; end: Date } | null;
    median: { start: Date; end: Date } | null;
    late: { start: Date; end: Date } | null;
  };
  eraMetrics: {
    early: EraMetrics;
    median: EraMetrics;
    late: EraMetrics;
  };
  topKeywords: { word: string; count: number }[];

  // Chat span & pace
  chatDurationDays: number;
  avgMessagesPerDay: number;

  // Monthly trend
  monthlyMessageCounts: MonthlyCount[];
  peakMonth: MonthlyCount;

  // Media per type
  mediaLeaderboard: Record<MediaType, number>;
  mediaLeaderboardPerSender: Record<string, Record<MediaType, number>>;
}

// V2 Gemini schema - simplified single-paragraph approach
export interface GeminiInsights {
  personality_summary: string; // 4-5 sentences merged: archetype + vibe + power balance
  roast: string;               // 1-2 sentences
  topics: string[];            // 3-6 topics detected
  evolution_note: string;      // 1 sentence on how the dynamic changed over time
}

export type AppView = 'upload' | 'analyzing' | 'results' | 'loading';
