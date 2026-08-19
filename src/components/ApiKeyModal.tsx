import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onClose: () => void; // completely cancels the flow
  onContinue: (key: string) => void;
  onBack: () => void;
  variant?: 'auto' | 'manual'; // manual means user just opened it from header to edit key
}

function detectKeyType(key: string): 'api-key' | 'oauth' | 'unknown' {
  if (!key) return 'unknown';
  if (key.startsWith('AIza') || key.startsWith('AQ.')) return 'api-key';
  if (key.startsWith('ya29.')) return 'oauth';
  return 'unknown';
}

export default function ApiKeyModal({ onClose, onContinue, onBack, variant = 'auto' }: Props) {
  const { t } = useLanguage();
  const [key, setKey] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setKey(localStorage.getItem('gemini_api_key') ?? '');
  }, []);

  const handleContinue = () => {
    if (!key.trim()) return;
    onContinue(key.trim());
  };

  const keyType = detectKeyType(key.trim());

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
        className="nb-card max-w-md w-full relative"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Key size={20} strokeWidth={2} />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest">{t('apikey.title') || 'API KEY'}</span>
          </div>
          <button
            onClick={onClose}
            className="border-2 border-black p-1 hover:-translate-y-px active:translate-x-[2px] active:translate-y-[2px] transition-all duration-[150ms] ease-linear"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div>
          <h3 className="font-extrabold text-xl mb-1">Gemini API Key</h3>
          <p className="text-sm text-gray-600 mb-6">{t('apikey.p1')} {t('apikey.p2')}</p>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="font-mono text-xs uppercase tracking-widest block mb-2">API KEY</label>
          <div className="flex border-2 border-black">
            <input
              id="api-key-input"
              type={visible ? 'text' : 'password'}
              className="flex-1 px-3 py-3 font-mono text-sm bg-white focus:outline-none focus:bg-accent-lime/10 transition-colors"
              placeholder={t('apikey.placeholder') || 'AIzaSy...'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
            />
            <button
              onClick={() => setVisible(!visible)}
              className="border-l-2 border-black px-4 hover:bg-canvas transition-colors"
            >
              {visible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Key type indicator */}
          {key.trim().length > 10 && (
            <p className="font-mono text-xs mt-2">
              {keyType === 'api-key' && <span className="text-green-700">[ OK ] Valid API key format</span>}
              {keyType === 'oauth' && <span className="text-amber-600">[ ! ] OAuth token - supported, but short-lived</span>}
              {keyType === 'unknown' && <span className="text-gray-500">[ ? ] Unrecognized format</span>}
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="border-2 border-black p-4 mb-6 bg-canvas">
          <p className="font-mono text-xs uppercase tracking-widest mb-2">_ HOW TO GET A KEY</p>
          <ol className="text-xs space-y-1 text-gray-700">
            <li>1. Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold">aistudio.google.com/app/apikey</a></li>
            <li>2. Click "Create API key" → "Create API key in new project"</li>
            <li>3. Copy the key (starts with <code className="font-mono bg-white border border-gray-300 px-1">AQ.</code>)</li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleContinue}
            disabled={!key.trim() || keyType === 'unknown'}
            className="nb-btn-primary py-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {variant === 'auto' ? 'Analyze with AI' : (t('apikey.save') || 'Save Key')}
          </button>
          {variant === 'auto' && (
            <button onClick={onBack} className="nb-btn w-full py-3 text-sm">
              Go back
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
