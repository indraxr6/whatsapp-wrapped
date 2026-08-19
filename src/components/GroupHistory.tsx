import { useState } from 'react';
import type { GroupRenameEvent } from '../types/chat';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  history: GroupRenameEvent[];
  iconChangeCount: number;
}

export default function GroupHistory({ history, iconChangeCount }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { t, language } = useLanguage();

  // Gated behind >= 2 renames
  if (history.length < 2 && iconChangeCount === 0) return null;

  return (
    <div className="mt-4 text-left sm:text-right font-mono text-xs text-gray-600">
      <div className="flex flex-col sm:items-end gap-1">
        {iconChangeCount > 0 && (
          <p>{t('group.iconChanged').replace('{count}', iconChangeCount.toString())}</p>
        )}
        
        {history.length >= 2 && (
          <div className="mt-2 w-full sm:w-auto">
            <button 
              onClick={() => setExpanded(!expanded)}
              className="nb-btn text-[11px] py-1.5 px-3 flex items-center justify-between gap-3 w-full sm:w-auto sm:ml-auto"
            >
              <span>{t('group.renamed').replace('{count}', history.length.toString())}</span>
              <span className="text-[10px]">{expanded ? '▲' : '▼'}</span>
            </button>

            {expanded && (
              <div className="mt-3 flex flex-col gap-3 border-l-2 sm:border-l-0 sm:border-r-2 border-black pl-3 sm:pl-0 sm:pr-3 text-left sm:text-right max-h-48 overflow-y-auto custom-scrollbar bg-gray-50 p-3 shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)]">
                {history.map((evt, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold mb-0.5">{evt.date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US')}</span>
                    <span className="leading-tight">
                      <span className="font-bold text-black">{evt.actor}</span> {t('group.changedTo')} <span className="font-bold text-black">"{evt.newName}"</span>
                    </span>
                    {evt.oldName && (
                      <span className="text-[10px] text-gray-500 mt-0.5">{t('group.from')} "{evt.oldName}"</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
