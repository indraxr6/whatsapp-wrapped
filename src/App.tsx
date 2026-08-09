import { useState, useCallback } from 'react';
import { parseWhatsAppExport } from './lib/parser';
import { calculateMetrics } from './lib/metrics';
import { analyzeWithGemini, generateDemoInsights } from './lib/gemini';
import type { AppView, GeminiInsights, ParsedChatMetrics } from './types/chat';
import UploadZone from './components/UploadZone';
import ApiKeyModal from './components/ApiKeyModal';
import LoadingScreen from './components/LoadingScreen';
import ResultsDashboard from './components/ResultsDashboard';
import PrivacyModal from './components/PrivacyModal';
import ShortChatModal from './components/ShortChatModal';
import ChatModeModal from './components/ChatModeModal';
import { useLanguage } from './i18n/LanguageContext';
import LanguageToggle from './components/LanguageToggle';

export default function App() {
  const [view, setView] = useState<AppView>('upload');
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [showChatModeModal, setShowChatModeModal] = useState(false);
  const [chatMode, setChatMode] = useState<'dm' | 'group'>('dm');
  const [privacyModalVariant, setPrivacyModalVariant] = useState<'auto' | 'manual' | null>(null);
  const [insightStatus, setInsightStatus] = useState<'success' | 'opt_out' | 'failed'>('success');
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ParsedChatMetrics | null>(null);
  const [insights, setInsights] = useState<GeminiInsights | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [showShortChatModal, setShowShortChatModal] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const { t, language } = useLanguage();

  const getApiKey = () => localStorage.getItem('gemini_api_key') ?? '';

  const processFile = useCallback(async (file: File, useDemo: boolean) => {
    setError(null);
    setIsDemoMode(useDemo);
    try {
      setView('analyzing');
      setLoadingStep('Reading your chat...');
      const rawText = await file.text();

      setLoadingStep('Parsing messages...');
      const { messages, unparsedLineCount } = parseWhatsAppExport(rawText);

      if (messages.length === 0) {
        throw new Error(
          'Could not find any messages in this file. Make sure you uploaded a WhatsApp exported chat (.txt).'
        );
      }

      setLoadingStep('Crunching the numbers...');
      const chatMetrics = calculateMetrics(messages);
      setMetrics(chatMetrics);

      if (unparsedLineCount > 0) {
        console.info(`[Parser] ${unparsedLineCount} lines not recognized.`);
      }

      if (chatMetrics.totalMessages < 1500) {
        setShowShortChatModal(true);
      } else {
        setShowChatModeModal(true);
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
      setView('upload');
    }
  }, []);

  const handleShortChatContinue = () => {
    setShowShortChatModal(false);
    setShowChatModeModal(true);
  };

  const handleShortChatCancel = () => {
    setShowShortChatModal(false);
    handleReset();
  };

  const handleChatModeContinue = (mode: 'dm' | 'group') => {
    setChatMode(mode);
    setShowChatModeModal(false);

    if (mode === 'dm' && metrics && metrics.participants.length > 2) {
      const sorted = [...metrics.participants].sort((a, b) => (metrics.messagesPerSender[b] ?? 0) - (metrics.messagesPerSender[a] ?? 0));
      setMetrics({
        ...metrics,
        participants: sorted.slice(0, 2)
      });
    }

    setPrivacyModalVariant('auto');
  };

  const handleChatModeCancel = () => {
    setShowChatModeModal(false);
    handleReset();
  };

  const handlePrivacyModalCancel = async () => {
    setPrivacyModalVariant(null);
    if (!metrics) return;

    setInsightStatus('opt_out');
    setLoadingStep(t('loading.demo'));
    setView('loading');
    await new Promise((r) => setTimeout(r, 600));
    setInsights(generateDemoInsights(metrics, language, chatMode));
    setView('results');
  };

  const executeAnalysis = async () => {
    setPrivacyModalVariant(null);
    if (!metrics) return;

    if (!isDemoMode) {
      setLoadingStep(t('loading.ai'));
      let geminiInsights: GeminiInsights;
      try {
        geminiInsights = await analyzeWithGemini(getApiKey(), metrics, language, chatMode);
        setInsightStatus('success');
      } catch (aiErr) {
        console.warn('[Gemini] API failed, falling back to demo insights:', aiErr);
        geminiInsights = generateDemoInsights(metrics, language, chatMode);
        setInsightStatus('failed');
        setError('AI analysis unavailable — showing generic insights. Your stats are still real.');
      }
      setInsights(geminiInsights);
    } else {
      setLoadingStep(t('loading.demo'));
      setInsightStatus('opt_out');
      await new Promise((r) => setTimeout(r, 600));
      setInsights(generateDemoInsights(metrics, language, chatMode));
    }
    setView('results');
  };

  const handleFileUpload = useCallback(async (file: File) => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setApiKeyModalOpen(true);
      return;
    }
    await processFile(file, false);
  }, [processFile]);

  const handleDemoMode = useCallback(async (file: File) => {
    await processFile(file, true);
  }, [processFile]);

  const handlePrivacyModalClose = () => {
    setPrivacyModalVariant(null);
  };

  const handleReset = () => {
    setMetrics(null);
    setInsights(null);
    setError(null);
    setView('upload');
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Short Chat Modal */}
      {showShortChatModal && metrics && (
        <ShortChatModal
          messageCount={metrics.totalMessages}
          onContinue={handleShortChatContinue}
          onCancel={handleShortChatCancel}
        />
      )}

      {/* Chat Mode Modal */}
      {showChatModeModal && metrics && (
        <ChatModeModal
          detectedMode={metrics.participants.length > 2 ? 'group' : 'dm'}
          onContinue={handleChatModeContinue}
          onCancel={handleChatModeCancel}
        />
      )}

      {/* Privacy Modal */}
      {privacyModalVariant && (
        <PrivacyModal
          onClose={handlePrivacyModalClose}
          onContinue={executeAnalysis}
          onCancel={privacyModalVariant === 'auto' ? handlePrivacyModalCancel : handlePrivacyModalClose}
          variant={privacyModalVariant}
        />
      )}

      {/* API Key Modal */}
      {apiKeyModalOpen && (
        <ApiKeyModal
          onClose={() => setApiKeyModalOpen(false)}
          onSave={(key) => {
            localStorage.setItem('gemini_api_key', key);
            setApiKeyModalOpen(false);
          }}
        />
      )}

      {view === 'upload' && (
        <UploadPage
          onFileUpload={handleFileUpload}
          onDemoMode={handleDemoMode}
          onOpenApiKey={() => setApiKeyModalOpen(true)}
          onOpenPrivacy={() => setPrivacyModalVariant('manual')}
          hasApiKey={Boolean(getApiKey())}
          error={error}
        />
      )}

      {view === 'analyzing' && (
        <LoadingScreen step={loadingStep} />
      )}

      {view === 'results' && metrics && insights && (
        <ResultsDashboard
          metrics={metrics}
          insights={insights}
          chatMode={chatMode}
          insightStatus={insightStatus}
          onRetryAI={executeAnalysis}
          onReset={handleReset}
          onOpenApiKey={() => setApiKeyModalOpen(true)}
          onOpenPrivacy={() => setPrivacyModalVariant('manual')}
        />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Upload page
// ──────────────────────────────────────────────

interface UploadPageProps {
  onFileUpload: (file: File) => void;
  onDemoMode: (file: File) => void;
  onOpenApiKey: () => void;
  onOpenPrivacy: () => void;
  hasApiKey: boolean;
  error: string | null;
}

function UploadPage({ onFileUpload, onDemoMode, onOpenApiKey, onOpenPrivacy, hasApiKey, error }: UploadPageProps) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-black px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-black bg-black flex items-center justify-center">
            <span className="font-mono text-white text-xs font-bold">_WA</span>
          </div>
          <span className="font-sans font-extrabold text-lg tracking-tight">{t('header.title')}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button onClick={onOpenPrivacy} className="nb-btn text-xs py-1.5 ml-2">
            {t('header.privacy')}
          </button>
          <button id="api-key-btn" onClick={onOpenApiKey} className="nb-btn text-xs py-1.5">
            {hasApiKey ? '[ KEY SET ]' : '[ SET API KEY ]'}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center py-16 gap-12">
        {/* Hero text */}
        <div className="content-wrapper flex flex-col items-center text-center">
          <div className="max-w-2xl w-full">
            <p className="font-mono text-xs uppercase tracking-widest mb-4">{t('hero.kicker')}</p>
            <h1 className="text-6xl sm:text-7xl font-extrabold leading-none tracking-tight mb-6">
              {t('hero.title1')}<br />{t('hero.title2')}<br />{t('hero.title3')}
            </h1>
            <p className="text-base text-gray-700 mx-auto max-w-md leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>

        {/* Upload zone */}
        <div className="content-wrapper flex justify-center">
          <div className="max-w-2xl w-full space-y-3">
            <UploadZone onFileSelected={onFileUpload} />

            {/* Demo mode */}
            <div className="flex items-center gap-2">
              <div className="flex-1 border-t-2 border-black" />
              <span className="font-mono text-xs uppercase tracking-wider text-gray-500">{t('upload.or')}</span>
              <div className="flex-1 border-t-2 border-black" />
            </div>
            <label htmlFor="demo-file-input" className="nb-btn w-full text-center py-2.5 block cursor-pointer text-sm">
              {t('upload.skipAI')}
            </label>
            <input
              id="demo-file-input"
              type="file"
              accept=".txt"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onDemoMode(f);
                e.target.value = '';
              }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="content-wrapper flex justify-center">
            <div className="max-w-2xl w-full border-2 border-black bg-accent-orange/10 p-4">
              <p className="font-mono text-xs uppercase tracking-widest text-accent-orange mb-1">{t('error.title')}</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="content-wrapper flex justify-center">
          <div className="max-w-2xl w-full">
            <p className="font-mono text-xs uppercase tracking-widest mb-4 text-center">{t('how.kicker')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-2 border-black">
              {[
                { step: '01', title: t('how.step1.title'), desc: t('how.step1.desc') },
                { step: '02', title: t('how.step2.title'), desc: t('how.step2.desc') },
                { step: '03', title: t('how.step3.title'), desc: t('how.step3.desc') },
              ].map((s, i) => (
                <div key={s.step} className={`p-5 ${i < 2 ? 'border-b-2 sm:border-b-0 sm:border-r-2 border-black' : ''}`}>
                  <p className="font-mono text-xs text-gray-400 mb-2">{s.step}</p>
                  <p className="font-bold text-sm mb-1">{s.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
