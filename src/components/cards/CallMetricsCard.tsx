import { Phone, PhoneMissed, Clock, Eye, Edit3, Trash2 } from 'lucide-react';
import type { ParsedChatMetrics } from '../../types/chat';

interface Props {
  metrics: ParsedChatMetrics;
  chatMode?: 'dm' | 'group';
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const hours = Math.floor(mins / 60);
  if (hours > 0) {
    return `${hours}h ${mins % 60}m`;
  }
  return `${mins}m`;
}

import { useLanguage } from '../../i18n/LanguageContext';

export default function CallMetricsCard({ metrics, chatMode = 'dm' }: Props) {
  const { t } = useLanguage();
  const { participants, callsInitiated, callsMissed, totalCallDurationSeconds, longestCallSeconds, viewOnceCount, editedMessageCount, deletedMessageCount } = metrics;
  
  const totalCalls = Object.values(callsInitiated).reduce((a, b) => a + b, 0);
  const totalViewOnce = Object.values(viewOnceCount).reduce((a, b) => a + b, 0);
  const totalEdited = Object.values(editedMessageCount).reduce((a, b) => a + b, 0);
  const totalDeleted = Object.values(deletedMessageCount).reduce((a, b) => a + b, 0);
  
  if (totalCalls === 0 && totalViewOnce === 0 && totalEdited === 0 && totalDeleted === 0) {
    return null;
  }

  const sortedParticipants = [...participants].sort((a, b) => (callsInitiated[b] ?? 0) - (callsInitiated[a] ?? 0));
  const displayParticipants = chatMode === 'group' ? sortedParticipants.slice(0, 5) : sortedParticipants;

  return (
    <div className="p-6 h-full flex flex-col bg-accent-blue/10 border-black border-b-2 md:border-b-0 md:border-r-2">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-6">{t('calls.title')}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border-2 border-black p-3 flex flex-col items-center text-center">
          <Phone className="mb-2 text-accent-blue" size={24} strokeWidth={2.5} />
          <p className="font-mono text-xs uppercase text-gray-500">{t('calls.duration')}</p>
          <p className="font-black text-2xl">
            {Object.values(totalCallDurationSeconds).reduce((a, b) => a + b, 0) === 0 
              ? t('calls.guess')
              : formatDuration(Object.values(totalCallDurationSeconds).reduce((a, b) => a + b, 0))}
          </p>
        </div>
        <div className="bg-white border-2 border-black p-3 flex flex-col items-center text-center">
          <Clock className="mb-2 text-accent-lime" size={24} strokeWidth={2.5} />
          <p className="font-mono text-xs uppercase text-gray-500">{t('calls.longest')}</p>
          <p className="font-black text-2xl">
            {longestCallSeconds === 0 ? t('calls.guess') : formatDuration(longestCallSeconds)}
          </p>
        </div>
        {totalViewOnce > 0 && (
          <div className="bg-white border-2 border-black p-3 flex flex-col items-center text-center">
            <Eye className="mb-2 text-accent-orange" size={24} strokeWidth={2.5} />
            <p className="font-mono text-xs uppercase text-gray-500">{t('calls.viewOnce')}</p>
            <p className="font-black text-2xl">
              {totalViewOnce}
            </p>
          </div>
        )}
        {totalEdited > 0 && (
          <div className="bg-white border-2 border-black p-3 flex flex-col items-center text-center">
            <Edit3 className="mb-2 text-accent-yellow" size={24} strokeWidth={2.5} />
            <p className="font-mono text-xs uppercase text-gray-500">{t('calls.edited')}</p>
            <p className="font-black text-2xl">
              {totalEdited}
            </p>
          </div>
        )}
        {totalDeleted > 0 && (
          <div className="bg-white border-2 border-black p-3 flex flex-col items-center text-center">
            <Trash2 className="mb-2 text-red-500" size={24} strokeWidth={2.5} />
            <p className="font-mono text-xs uppercase text-gray-500">{t('calls.deleted')}</p>
            <p className="font-black text-2xl">
              {totalDeleted}
            </p>
          </div>
        )}
      </div>

      <div className="flex-1">
        <p className="font-bold text-sm mb-3">{t('calls.topCallers')}</p>
        <div className="space-y-3">
          {displayParticipants.map(p => {
            const initiated = callsInitiated[p] ?? 0;
            const missed = callsMissed[p] ?? 0;
            const duration = totalCallDurationSeconds[p] ?? 0;
            
            if (initiated === 0 && missed === 0 && duration === 0) return null;

            return (
              <div key={p} className="flex items-center justify-between">
                <span className="font-semibold text-sm truncate max-w-[120px]">{p}</span>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1"><Phone size={12}/> {initiated}</span>
                  <span className="flex items-center gap-1 text-accent-orange"><PhoneMissed size={12}/> {missed}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
