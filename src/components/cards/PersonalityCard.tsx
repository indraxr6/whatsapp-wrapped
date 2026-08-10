import { useState, useEffect } from 'react';
import type { GeminiInsights } from '../../types/chat';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  insights: GeminiInsights;
  insightStatus?: 'success' | 'opt_out' | 'failed' | 'failed_429' | 'failed_503';
  onRetry?: () => void;
}

export default function PersonalityCard({ insights, insightStatus = 'success', onRetry }: Props) {
  const { t } = useLanguage();
  const [retryEnabled, setRetryEnabled] = useState(insightStatus !== 'failed_503');

  useEffect(() => {
    if (insightStatus === 'failed_503') {
      setRetryEnabled(false);
      const timer = setTimeout(() => setRetryEnabled(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setRetryEnabled(true);
    }
  }, [insightStatus]);

  return (
    <div className="p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">_ PERSONALITY ANALYSIS</p>
        {insightStatus.startsWith('failed') && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest bg-accent-orange text-white px-2 py-0.5 font-bold">
              {t('ai.genericInsight')}
            </span>
            {insightStatus !== 'failed_429' && (
              <button 
                onClick={retryEnabled ? onRetry : undefined}
                disabled={!retryEnabled}
                className={`font-mono text-[10px] uppercase tracking-widest border border-black px-2 py-0.5 transition-colors ${retryEnabled ? 'hover:bg-black hover:text-white' : 'opacity-50 cursor-not-allowed'}`}
              >
                {t('ai.retry_soft')}
              </button>
            )}
          </div>
        )}
      </div>

      <p className="text-base leading-relaxed text-gray-800">
        {insights.personality_summary}
      </p>
    </div>
  );
}
