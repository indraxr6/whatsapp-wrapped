import type { GeminiInsights } from '../../types/chat';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  insights: GeminiInsights;
}

export default function TopicsCard({ insights }: Props) {
  const { t } = useLanguage();
  const { topics, evolution_note } = insights;

  if (!topics?.length && !evolution_note) return null;

  return (
    <div className="p-6 h-full border-t-2 md:border-t-0 md:b0 border-black">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">{t('topics.title')}</p>

      {topics && topics.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-bold mb-3">{t('topics.most')}</p>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic, i) => (
              <span key={i} className="nb-label bg-white text-black text-xs px-2 py-1 normal-case font-sans font-semibold">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {evolution_note && (
        <div>
          <p className="text-xs font-bold mb-2">{t('topics.change')}</p>
          <p className="text-sm leading-relaxed text-gray-800 italic border-l-4 border-black pl-3 py-1">
            "{evolution_note}"
          </p>
        </div>
      )}
    </div>
  );
}
