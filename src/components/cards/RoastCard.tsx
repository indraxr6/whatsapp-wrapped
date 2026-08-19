import { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import type { GeminiInsights, ParsedChatMetrics } from '../../types/chat';
import { generateNewRoast } from '../../lib/gemini';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  insights: GeminiInsights;
  metrics: ParsedChatMetrics;
  insightStatus?: 'success' | 'opt_out' | 'failed' | 'failed_429' | 'failed_503';
  onRetry?: () => void;
}

const MAX_REGENERATIONS = 3; // 3 more after the initial = 4 total roasts

export default function RoastCard({ insights, metrics, insightStatus = 'success', onRetry }: Props) {
  const { t } = useLanguage();
  const [roasts, setRoasts] = useState<string[]>([insights.roast]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [regenerationsUsed, setRegenerationsUsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < roasts.length - 1;
  const canRoastMore = regenerationsUsed < MAX_REGENERATIONS && currentIndex === roasts.length - 1;
  const capReached = regenerationsUsed >= MAX_REGENERATIONS;

  const handleRoastMore = async () => {
    if (!canRoastMore || loading) return;
    setError(null);
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('gemini_api_key') ?? '';
      if (!apiKey) {
        setError('No API key set - set your Gemini key to generate more roasts.');
        setLoading(false);
        return;
      }
      const newRoast = await generateNewRoast(apiKey, metrics, roasts);
      setRoasts((prev) => [...prev, newRoast]);
      setCurrentIndex((prev) => prev + 1);
      setRegenerationsUsed((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate roast.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
          {insightStatus !== 'success' ? 'Roast' : t('roast.title')}
        </p>
        {insightStatus.startsWith('failed') && (
          <span className="font-mono text-[10px] uppercase tracking-widest bg-accent-orange text-white px-2 py-0.5 font-bold">
            {t('ai.genericInsight')}
          </span>
        )}
      </div>

      {/* Roast text */}
      <div className="flex-1 border-2 border-black p-4 bg-accent-yellow mb-4 min-h-[120px] flex items-center">
        <p className="text-base font-semibold leading-relaxed">
          {loading ? (
            <span className="font-mono text-sm text-gray-600">generating next roast...</span>
          ) : (
            roasts[currentIndex]
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
            {currentIndex + 1} / {roasts.length}
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
          ) : !capReached && insightStatus !== 'opt_out' ? (
            <button
              onClick={handleRoastMore}
              disabled={!canRoastMore || loading}
              className={`nb-btn text-xs py-1.5 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-nb ${loading ? 'opacity-60' : ''}`}
            >
              <RefreshCw size={12} strokeWidth={2.5} className={loading ? 'animate-spin' : ''} />
              ROAST MORE
            </button>
          ) : (
            <span className="font-mono text-xs text-gray-400">cap reached</span>
          )}
        </div>
      </div>
    </div>
  );
}
