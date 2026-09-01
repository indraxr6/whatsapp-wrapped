import type { ParsedChatMetrics } from '../../types/chat';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  metrics: ParsedChatMetrics;
  evolutionNote?: string;
}

export default function TopicsCard({ metrics, evolutionNote }: Props) {
  const { t } = useLanguage();
  const { detectedTopics } = metrics;

  if (!detectedTopics?.length && !evolutionNote) return null;

  return (
    <div className="p-6 h-full border-t-2 md:border-t-0 md:b0 border-black">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">{t('topics.title')}</p>

      {detectedTopics && detectedTopics.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-bold mb-3">{t('topics.most')}</p>
          <div className="flex flex-wrap gap-2">
            {detectedTopics.map((topic, i) => (
              <span key={i} className="px-3 py-1 bg-white border-2 border-black font-bold text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-px hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all cursor-default">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {evolutionNote && (
        <div>
          <p className="text-xs font-bold mb-2">{t('topics.change')}</p>
          <p className="text-sm leading-relaxed text-gray-800 italic border-l-4 border-black pl-3 py-1">
            "{evolutionNote}"
          </p>
        </div>
      )}
    </div>
  );
}
