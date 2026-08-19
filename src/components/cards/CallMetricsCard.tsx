import { Phone, PhoneMissed, Clock, Eye, Edit3, Trash2, Video } from 'lucide-react';
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
  const { participants, callsInitiated, callsMissed, totalCallDurationSeconds, totalVideoCallDurationSeconds, longestVoiceCallSeconds, longestVideoCallSeconds, viewOnceCount, editedMessageCount, deletedMessageCount, totalVoiceCalls, totalVideoCalls } = metrics;

  const totalCalls = Object.values(callsInitiated).reduce((a, b) => a + b, 0);
  const totalViewOnce = Object.values(viewOnceCount).reduce((a, b) => a + b, 0);
  const totalEdited = Object.values(editedMessageCount).reduce((a, b) => a + b, 0);
  const totalDeleted = Object.values(deletedMessageCount).reduce((a, b) => a + b, 0);

  if (totalCalls === 0 && totalViewOnce === 0 && totalEdited === 0 && totalDeleted === 0) {
    return null;
  }

  const sortedParticipants = [...participants].sort((a, b) => (callsInitiated[b] ?? 0) - (callsInitiated[a] ?? 0));
  const displayParticipants = chatMode === 'group' ? sortedParticipants.slice(0, 5) : sortedParticipants;

  const sumVoiceDuration = Object.values(totalCallDurationSeconds).reduce((a, b) => a + b, 0);
  const sumVideoDuration = Object.values(totalVideoCallDurationSeconds || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 h-full flex flex-col bg-accent-blue/10">
      <div className="grid grid-cols-2 gap-4 mb-6">
        {(sumVideoDuration > 0 || totalVideoCalls > 0) ? (
          <>
            <div className="bg-white border-2 border-black shadow-nb p-3 flex flex-col items-center text-center">
              <Phone className="mb-2 text-accent-blue" size={24} strokeWidth={2.5} />
              <p className="font-mono text-xs uppercase text-gray-500">{sumVoiceDuration === 0 ? t('calls.initiated') : t('calls.durationVoice')}</p>
              <p className="font-black text-2xl">
                {sumVoiceDuration === 0 ? totalVoiceCalls : formatDuration(sumVoiceDuration)}
              </p>
            </div>
            <div className="bg-white border-2 border-black shadow-nb p-3 flex flex-col items-center text-center">
              <Video className="mb-2 text-accent-blue" size={24} strokeWidth={2.5} />
              <p className="font-mono text-xs uppercase text-gray-500">{sumVideoDuration === 0 ? t('calls.initiated') : t('calls.durationVideo')}</p>
              <p className="font-black text-2xl">
                {sumVideoDuration === 0 ? totalVideoCalls : formatDuration(sumVideoDuration)}
              </p>
            </div>
          </>
        ) : (
          <div className="bg-white border-2 border-black shadow-nb p-3 flex flex-col items-center text-center">
            <Phone className="mb-2 text-accent-blue" size={24} strokeWidth={2.5} />
            <p className="font-mono text-xs uppercase text-gray-500">{sumVoiceDuration === 0 ? t('calls.initiated') : t('calls.duration')}</p>
            <p className="font-black text-2xl">
              {sumVoiceDuration === 0 ? totalVoiceCalls : formatDuration(sumVoiceDuration)}
            </p>
          </div>
        )}

        {longestVoiceCallSeconds > 0 && longestVoiceCallSeconds !== sumVoiceDuration && (
          <div className="bg-white border-2 border-black shadow-nb p-3 flex flex-col items-center text-center">
            <Clock className="mb-2 text-accent-lime" size={24} strokeWidth={2.5} />
            <p className="font-mono text-xs uppercase text-gray-500">{t('calls.longestVoice')}</p>
            <p className="font-black text-2xl">
              {formatDuration(longestVoiceCallSeconds)}
            </p>
          </div>
        )}
        {longestVideoCallSeconds > 0 && longestVideoCallSeconds !== sumVideoDuration && (
          <div className="bg-white border-2 border-black shadow-nb p-3 flex flex-col items-center text-center">
            <Clock className="mb-2 text-accent-lime" size={24} strokeWidth={2.5} />
            <p className="font-mono text-xs uppercase text-gray-500">{t('calls.longestVideo')}</p>
            <p className="font-black text-2xl">
              {formatDuration(longestVideoCallSeconds)}
            </p>
          </div>
        )}
        {totalViewOnce > 0 && (
          <div className="bg-white border-2 border-black shadow-nb p-3 flex flex-col items-center text-center">
            <Eye className="mb-2 text-accent-orange" size={24} strokeWidth={2.5} />
            <p className="font-mono text-xs uppercase text-gray-500">{t('calls.viewOnce')}</p>
            <p className="font-black text-2xl">
              {totalViewOnce}
            </p>
          </div>
        )}
        {totalEdited > 0 && (
          <div className="bg-white border-2 border-black shadow-nb p-3 flex flex-col items-center text-center">
            <Edit3 className="mb-2 text-accent-yellow" size={24} strokeWidth={2.5} />
            <p className="font-mono text-xs uppercase text-gray-500">{t('calls.edited')}</p>
            <p className="font-black text-2xl">
              {totalEdited}
            </p>
          </div>
        )}
        {totalDeleted > 0 && (
          <div className="bg-white border-2 border-black shadow-nb p-3 flex flex-col items-center text-center">
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
                  <div className="relative group flex items-center gap-1 cursor-help">
                    <Phone size={12} /> {initiated}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-[2px_2px_0_0_#000] border border-black">
                      {t('calls.initiated')}
                    </div>
                  </div>
                  <div className="relative group flex items-center gap-1 text-accent-orange cursor-help">
                    <PhoneMissed size={12} /> {missed}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-accent-orange text-white text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-[2px_2px_0_0_#000] border border-black">
                      {t('calls.missed')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
