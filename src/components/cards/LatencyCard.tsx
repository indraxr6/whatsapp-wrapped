import type { ParsedChatMetrics } from '../../types/chat';
import { formatDuration } from '../../lib/metrics';

interface Props {
  metrics: ParsedChatMetrics;
  chatMode?: 'dm' | 'group';
}

import { useLanguage } from '../../i18n/LanguageContext';

const ACCENTS = ['#0000FF', '#FF5500'];

export default function LatencyCard({ metrics, chatMode = 'dm' }: Props) {
  const { t } = useLanguage();
  const { participants, avgResponseTimeMinutes, messagesPerSender } = metrics;
  
  const sortedParticipants = [...participants].sort((a, b) => (messagesPerSender[b] ?? 0) - (messagesPerSender[a] ?? 0));
  const displayParticipants = chatMode === 'group' ? sortedParticipants.slice(0, 10) : sortedParticipants;

  const maxMinutes = Math.max(
    ...displayParticipants.map((p) => avgResponseTimeMinutes[p] ?? 0),
    1
  );

  return (
    <div className="p-6 h-full">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-1">{t('latency.title')}</p>
      <p className="text-xs text-gray-400 mb-4">{t('latency.subtitle')}</p>

      <div className={`space-y-6 ${chatMode === 'group' ? 'max-h-[300px] overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
        {displayParticipants.map((p, i) => {
          const minutes = avgResponseTimeMinutes[p] ?? 0;
          const pct = Math.round((minutes / maxMinutes) * 100);

          // Flat radial-style gauge using a simple horizontal bar with tick marks
          return (
            <div key={p}>
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-bold text-sm truncate max-w-[55%]">{p}</span>
                <span className="font-mono text-sm font-bold">{formatDuration(minutes)}</span>
              </div>

              {/* Flat gauge bar with tick marks */}
              <div className="relative">
                <div className="border-2 border-black h-8 bg-canvas relative overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full"
                    style={{ width: `${pct}%`, backgroundColor: ACCENTS[i % ACCENTS.length] }}
                  />
                  {/* Tick marks */}
                  {[25, 50, 75].map((tick) => (
                    <div
                      key={tick}
                      className="absolute top-0 h-full border-r border-black opacity-20"
                      style={{ left: `${tick}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between font-mono text-xs text-gray-400 mt-1">
                  <span>{t('latency.faster')}</span>
                  <span>{t('latency.slower')}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-1">{t('latency.avgReply')}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
