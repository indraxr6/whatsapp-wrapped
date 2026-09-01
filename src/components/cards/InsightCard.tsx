import { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import type { GeminiInsights, ParsedChatMetrics } from '../../types/chat';
import { generateNewInsight } from '../../lib/gemini';
import { getOfflineInsightCount } from '../../lib/fallbacks';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  insights: GeminiInsights;
  metrics: ParsedChatMetrics;
  insightStatus?: 'success' | 'opt_out' | 'failed' | 'failed_429' | 'failed_503';
  onRetry?: () => void;
}

export default function InsightCard({ insights, metrics, insightStatus = 'success', onRetry }: Props) {
  const { t, language } = useLanguage();
  const [insightList, setInsightList] = useState<string[]>([insights.chat_insight]);
  const [exhausted, setExhausted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [regenerationsUsed, setRegenerationsUsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOffline = insightStatus !== 'success';
  const maxRegenerations = isOffline 
    ? Math.min(9, Math.max(0, getOfflineInsightCount(metrics, language) - 1)) 
    : 3;

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < insightList.length - 1;
  const canLoadMore = regenerationsUsed < maxRegenerations && currentIndex === insightList.length - 1 && !exhausted;
  const capReached = regenerationsUsed >= maxRegenerations || exhausted;

  const handleLoadMore = async () => {
    if (!canLoadMore || loading) return;
    setError(null);
    setLoading(true);
    try {
      let newInsight: string | null = '';
      if (!isOffline) {
        const apiKey = localStorage.getItem('gemini_api_key') ?? '';
        if (!apiKey) {
          setError('No API key set - set your Gemini key to generate more insights.');
          setLoading(false);
          return;
        }
        newInsight = await generateNewInsight(apiKey, metrics, insightList, language);
      } else {
        // Offline generation happens instantly
        newInsight = await generateNewInsight('', metrics, insightList, language, true);
      }
      
      if (!newInsight) {
        setExhausted(true);
        return;
      }

      setInsightList((prev) => [...prev, newInsight as string]);
      setCurrentIndex((prev) => prev + 1);
      setRegenerationsUsed((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insight.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
          {insightStatus !== 'success' ? 'Chat Insight' : t('roast.title')}
        </p>
        {insightStatus.startsWith('failed') && (
          <span className="font-mono text-[10px] uppercase tracking-widest bg-accent-orange text-white px-2 py-0.5 font-bold">
            {t('ai.genericInsight')}
          </span>
        )}
      </div>

      {/* Insight text */}
      <div className="flex-1 border-2 border-black p-4 bg-accent-yellow mb-4 min-h-[120px] flex items-center">
        <p className="text-base font-semibold leading-relaxed">
          {loading ? (
            <span className="font-mono text-sm text-gray-600">generating next insight...</span>
          ) : (
            insightList[currentIndex]
          )}
        </p>
      </div>

      {/* Error */}
      {error && (
        <p className="font-mono text-xs text-red-700 mb-3">[ ERROR ] {error}</p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentIndex((i) => i - 1)}
            disabled={!canGoBack}
            className="border-2 border-black p-1.5 disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-px active:translate-x-[2px] active:translate-y-[2px] transition-all duration-[150ms] ease-linear"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setCurrentIndex((i) => i + 1)}
            disabled={!canGoForward}
            className="border-2 border-black p-1.5 disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-px active:translate-x-[2px] active:translate-y-[2px] transition-all duration-[150ms] ease-linear"
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
          <span className="font-mono text-xs text-gray-500 ml-2">
            {currentIndex + 1} / {insightList.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {insightStatus === 'failed' ? (
            <button
              onClick={onRetry}
              className="nb-btn text-xs py-1.5 flex items-center gap-1.5"
            >
              <RefreshCw size={12} strokeWidth={2.5} />
              {t('ai.retry')}
            </button>
          ) : !capReached ? (
            <button
              onClick={handleLoadMore}
              disabled={!canLoadMore || loading}
              className={`nb-btn text-xs py-1.5 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-nb ${loading ? 'opacity-60' : ''}`}
            >
              <RefreshCw size={12} strokeWidth={2.5} className={loading ? 'animate-spin' : ''} />
              MORE INSIGHT
            </button>
          ) : (
            <span className="font-mono text-xs text-gray-400">cap reached</span>
          )}
        </div>
      </div>
    </div>
  );
}
