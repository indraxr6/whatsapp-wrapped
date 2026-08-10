import type { ParsedChatMetrics } from '../../types/chat';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  metrics: ParsedChatMetrics;
}

export default function OverviewCard({ metrics }: Props) {
  const { t, language } = useLanguage();
  const { totalMessages, activeChatDays, chatDurationDays, avgMessagesPerDay, longestStreakByDay, dateRange } = metrics;

  return (
    <div className="p-6 h-full flex flex-col">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">{t('overview.glance')}</p>

      <div className="space-y-4 flex-1">
        <div>
          <p className="nb-stat">{totalMessages.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">{t('overview.messages')}</p>
        </div>

        <div className="border-t-2 border-black pt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="nb-stat-sm">{activeChatDays.toLocaleString()}</p>
            <p className="text-xs font-bold text-gray-900 mt-0.5 leading-tight">{t('overview.activeDays')}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{t('overview.span').replace('{count}', chatDurationDays.toString())}</p>
          </div>
          <div>
            <p className="nb-stat-sm">{avgMessagesPerDay}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('overview.msgsPerDay')}</p>
          </div>
        </div>

        <div className="border-t-2 border-black pt-4">
          <p className="font-bold text-base">{longestStreakByDay} {t('overview.streak')}</p>
          <p className="text-xs text-gray-500 mt-0.5">{t('overview.streakDesc')}</p>
        </div>

        <div className="border-t-2 border-black pt-4 font-mono text-xs text-gray-500 space-y-1">
          <p>{t('overview.from')} {dateRange.start.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US')}</p>
          <p>{t('overview.to')} &nbsp;&nbsp;{dateRange.end.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US')}</p>
        </div>
      </div>
    </div>
  );
}
