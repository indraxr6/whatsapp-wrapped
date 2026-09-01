import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { parseWhatsAppExport } from './lib/parser';
import { extractChatFromZip } from './lib/zipParser';
import { calculateMetrics } from './lib/metrics';
import { analyzeWithGemini, generateDemoInsights } from './lib/gemini';
import type { AppView, GeminiInsights, ParsedChatMetrics } from './types/chat';
import UploadZone from './components/UploadZone';
import LoadingScreen from './components/LoadingScreen';
import ResultsDashboard from './components/ResultsDashboard';
import PrivacyModal from './components/PrivacyModal';
import ApiKeyModal from './components/ApiKeyModal';
import WrappedChoiceModal from './components/WrappedChoiceModal';
import ShortChatModal from './components/ShortChatModal';
import ChatModeModal from './components/ChatModeModal';
import { useLanguage } from './i18n/LanguageContext';
import LanguageToggle from './components/LanguageToggle';
import ExportTooltip from './components/ExportTooltip';
import DemoChoiceModal from './components/DemoChoiceModal';
import Footer from './components/Footer';
import { getDemoData } from './lib/demoData';

export default function App() {
  const [view, setView] = useState<AppView>('upload');
  const [showChatModeModal, setShowChatModeModal] = useState(false);
  const [chatMode, setChatMode] = useState<'dm' | 'group'>('dm');
  const [privacyModalVariant, setPrivacyModalVariant] = useState<'auto' | 'manual' | null>(null);
  const [privacyFlow, setPrivacyFlow] = useState<'upload_click' | 'file_dropped' | null>(null);
  const [uploadClickCb, setUploadClickCb] = useState<(() => void) | null>(null);
  const [apiKeyModalVariant, setApiKeyModalVariant] = useState<'auto' | 'manual' | null>(null);
  const [showWrappedChoiceModal, setShowWrappedChoiceModal] = useState(false);
  const [showDemoChoiceModal, setShowDemoChoiceModal] = useState(false);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [insightStatus, setInsightStatus] = useState<'success' | 'opt_out' | 'failed_429' | 'failed_503' | 'failed'>('success');
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ParsedChatMetrics | null>(null);
  const [insights, setInsights] = useState<GeminiInsights | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [showShortChatModal, setShowShortChatModal] = useState(false);


  const { t, language } = useLanguage();


  const processFile = useCallback(async (file: File) => {
    setError(null);
    // we don't set demo mode here anymore
    try {
      setView('analyzing');
      setLoadingStep('Reading your chat...');

      // Wait for the AnimatePresence fade transition (200ms) to finish 
      // before blocking the main thread, to avoid a white-screen stutter.
      await new Promise((resolve) => setTimeout(resolve, 250));

      let rawText = '';
      let activeFileName = file.name;

      if (file.name.endsWith('.zip') || file.type.includes('zip')) {
        setLoadingStep('Unzipping chat log...');
        const extracted = await extractChatFromZip(file);
        rawText = extracted.text;
        activeFileName = extracted.filename;
      } else {
        rawText = await file.text();
      }

      setLoadingStep('Parsing messages...');
      await new Promise((resolve) => setTimeout(resolve, 50)); // Yield to paint
      const { messages, unparsedLineCount } = parseWhatsAppExport(rawText);

      if (messages.length === 0) {
        throw new Error(
          'Could not find any messages in this file. Make sure you uploaded a WhatsApp exported chat (.txt).'
        );
      }

      setLoadingStep('Crunching the numbers...');
      await new Promise((resolve) => setTimeout(resolve, 50)); // Yield to paint
      const chatMetrics = calculateMetrics(messages, activeFileName);
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

    if (metrics) {
      let updatedParticipants = [...metrics.participants];

      if (mode === 'dm' && updatedParticipants.length > 2) {
        updatedParticipants.sort((a, b) => (metrics.messagesPerSender[b] ?? 0) - (metrics.messagesPerSender[a] ?? 0));
        updatedParticipants = updatedParticipants.slice(0, 2);
      } else if (mode === 'group' && metrics.groupName) {
        // Normalize names to strip variation selectors (like \uFE0F) that might differ between the file name and the chat content
        const normalize = (s: string) => s.replace(/[\uFE0F\u200D]/g, '').trim();
        const normalizedGroupName = normalize(metrics.groupName);
        updatedParticipants = updatedParticipants.filter(p => normalize(p) !== normalizedGroupName);
      }

      setMetrics({
        ...metrics,
        participants: updatedParticipants
      });
    }

    setShowWrappedChoiceModal(true);
  };

  const handleChatModeCancel = () => {
    setShowChatModeModal(false);
    handleReset();
  };

  // STEP 2: Api Key Modal logic
  const handleApiKeyModalContinue = (apiKey: string) => {
    localStorage.setItem('gemini_api_key', apiKey);
    setApiKeyModalVariant(null);
    if (apiKeyModalVariant === 'auto') {
      executeAnalysis(apiKey);
    }
  };

  const handleApiKeyModalBack = () => {
    setApiKeyModalVariant(null);
    if (apiKeyModalVariant === 'auto') {
      setShowWrappedChoiceModal(true);
    }
  };

  const handleApiKeyModalCancel = () => {
    setApiKeyModalVariant(null);
    handleReset();
  };

  // STEP 3: Privacy Modal logic
  const handlePrivacyModalContinue = () => {
    setPrivacyModalVariant(null);
    if (privacyModalVariant === 'auto') {
      if (privacyFlow === 'upload_click' && uploadClickCb) {
        uploadClickCb();
      } else if (privacyFlow === 'file_dropped' && activeFile) {
        processFile(activeFile);
        setPrivacyFlow(null);
      }
    }
  };

  const handlePrivacyModalCancel = () => {
    setPrivacyModalVariant(null);
    handleReset();
  };

  const executeSkip = async () => {
    if (!metrics) return;
    setInsightStatus('opt_out');
    setLoadingStep(t('loading.demo') || 'Loading local preview...');
    setView('analyzing');
    await new Promise((r) => setTimeout(r, 600));
    setInsights(generateDemoInsights(metrics, language));
    setView('results');
  };

  const executeAnalysis = async (apiKey: string) => {
    if (!metrics) return;

    setLoadingStep(t('loading.ai') || 'Generating AI insights...');
    setView('analyzing');
    let geminiInsights: GeminiInsights;
    try {
      geminiInsights = await analyzeWithGemini(apiKey, metrics, language, chatMode);
      setInsightStatus('success');
    } catch (aiErr: any) {
      console.warn('[Gemini] API failed, falling back to demo insights:', aiErr);
      geminiInsights = generateDemoInsights(metrics, language);

      if (aiErr.message?.includes('429')) {
        setInsightStatus('failed_429');
      } else if (aiErr.message?.includes('503')) {
        setInsightStatus('failed_503');
      } else {
        setInsightStatus('failed');
      }
    }
    setInsights(geminiInsights);
    setView('results');
  };

  const handleUploadClickIntent = useCallback((cb: () => void) => {
    setUploadClickCb(() => cb);
    setPrivacyModalVariant('auto');
    setPrivacyFlow('upload_click');
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    if (privacyFlow === 'upload_click') {
      // Privacy already accepted
      setPrivacyFlow(null);
      processFile(file);
    } else {
      // File dropped directly
      setActiveFile(file);
      setPrivacyModalVariant('auto');
      setPrivacyFlow('file_dropped');
    }
  }, [privacyFlow, processFile]);

  const handleChoiceAI = () => {
    setShowWrappedChoiceModal(false);
    setApiKeyModalVariant('auto');
  };

  const handleChoiceStats = () => {
    setShowWrappedChoiceModal(false);
    executeSkip();
  };

  const handleChoiceCancel = () => {
    setShowWrappedChoiceModal(false);
    handleReset();
  };

  const handlePrivacyModalClose = () => {
    setPrivacyModalVariant(null);
  };

  const handleApiKeyModalClose = () => {
    setApiKeyModalVariant(null);
  };

  const handleReset = () => {
    setMetrics(null);
    setInsights(null);
    setError(null);
    setActiveFile(null);
    setIsDemoMode(false);
    setShowWrappedChoiceModal(false);
    setView('upload');
  };

  const handleDemoSelect = (mode: 'dm' | 'group') => {
    setShowDemoChoiceModal(false);
    setIsDemoMode(true);
    setChatMode(mode);
    const { metrics: demoMetrics, insights: demoInsights } = getDemoData(mode, language);
    setMetrics(demoMetrics);
    setInsights(demoInsights);
    setInsightStatus('success');
    setView('results');
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Short Chat Modal */}
      <AnimatePresence>
        {showShortChatModal && metrics && (
          <ShortChatModal
            messageCount={metrics.totalMessages}
            onContinue={handleShortChatContinue}
            onCancel={handleShortChatCancel}
          />
        )}
      </AnimatePresence>

      {/* Chat Mode Modal */}
      <AnimatePresence>
        {showChatModeModal && metrics && (
          <ChatModeModal
            detectedMode={metrics.participants.length > 2 ? 'group' : 'dm'}
            onContinue={handleChatModeContinue}
            onCancel={handleChatModeCancel}
          />
        )}
      </AnimatePresence>

      {/* Privacy Modal */}
      <AnimatePresence>
        {privacyModalVariant && (
          <PrivacyModal
            onClose={handlePrivacyModalClose}
            onContinue={handlePrivacyModalContinue}
            onCancel={handlePrivacyModalCancel}
            variant={privacyModalVariant}
          />
        )}
      </AnimatePresence>

      {/* API Key Modal */}
      <AnimatePresence>
        {apiKeyModalVariant && (
          <ApiKeyModal
            onClose={apiKeyModalVariant === 'auto' ? handleApiKeyModalCancel : handleApiKeyModalClose}
            onContinue={apiKeyModalVariant === 'auto' ? handleApiKeyModalContinue : executeAnalysis}
            onBack={handleApiKeyModalBack}
            variant={apiKeyModalVariant}
          />
        )}
      </AnimatePresence>

      {/* Wrapped Choice Modal */}
      <AnimatePresence>
        {showWrappedChoiceModal && (
          <WrappedChoiceModal
            onSelectAI={handleChoiceAI}
            onSelectStats={handleChoiceStats}
            onCancel={handleChoiceCancel}
          />
        )}
      </AnimatePresence>

      {/* Demo Choice Modal */}
      <AnimatePresence>
        {showDemoChoiceModal && (
          <DemoChoiceModal
            onSelect={handleDemoSelect}
            onCancel={() => setShowDemoChoiceModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <UploadPage
              onFileUpload={handleFileUpload}
              onUploadClickIntent={handleUploadClickIntent}
              onOpenPrivacy={() => setPrivacyModalVariant('manual')}
              onLookAround={() => setShowDemoChoiceModal(true)}
              error={error}
            />
          </motion.div>
        )}

        {view === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <LoadingScreen step={loadingStep} />
          </motion.div>
        )}

        {view === 'results' && metrics && insights && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <ResultsDashboard
              metrics={metrics}
              insights={insights}
              chatMode={chatMode}
              insightStatus={insightStatus}
              onRetryAI={() => executeAnalysis(localStorage.getItem('gemini_api_key') || '')}
              onReset={handleReset}
              isDemoMode={isDemoMode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────
// Upload page
// ──────────────────────────────────────────────

interface UploadPageProps {
  onFileUpload: (file: File) => void;
  onUploadClickIntent?: (triggerPicker: () => void) => void;
  onOpenPrivacy: () => void;
  onLookAround: () => void;
  error: string | null;
}

function TypewriterTitle({ title1, title2, title3 }: { title1: string, title2: string, title3: string }) {
  const fullText = `${title1}\n${title2}\n${title3}`;
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!isDeleting) {
        if (displayedText.length < fullText.length) {
          setDisplayedText(fullText.slice(0, displayedText.length + 1));
          timeoutId = setTimeout(tick, 50 + Math.random() * 30); // Faster, smoother typing
        } else {
          timeoutId = setTimeout(() => setIsDeleting(true), 4000); // Pause before deleting
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(fullText.slice(0, displayedText.length - 1));
          timeoutId = setTimeout(tick, 15); // Fast smooth delete
        } else {
          timeoutId = setTimeout(() => setIsDeleting(false), 500); // Pause before re-typing
        }
      }
    };

    timeoutId = setTimeout(tick, 50);
    return () => clearTimeout(timeoutId);
  }, [displayedText, isDeleting, fullText]);

  const lines = displayedText.split('\n');
  const fullLines = fullText.split('\n');

  return (
    <div className="relative inline-block text-center mb-6">
      {/* Invisible placeholder to lock width and prevent centering wiggle */}
      <h1 className="text-6xl sm:text-7xl font-extrabold leading-none tracking-tight opacity-0 select-none pointer-events-none">
        {fullLines.map((line, i) => (
          <span key={`ph-${i}`}>
            {line}
            {i === fullLines.length - 1 && <span className="inline-block w-[0.4em] ml-1"></span>}
            {i < fullLines.length - 1 && <br />}
          </span>
        ))}
      </h1>

      {/* Actual typing text */}
      <h1 className="absolute top-0 left-0 text-6xl sm:text-7xl font-extrabold leading-none tracking-tight w-full whitespace-pre-wrap">
        {lines.map((line, i) => (
          <span key={`typ-${i}`}>
            {line}
            {i === lines.length - 1 && (
              <span className="inline-block w-[0.1em] h-[0.75em] bg-black animate-cursor-blink align-baseline ml-1"></span>
            )}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </h1>
    </div>
  );
}

function UploadPage({ onFileUpload, onUploadClickIntent, onOpenPrivacy, onLookAround, error }: UploadPageProps) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-canvas border-b-2 border-black px-3 min-[415px]:px-6 py-3 min-[415px]:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 min-[415px]:gap-3 min-w-0">
          <div className="w-7 h-7 min-[415px]:w-8 min-[415px]:h-8 border-2 border-black bg-black flex items-center justify-center shrink-0">
            <span className="font-mono text-white text-[10px] min-[415px]:text-xs font-bold">_WA</span>
          </div>
          <span className="font-sans font-extrabold text-sm min-[415px]:text-lg tracking-tight truncate whitespace-nowrap">{t('header.title')}</span>
        </div>
        <div className="flex items-center gap-1 min-[415px]:gap-2 shrink-0">
          <LanguageToggle />
          <button onClick={onOpenPrivacy} className="nb-btn text-[10px] min-[415px]:text-xs py-1 min-[415px]:py-1.5 px-2 min-[415px]:px-3 ml-1 min-[415px]:ml-2 whitespace-nowrap">
            {t('header.privacy')}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center pt-28 pb-16 gap-12">
        {/* Hero text */}
        <div className="content-wrapper flex flex-col items-center text-center">
          <div className="max-w-2xl w-full">
            <p className="font-mono text-xs uppercase tracking-widest mb-4">{t('hero.kicker')}</p>
            <TypewriterTitle title1={t('hero.title1')} title2={t('hero.title2')} title3={t('hero.title3')} />
            <p className="text-base text-gray-700 mx-auto max-w-md leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>

        {/* Upload zone */}
        <div className="content-wrapper flex justify-center">
          <div className="max-w-2xl w-full space-y-3">
            <UploadZone
              onFileSelected={onFileUpload}
              onUploadClickIntent={onUploadClickIntent}
            />

            <div className="pt-4 flex flex-col items-center">
              <button
                onClick={onLookAround}
                className="w-full sm:w-auto nb-btn bg-white hover:bg-accent-lime px-8 py-2.5 text-sm font-bold tracking-wide flex items-center justify-center gap-2"
              >
                <Eye size={18} />
                <span>{t('demo.look_around')}</span>
              </button>
            </div>
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
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-mono text-xs text-gray-400">{s.step}</p>
                    {s.step === '01' && <ExportTooltip />}
                  </div>
                  <p className="font-bold text-sm mb-1">{s.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer compact />
    </div>
  );
}
