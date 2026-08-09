import { Shield, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from './LanguageToggle';

interface Props {
  onClose?: () => void;
  onContinue?: () => void;
  onCancel?: () => void;
  variant?: 'auto' | 'manual'; // auto = after upload, manual = user clicked button
}

export default function PrivacyModal({ onClose, onContinue, onCancel, variant = 'manual' }: Props) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="nb-card max-w-lg w-full relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield size={20} strokeWidth={2} />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest">{t('privacy.title')}</span>
          </div>
          <button
            onClick={variant === 'auto' ? onCancel : onClose}
            className="border-2 border-black p-1 hover:-translate-y-px active:translate-x-[2px] active:translate-y-[2px] transition-all duration-[150ms] ease-linear"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm leading-relaxed">
          <p dangerouslySetInnerHTML={{ __html: t('privacy.p1').replace(/<bold>/g, '<strong>').replace(/<\/bold>/g, '</strong>') }} />
          <p dangerouslySetInnerHTML={{ __html: t('privacy.p2').replace(/<bold>/g, '<strong>').replace(/<\/bold>/g, '</strong>') }} />
          <p>{t('privacy.p3')}</p>

          <div className="mt-4 p-3 border-2 border-black bg-accent-blue/10 flex items-center justify-between">
            <span className="font-bold text-sm">{t('privacy.chooseLanguage')}</span>
            <LanguageToggle />
          </div>

          <div className="border-t-2 border-black pt-4 mt-4">
            <p className="font-mono text-xs uppercase tracking-widest text-gray-500">{t('privacy.tech.title')}</p>
            <ul className="mt-2 space-y-1 text-xs text-gray-700">
              <li>{t('privacy.tech.1')}</li>
              <li>{t('privacy.tech.2')}</li>
              <li>{t('privacy.tech.3')}</li>
              <li>{t('privacy.tech.4')}</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6">
          {variant === 'auto' ? (
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="nb-btn flex-1 py-3"
              >
                {t('privacy.cancel')}
              </button>
              <button
                onClick={onContinue}
                className="nb-btn-primary flex-[2] py-3"
              >
                {t('privacy.continue')}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="nb-btn w-full text-center py-3"
            >
              {t('privacy.close')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
