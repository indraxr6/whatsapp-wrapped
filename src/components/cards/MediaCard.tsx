import type { MediaType, ParsedChatMetrics } from '../../types/chat';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  metrics: ParsedChatMetrics;
  chatMode?: 'dm' | 'group';
}

const MEDIA_LABELS: Record<MediaType, string> = {
  image: 'Images',
  video: 'Videos',
  audio: 'Audio',
  sticker: 'Stickers',
  gif: 'GIFs',
  document: 'Documents',
  contactCard: 'Contacts',
  link: 'Links',
};

const MEDIA_ORDER: MediaType[] = ['image', 'video', 'sticker', 'audio', 'gif', 'document', 'contactCard', 'link'];

export default function MediaCard({ metrics, chatMode = 'dm' }: Props) {
  const { t } = useLanguage();
  const { mediaLeaderboard, mediaCounts, participants, messagesPerSender } = metrics;
  const totalMedia = Object.values(mediaCounts).reduce((a, b) => a + b, 0);
  const maxType = Math.max(...Object.values(mediaLeaderboard), 1);
  
  const sortedParticipants = [...participants].sort((a, b) => (mediaCounts[b] ?? 0) - (mediaCounts[a] ?? 0));
  const displayParticipants = chatMode === 'group' ? sortedParticipants.slice(0, 10) : sortedParticipants;

  return (
    <div className="p-6 h-full">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">_ MEDIA SENT</p>

      <div className="mb-4">
        <p className="nb-stat">{totalMedia.toLocaleString()}</p>
        <p className="text-sm text-gray-600 mt-1">total media files</p>
      </div>

      <div className="space-y-2 border-t-2 border-black pt-4">
        {MEDIA_ORDER.filter((t) => (mediaLeaderboard[t] ?? 0) > 0).map((type) => {
          const count = mediaLeaderboard[type] ?? 0;
          const barPct = Math.round((count / maxType) * 100);
          return (
            <div key={type}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono uppercase tracking-wide">{MEDIA_LABELS[type]}</span>
                <span className="font-bold">{count}</span>
              </div>
              <div className="border border-black h-2 bg-canvas">
                <div className="h-full bg-black" style={{ width: `${barPct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className={`mt-4 border-t-2 border-black pt-3 space-y-1 ${chatMode === 'group' ? 'max-h-[150px] overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
        {displayParticipants.map((p) => (
          <div key={p} className="flex justify-between text-xs">
            <span className="font-medium truncate max-w-[70%]">{p}</span>
            <span className="font-mono">{mediaCounts[p] ?? 0}</span>
          </div>
        ))}
        {chatMode === 'group' && sortedParticipants.length > 10 && (
          <p className="text-xs text-gray-500 italic mt-2">{t('group.showingTop10')}</p>
        )}
      </div>
    </div>
  );
}
