import { useLanguage } from '../../i18n/LanguageContext';
import type { ParsedChatMetrics } from '../../types/chat';

interface Props {
  metrics: ParsedChatMetrics;
}

export default function ExcerptsCard({ metrics }: Props) {
  const { t } = useLanguage();
  const { sampleExcerpts } = metrics;

  return (
    <div className="p-6 bg-white border-2 border-black flex flex-col h-full shadow-nb">
      <h2 className="font-mono text-sm uppercase tracking-widest mb-6">{t('excerpts.title')}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="flex flex-col">
          <h3 className="font-bold text-lg mb-3 border-b-2 border-black pb-2">{t('excerpts.early')}</h3>
          <div className="text-xs font-mono text-gray-700 space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {sampleExcerpts.early.slice(0, 15).map((line, i) => (
              <p key={i} className="break-words border-l-2 border-accent-blue pl-2">{line}</p>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="font-bold text-lg mb-3 border-b-2 border-black pb-2">{t('excerpts.median')}</h3>
          <div className="text-xs font-mono text-gray-700 space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {sampleExcerpts.median.slice(0, 15).map((line, i) => (
              <p key={i} className="break-words border-l-2 border-accent-lime pl-2">{line}</p>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="font-bold text-lg mb-3 border-b-2 border-black pb-2">{t('excerpts.late')}</h3>
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
