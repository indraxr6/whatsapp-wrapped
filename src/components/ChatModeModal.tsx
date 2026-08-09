import { Users, User, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  detectedMode: 'dm' | 'group';
  onContinue: (mode: 'dm' | 'group') => void;
  onCancel: () => void;
}

export default function ChatModeModal({ detectedMode, onContinue, onCancel }: Props) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="nb-card max-w-md w-full relative bg-canvas">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users size={20} strokeWidth={2} />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest">{t('chatmode.title')}</span>
          </div>
          <button
            onClick={onCancel}
            className="border-2 border-black p-1 hover:-translate-y-px active:translate-x-[2px] active:translate-y-[2px] transition-all duration-[150ms] ease-linear"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm leading-relaxed mb-6">
          <p className="font-bold text-lg">{t('chatmode.question')}</p>
          <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: detectedMode === 'group' ? t('chatmode.detectedGroup') : t('chatmode.detectedDM') }} />
          <p className="text-gray-600">{t('chatmode.confirm')}</p>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onContinue('dm')}
            className="nb-btn w-full py-4 flex items-center justify-center gap-2 hover:bg-black hover:text-white group"
          >
            <User size={18} strokeWidth={2} className="group-hover:text-white text-black" />
            <span className="font-bold">{t('chatmode.btnDM')}</span>
          </button>
          <button
            onClick={() => onContinue('group')}
            className="nb-btn w-full py-4 flex items-center justify-center gap-2 hover:bg-black hover:text-white group"
          >
            <Users size={18} strokeWidth={2} className="group-hover:text-white text-black" />
            <span className="font-bold">{t('chatmode.btnGroup')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
