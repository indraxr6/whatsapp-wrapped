import type { ParsedChatMetrics } from '../../types/chat';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  metrics: ParsedChatMetrics;
  chatMode?: 'dm' | 'group';
}

export default function GhostingCard({ metrics, chatMode = 'dm' }: Props) {
  const { t } = useLanguage();
  const { participants, ghostingInstances } = metrics;
  const totalGhosts = Object.values(ghostingInstances).reduce((a, b) => a + b, 0);
  
  const sortedParticipants = [...participants].sort((a, b) => (ghostingInstances[b] ?? 0) - (ghostingInstances[a] ?? 0));
  const displayParticipants = chatMode === 'group' ? sortedParticipants.slice(0, 10) : sortedParticipants;
  const ghoster = sortedParticipants[0];

  return (
    <div className="p-6 h-full">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-1">_ GHOSTING INDEX</p>
      <p className="text-xs text-gray-400 mb-4">(12h+ gap before replying)</p>

      {totalGhosts === 0 ? (
        <div>
          <p className="nb-stat-sm">0</p>
          <p className="text-sm text-gray-600 mt-2">No major ghosting detected.</p>
          <p className="text-xs text-gray-500 mt-1">Both parties respond within 12 hours consistently.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="nb-stat">{totalGhosts}</p>
            <p className="text-sm text-gray-600 mt-1">total ghosting instances</p>
          </div>

          <div className={`border-t-2 border-black pt-4 space-y-2 ${chatMode === 'group' ? 'max-h-[150px] overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
            {displayParticipants.map((p) => {
              const count = ghostingInstances[p] ?? 0;
              const isWorst = p === ghoster && count > 0;
              return (
                <div key={p} className={`flex justify-between items-center text-sm ${isWorst ? 'font-bold' : ''}`}>
                  <span className="truncate max-w-[60%]">{p}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{count}x</span>
                    {isWorst && <span className="nb-label text-xs bg-accent-orange text-white border-accent-orange">WORST</span>}
                  </div>
                </div>
              );
            })}
            {chatMode === 'group' && sortedParticipants.length > 10 && (
              <p className="text-xs text-gray-500 italic mt-2">{t('group.showingTop10')}</p>
            )}
          </div>

          <p className="text-xs text-gray-500 border-t-2 border-black pt-3">
            Note: gaps &gt;6h at night excluded from response time averages.
          </p>
        </div>
      )}
    </div>
  );
}
