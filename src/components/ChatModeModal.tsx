import { Users, User, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  detectedMode: 'dm' | 'group';
  onContinue: (mode: 'dm' | 'group') => void;
  onCancel: () => void;
}

export default function ChatModeModal({ detectedMode, onContinue, onCancel }: Props) {
  const { t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: 'linear' }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="nb-card max-w-md w-full relative bg-canvas"
      >
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
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onContinue('dm')}
            className="w-full nb-btn bg-white hover:bg-accent-lime p-4 text-sm border-2 border-black font-bold flex flex-col items-center justify-center text-center group"
          >
            <User size={24} strokeWidth={2} className="mb-2 text-black" />
            <span>{t('chatmode.btnDM')}</span>
            <span className="font-normal text-[10px] sm:text-xs text-gray-600 mt-1 leading-tight">{t('chatmode.btnDMDesc') as string}</span>
          </button>
          
          <button
            onClick={() => onContinue('group')}
            className="w-full nb-btn bg-white hover:bg-accent-blue hover:text-white p-4 text-sm border-2 border-black font-bold flex flex-col items-center justify-center text-center group"
          >
            <Users size={24} strokeWidth={2} className="mb-2 group-hover:text-white text-black" />
            <span>{t('chatmode.btnGroup')}</span>
            <span className="font-normal text-[10px] sm:text-xs text-gray-600 group-hover:text-white/80 mt-1 leading-tight">{t('chatmode.btnGroupDesc') as string}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
