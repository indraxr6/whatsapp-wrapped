import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Users } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onSelect: (mode: 'dm' | 'group') => void;
  onCancel: () => void;
}

export default function DemoChoiceModal({ onSelect, onCancel }: Props) {
  const { t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onCancel) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-canvas border-2 border-black p-6 w-full max-w-md shadow-nb-lg"
      >
        <h2 className="font-bold text-2xl mb-2">{t('demo.look_around') || 'Look Around'}</h2>
        <p className="text-sm text-gray-700 mb-6">
          {t('demo.choose_desc') || 'Choose a demo mode to see what a generated wrapped looks like.'}
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSelect('dm')}
            className="w-full nb-btn bg-white hover:bg-accent-lime p-3 text-sm border-2 border-black font-bold flex flex-col items-center justify-center text-center group"
          >
            <User size={24} className="mb-2" />
            <span>{t('demo.dm_title') || 'Personal Demo'}</span>
            <span className="font-normal text-[10px] sm:text-xs text-gray-600 mt-1 leading-tight normal-case">{t('demo.dm_desc') || 'Preview a 2-person chat'}</span>
          </button>
          
          <button
            onClick={() => onSelect('group')}
            className="w-full nb-btn bg-white hover:bg-accent-blue hover:text-white p-3 text-sm border-2 border-black font-bold flex flex-col items-center justify-center text-center group"
          >
            <Users size={24} className="mb-2" />
            <span>{t('demo.group_title') || 'Group Demo'}</span>
            <span className="font-normal text-[10px] sm:text-xs text-gray-600 group-hover:text-white/80 mt-1 leading-tight normal-case">{t('demo.group_desc') || 'Preview a group chat with history'}</span>
          </button>
        </div>

        <button
          onClick={onCancel}
          className="mt-4 w-full nb-btn py-2 text-xs border-2 border-black bg-white hover:bg-black hover:text-white normal-case"
        >
          {t('demo.cancel') || 'Cancel'}
        </button>
      </motion.div>
    </div>
  );
}
