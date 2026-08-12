import { AlertTriangle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onContinue: () => void;
  onCancel: () => void;
  messageCount: number;
}

export default function ShortChatModal({ onContinue, onCancel, messageCount }: Props) {
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
        className="nb-card max-w-lg w-full relative"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} strokeWidth={2} />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest">{t('shortchat.title')}</span>
          </div>
          <button
            onClick={onCancel}
            className="border-2 border-black p-1 hover:-translate-y-px active:translate-x-[2px] active:translate-y-[2px] transition-all duration-[150ms] ease-linear"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            {t('shortchat.p1.pre')}<strong>{messageCount.toLocaleString()}</strong>{t('shortchat.p1.post')}
          </p>
          <p>
            {t('shortchat.p2')}
          </p>
          <p>
            {t('shortchat.p3')}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="nb-btn flex-1 py-3"
          >
            {t('shortchat.cancel')}
          </button>
          <button
            onClick={onContinue}
            className="nb-btn-primary flex-1 py-3"
          >
            {t('shortchat.continue')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
