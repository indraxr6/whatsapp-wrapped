import type { GeminiInsights, ParsedChatMetrics } from '../types/chat';
import OverviewCard from './cards/OverviewCard';
import MessageShareCard from './cards/MessageShareCard';
import MediaCard from './cards/MediaCard';
import CallMetricsCard from './cards/CallMetricsCard';
import HeatmapCard from './cards/HeatmapCard';
import WordCloudCard from './cards/WordCloudCard';
import LatencyCard from './cards/LatencyCard';
import GhostingCard from './cards/GhostingCard';
import EmojiCard from './cards/EmojiCard';
import MonthlyCard from './cards/MonthlyCard';
import SharedLinksCard from './cards/SharedLinksCard';
import PersonalityCard from './cards/PersonalityCard';
import TopicsCard from './cards/TopicsCard';
import RoastCard from './cards/RoastCard';
import MirroredPhrasesCard from './cards/MirroredPhrasesCard';
import ExcerptsCard from './cards/ExcerptsCard';
import Footer from './Footer';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from './LanguageToggle';

interface Props {
  metrics: ParsedChatMetrics;
  insights: GeminiInsights;
  chatMode: 'dm' | 'group';
  insightStatus: 'success' | 'opt_out' | 'failed' | 'failed_429' | 'failed_503';
  onRetryAI: () => void;
  onReset: () => void;
  onOpenApiKey: () => void;
  onOpenPrivacy: () => void;
}

export default function ResultsDashboard({ metrics, insights, chatMode, insightStatus, onRetryAI, onReset, onOpenApiKey, onOpenPrivacy }: Props) {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-canvas">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-canvas border-b-2 border-black px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onReset}
            className="w-8 h-8 border-2 border-black bg-black flex items-center justify-center hover:-translate-y-px active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
            title="Start Over"
          >
            <span className="font-mono text-white text-xs font-bold">_WA</span>
          </button>
          <span className="font-sans font-extrabold tracking-tight">{t('header.title')}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LanguageToggle />
          <button onClick={onOpenPrivacy} className="nb-btn text-xs py-1.5 whitespace-nowrap flex-shrink-0">{t('header.privacy')}</button>
          <button onClick={onOpenApiKey} className="nb-btn text-xs py-1.5 whitespace-nowrap flex-shrink-0">[ KEY ]</button>
          <button id="analyze-again-btn" onClick={onReset} className="nb-btn-primary text-xs py-1.5 whitespace-nowrap flex-shrink-0">
            {t('footer.cta.btn')}
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b-2 border-black px-6 py-12 bg-white">
        <div className="content-wrapper">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-3">{t('dashboard.hero.kicker', { count: metrics.totalMessages.toLocaleString() })}</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-6">
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-none tracking-tight">
              {t('dashboard.hero.title1')}<br />{t('dashboard.hero.title2')}
            </h1>
            <div className="text-left sm:text-right">
              <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-1">
                {metrics.groupName ? 'Group Name:' : 'Chat With:'}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {metrics.groupName ?? metrics.participants.join(' & ')}
              </h2>
            </div>
          </div>
          <p className="text-sm text-gray-600 font-mono">
            {metrics.dateRange.start.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US')} → {metrics.dateRange.end.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US')} · {metrics.chatDurationDays} {t('dashboard.hero.days')}
          </p>
        </div>
      </div>

      {/* Dashboard grid */}
      <div className="content-wrapper py-8 space-y-12">

        {/* Section: The Numbers */}
        <div>
          <h2 className="font-mono text-sm uppercase tracking-widest mb-4">_ {t('section.numbers')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-black">
            <div className="border-b-2 lg:border-b-0 md:border-r-2 lg:border-r-2 border-black">
              <OverviewCard metrics={metrics} />
            </div>
            <div className="border-b-2 lg:border-b-0 md:border-r-0 lg:border-r-2 border-black">
              <MessageShareCard metrics={metrics} chatMode={chatMode} />
            </div>
            <div className="border-b-2 md:border-b-0 md:border-r-2 lg:border-r-2 border-black">
              <MediaCard metrics={metrics} chatMode={chatMode} />
            </div>
            <div>
              <SharedLinksCard metrics={metrics} />
            </div>
          </div>
        </div>

        {/* Section: Calls (Conditional) */}
        {Object.values(metrics.callsInitiated).some(v => v > 0) && (
          <div>
            <h2 className="font-mono text-sm uppercase tracking-widest mb-4">{t('calls.title')}</h2>
            <div className="border-2 border-black">
              <CallMetricsCard metrics={metrics} chatMode={chatMode} />
            </div>
          </div>
        )}

        {/* Section: Monthly Trend */}
        <section>
          <SectionLabel label={t('section.monthly')} />
          <div className="border-2 border-black">
            <MonthlyCard metrics={metrics} />
          </div>
        </section>

        {/* Section: Patterns */}
        <div>
          <h2 className="font-mono text-sm uppercase tracking-widest mb-4">_ {t('section.patterns')}</h2>
          <div className={`grid grid-cols-1 ${metrics.mirroredPhrases.length > 0 ? 'lg:grid-cols-3' : ''} gap-0 border-2 border-black`}>
            <div className={`${metrics.mirroredPhrases.length > 0 ? 'lg:col-span-2 border-b-2 lg:border-b-0 lg:border-r-2' : ''} border-black`}>
              <WordCloudCard metrics={metrics} />
            </div>
            {metrics.mirroredPhrases.length > 0 && (
              <div>
                <MirroredPhrasesCard metrics={metrics} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black border-t-0">
            <div className="border-b-2 md:border-b-0 md:border-r-2 border-black">
              <HeatmapCard metrics={metrics} />
            </div>
            <div className="border-b-2 md:border-b-0 md:border-r-2 border-black">
              <LatencyCard metrics={metrics} chatMode={chatMode} />
            </div>
            <div>
              <GhostingCard metrics={metrics} chatMode={chatMode} />
            </div>
          </div>
        </div>

        {/* Section: Emoji DNA */}
        <section>
          <SectionLabel label={t('section.emoji')} />
          <div className="border-2 border-black">
            <EmojiCard metrics={metrics} chatMode={chatMode} />
          </div>
        </section>

        {/* Section: The Vibe */}
        <section>
          <SectionLabel label={t('section.vibe')} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-2 border-black">
            <div className="lg:col-span-2 border-b-2 lg:border-b-0 lg:border-r-2 border-black">
              <PersonalityCard
                insights={insights}
                insightStatus={insightStatus}
                onRetry={onRetryAI}
              />
            </div>
            <div>
              <RoastCard
                insights={insights}
                metrics={metrics}
                insightStatus={insightStatus}
                onRetry={onRetryAI}
              />
            </div>
          </div>
          {(insights.topics?.length || insights.evolution_note) ? (
            <div className="border-2 border-t-0 border-black">
              <TopicsCard insights={insights} />
            </div>
          ) : null}
          <div className="border-2 border-t-0 border-black">
            <ExcerptsCard metrics={metrics} />
          </div>
        </section>

        {/* Footer CTA */}
        <div className="border-2 border-black bg-white p-8 text-center mt-12 mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">_ DONE?</p>
          <h2 className="text-2xl font-extrabold mb-3">Analyze another chat.</h2>
          <p className="text-sm text-gray-600 mb-6">Upload a different export to compare conversations.</p>
          <button
            id="analyze-another-btn"
            onClick={onReset}
            className="nb-btn-primary px-8 py-3"
          >
            START OVER
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-0 pb-3">
      <span className="font-mono text-xs uppercase tracking-widest text-gray-500">_ {label}</span>
      <div className="flex-1 border-t-2 border-black" />
    </div>
  );
}
