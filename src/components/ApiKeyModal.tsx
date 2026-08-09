import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onClose: () => void;
  onSave: (key: string) => void;
}

function detectKeyType(key: string): 'api-key' | 'oauth' | 'unknown' {
  if (!key) return 'unknown';
  if (key.startsWith('AIza') || key.startsWith('AQ.')) return 'api-key';
  if (key.startsWith('ya29.')) return 'oauth';
  return 'unknown';
}

export default function ApiKeyModal({ onClose, onSave }: Props) {
  const { t } = useLanguage();
  const [key, setKey] = useState(localStorage.getItem('gemini_api_key') ?? '');
  const [visible, setVisible] = useState(false);

  const handleSave = () => {
    if (!key.trim()) return;
    onSave(key.trim());
  };

  const keyType = detectKeyType(key.trim());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="nb-card max-w-md w-full relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-1">{t('apikey.title')}</p>
            <h3 className="font-extrabold text-xl">Gemini API Key</h3>
            <p className="text-sm text-gray-600 mt-1">{t('apikey.p1')} {t('apikey.p2')}</p>
          </div>
          <button
            onClick={onClose}
            className="border-2 border-black p-1 hover:-translate-y-px active:translate-x-[2px] active:translate-y-[2px] transition-all duration-[150ms] ease-linear"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="font-mono text-xs uppercase tracking-widest block mb-2">API KEY</label>
          <div className="flex border-2 border-black">
            <input
              id="api-key-input"
              type={visible ? 'text' : 'password'}
              className="flex-1 px-3 py-2 font-mono text-sm bg-white focus:outline-none"
              placeholder={t('apikey.placeholder')}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <button
              onClick={() => setVisible(!visible)}
              className="border-l-2 border-black px-3 hover:bg-canvas transition-colors"
            >
              {visible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Key type indicator */}
          {key.trim().length > 10 && (
            <p className="font-mono text-xs mt-2">
              {keyType === 'api-key' && <span className="text-green-700">[ OK ] Valid API key format</span>}
              {keyType === 'oauth' && <span className="text-amber-600">[ ! ] OAuth token — supported, but short-lived</span>}
              {keyType === 'unknown' && <span className="text-gray-500">[ ? ] Unrecognized format — keys usually start with AQ. or AIzaSy</span>}
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="border-2 border-black p-4 mb-4 bg-canvas">
          <p className="font-mono text-xs uppercase tracking-widest mb-2">_ HOW TO GET A KEY</p>
          <ol className="text-xs space-y-1 text-gray-700">
            <li>1. Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold">aistudio.google.com/app/apikey</a></li>
            <li>2. Click "Create API key" → "Create API key in new project"</li>
            <li>3. Copy the key (starts with <code className="font-mono bg-white border border-gray-300 px-1">AQ.</code>)</li>
          </ol>
        </div>

        {keyType === 'oauth' && (
          <div className="border-2 border-amber-600 bg-amber-50 p-3 mb-4 text-xs text-amber-800">
            <strong>Short-lived OAuth token detected.</strong> These expire in ~1 hour. Create a proper API key from AI Studio for persistent access.
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="nb-btn flex-1">{t('apikey.cancel')}</button>
          <button
            id="save-api-key-btn"
            onClick={handleSave}
            disabled={!key.trim()}
            className="nb-btn-primary flex-[2] disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-nb"
          >
            {t('apikey.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
