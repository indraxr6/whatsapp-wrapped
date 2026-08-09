import type { ParsedChatMetrics } from '../../types/chat';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  metrics: ParsedChatMetrics;
  chatMode?: 'dm' | 'group';
}

const ACCENT_COLORS = ['bg-accent-blue text-white', 'bg-accent-lime text-black', 'bg-accent-orange text-white', 'bg-accent-yellow text-black'];

export default function MessageShareCard({ metrics, chatMode = 'dm' }: Props) {
  const { t } = useLanguage();
  const { participants, messagesPerSender, totalMessages, doubleTextCounts, avgMessagesPerBurst } = metrics;

  const sortedParticipants = [...participants].sort((a, b) => (messagesPerSender[b] ?? 0) - (messagesPerSender[a] ?? 0));

  let displayParticipants = sortedParticipants;
  let othersCount = 0;

  const othersKey = t('group.others');

  if (chatMode === 'group' && sortedParticipants.length > 8) {
    displayParticipants = sortedParticipants.slice(0, 7);
    const others = sortedParticipants.slice(7);
    othersCount = others.reduce((acc, p) => acc + (messagesPerSender[p] ?? 0), 0);
    displayParticipants.push(othersKey);
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4 flex-shrink-0">{t('msgshare.title')}</p>

      <div className="space-y-4 max-h-[540px] overflow-y-auto pr-2 custom-scrollbar">
        {displayParticipants.map((p, i) => {
          const count = p === othersKey ? othersCount : (messagesPerSender[p] ?? 0);
          const pct = Math.round((count / totalMessages) * 100);
          const isOthers = p === othersKey;
          return (
            <div key={p}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`font-bold text-sm truncate max-w-[60%] ${isOthers ? 'text-gray-500 italic' : ''}`}>{p}</span>
                <span className="font-mono text-xs">{pct}%</span>
              </div>
              {/* Bar */}
              <div className="border-2 border-black h-7 relative bg-canvas">
                <div
                  className={`absolute left-0 top-0 h-full ${isOthers ? 'bg-gray-300 text-black' : ACCENT_COLORS[i % ACCENT_COLORS.length]}`}
                  style={{ width: `${pct}%` }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-xs font-bold mix-blend-difference text-white">
                  {count.toLocaleString()}
                </span>
              </div>
              {!isOthers && (
                <div className="flex gap-4">
                  <p className="text-xs text-gray-500 mt-1">{doubleTextCounts[p] ?? 0} {t('msgshare.doubleTexts')}</p>
                  <p className="text-xs text-gray-500 mt-1">{avgMessagesPerBurst[p] ?? 1.0} {t('msgshare.bursts')}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
