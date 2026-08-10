import { useLanguage } from '../../i18n/LanguageContext';
import type { ParsedChatMetrics } from '../../types/chat';
import { Layers } from 'lucide-react';

interface Props {
  metrics: ParsedChatMetrics;
}

export default function MirroredPhrasesCard({ metrics }: Props) {
  const { t } = useLanguage();
  const phrases = metrics.mirroredPhrases.slice(0, 5);

  if (phrases.length === 0) return null;

  return (
    <div className="p-6 h-full bg-white">
      <div className="flex items-center gap-2 mb-4">
        <Layers size={16} className="text-gray-500" />
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
          {t('mirrored.title')}
        </p>
      </div>
      
      <p className="text-xs text-gray-500 mb-4">{t('mirrored.desc')}</p>

      <div className="space-y-3">
        {phrases.map((p, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="font-semibold text-sm truncate pr-4">"{p.phrase}"</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
              {p.count}x
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
