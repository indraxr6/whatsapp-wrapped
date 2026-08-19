import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import type { ParsedChatMetrics } from '../../types/chat';

interface Props {
  metrics: ParsedChatMetrics;
}

export default function ExcerptsCard({ metrics }: Props) {
  const { t, language } = useLanguage();
  const { sampleExcerpts, eraDateRanges } = metrics;
  const [earlyCount, setEarlyCount] = useState(15);
  const [medianCount, setMedianCount] = useState(15);

  const earlyExcerpts = sampleExcerpts.early.slice(0, earlyCount);
  const medianExcerpts = sampleExcerpts.median.slice(0, medianCount);

  const formatRange = (range: { start: Date; end: Date } | null) => {
    if (!range) return null;
    const locale = language === 'id' ? 'id-ID' : 'en-US';
    const opts: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
    const s = range.start.toLocaleDateString(locale, opts);
    const e = range.end.toLocaleDateString(locale, opts);
    return s === e ? s : `${s} — ${e}`;
  };

  return (
    <div className="p-6 bg-white border-2 border-black flex flex-col h-full shadow-nb">
      <h2 className="font-mono text-sm uppercase tracking-widest mb-6">{t('excerpts.title')}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="flex flex-col">
          <div className="mb-3 border-b-2 border-black pb-2">
            <h3 className="font-bold text-lg leading-tight">{t('excerpts.early')}</h3>
            {eraDateRanges.early && (
              <p className="text-[10px] font-mono text-gray-500 uppercase mt-0.5 tracking-wider">{formatRange(eraDateRanges.early)}</p>
            )}
          </div>
          <div className="text-xs font-mono text-gray-700 space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar pb-2">
            {earlyExcerpts.map((line, i) => (
              <p key={i} className="break-words border-l-2 border-accent-blue pl-2">{line}</p>
            ))}
            {sampleExcerpts.early.length > earlyCount && (
              <button
                onClick={() => setEarlyCount(prev => prev + 15)}
                className="mt-2 w-full nb-btn text-xs py-1.5"
              >
                Show More
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 border-b-2 border-black pb-2">
            <h3 className="font-bold text-lg leading-tight">{t('excerpts.median')}</h3>
            {eraDateRanges.median && (
              <p className="text-[10px] font-mono text-gray-500 uppercase mt-0.5 tracking-wider">{formatRange(eraDateRanges.median)}</p>
            )}
          </div>
          <div className="text-xs font-mono text-gray-700 space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar pb-2">
            {medianExcerpts.map((line, i) => (
              <p key={i} className="break-words border-l-2 border-accent-lime pl-2">{line}</p>
            ))}
            {sampleExcerpts.median.length > medianCount && (
              <button
                onClick={() => setMedianCount(prev => prev + 15)}
                className="mt-2 w-full nb-btn text-xs py-1.5"
              >
                Show More
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 border-b-2 border-black pb-2">
            <h3 className="font-bold text-lg leading-tight">{t('excerpts.late')}</h3>
            {eraDateRanges.late && (
              <p className="text-[10px] font-mono text-gray-500 uppercase mt-0.5 tracking-wider">{formatRange(eraDateRanges.late)}</p>
            )}
          </div>
          <div className="text-xs font-mono text-gray-700 space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {sampleExcerpts.late.slice(0, 15).map((line, i) => (
              <p key={i} className="break-words border-l-2 border-accent-orange pl-2">{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
