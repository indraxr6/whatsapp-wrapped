import type { GeminiInsights } from '../../types/chat';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  insights: GeminiInsights;
  insightStatus?: 'success' | 'opt_out' | 'failed';
  onRetry?: () => void;
}

export default function PersonalityCard({ insights, insightStatus = 'success', onRetry }: Props) {
  const { t } = useLanguage();

  return (
    <div className="p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">_ PERSONALITY ANALYSIS</p>
        {insightStatus === 'failed' && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest bg-accent-orange text-white px-2 py-0.5 font-bold">
              {t('ai.genericInsight')}
            </span>
            <button 
              onClick={onRetry}
              className="font-mono text-[10px] uppercase tracking-widest border border-black px-2 py-0.5 hover:bg-black hover:text-white transition-colors"
            >
              {t('ai.retry')}
            </button>
          </div>
        )}
      </div>

      <p className="text-base leading-relaxed text-gray-800">
        {insights.personality_summary}
      </p>
    </div>
  );
}
