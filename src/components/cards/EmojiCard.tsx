import type { ParsedChatMetrics } from '../../types/chat';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  metrics: ParsedChatMetrics;
  chatMode?: 'dm' | 'group';
}

export default function EmojiCard({ metrics, chatMode = 'dm' }: Props) {
  const { t } = useLanguage();
  const { participants, emojiLeaderboardPerSender, messagesPerSender, emojiSpamOutliers } = metrics;
  
  const sortedParticipants = [...participants].sort((a, b) => (messagesPerSender[b] ?? 0) - (messagesPerSender[a] ?? 0));
  const displayParticipants = chatMode === 'group' ? sortedParticipants.slice(0, 10) : sortedParticipants;

  const topSpam = emojiSpamOutliers && emojiSpamOutliers.length > 0 ? emojiSpamOutliers[0] : null;

  return (
    <div className="p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-6">{t('section.emoji')}</p>

      {topSpam && (
        <div className="mb-6 bg-accent-orange/10 border border-accent-orange p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div>
            <p className="font-bold text-sm">{t('emoji.burstTitle')}</p>
            <p className="text-xs text-gray-700"><strong>{topSpam.sender}</strong> {t('emoji.burstSent')} {topSpam.emoji} {topSpam.count} {t('emoji.burstTimes')}</p>
          </div>
          <div className="text-2xl" style={{ overflowWrap: 'break-word', wordBreak: 'break-all' }}>
            {topSpam.emoji.repeat(Math.min(topSpam.count, 10))}{topSpam.count > 10 ? '...' : ''}
          </div>
        </div>
      )}

      <div className={`gap-6 grid grid-cols-1 md:grid-cols-2 md:gap-x-8 ${chatMode === 'group' ? 'max-h-[500px] overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
        {displayParticipants.map((p, pIdx) => {
          const emojis = emojiLeaderboardPerSender[p] ?? [];
          const maxCount = emojis[0]?.count ?? 1;

          return (
            <div key={p} className={chatMode === 'dm' && pIdx > 0 ? 'md:border-l-2 md:border-black md:pl-8' : ''}>
              <p className="font-bold text-sm mb-3 truncate">{p}</p>

              <div className="space-y-1.5">
                {emojis.slice(0, 10).map((e, i) => {
                  const barPct = Math.round((e.count / maxCount) * 100);
                  return (
                    <div key={e.emoji} className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gray-400 w-4 text-right">{i + 1}</span>
                      <span className="text-base w-7 text-center">{e.emoji}</span>
                      <div className="flex-1 border border-black h-4 bg-canvas">
                        <div
                          className="h-full bg-black"
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs w-8 text-right">{e.count}</span>
                    </div>
                  );
                })}
                {emojis.length === 0 && (
                  <p className="text-xs text-gray-400 italic">{t('emoji.none')}</p>
                )}
              </div>
            </div>
          );
        })}
        {chatMode === 'group' && sortedParticipants.length > 10 && (
          <p className="text-xs text-gray-500 italic mt-2">{t('group.showingTop')}</p>
        )}
      </div>
    </div>
  );
}
