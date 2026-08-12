import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Loader2 } from 'lucide-react';

interface Props {
  step: string;
}



export default function LoadingScreen({ step }: Props) {
  const { t } = useLanguage();
  const [factIdx, setFactIdx] = useState(0);

  const STEPS = [
    t('loading.reading'),
    t('loading.parsing'),
    t('loading.crunching'),
    t('loading.ai'),
    t('loading.demo'),
  ];

  const FUN_FACTS = [
    t('loading.fact1'),
    t('loading.fact2'),
    t('loading.fact3'),
    t('loading.fact4'),
    t('loading.fact5'),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIdx((i) => (i + 1) % FUN_FACTS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const currentStepIdx = STEPS.indexOf(step);
  const progress = currentStepIdx === -1 ? 10 : ((currentStepIdx + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6 py-16 gap-12">

      <div className="max-w-md w-full">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-3">_ ANALYZING</p>
        <h2 className="text-3xl font-extrabold mb-8 tracking-tight">{t('loading.title')}</h2>

        {/* Progress bar */}
        <div className="border-2 border-black h-4 mb-6 relative overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-black transition-all duration-[200ms] ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps list */}
        <div className="space-y-2 mb-8">
          {STEPS.map((s, i) => {
            const done = i < currentStepIdx;
            const active = i === currentStepIdx;
            const pending = i > currentStepIdx;
            return (
              <div key={s} className={`flex items-center gap-3 font-mono text-xs ${active ? 'text-black font-bold' : pending ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="w-6 flex justify-center items-center">
                  {done ? '[x]' : active ? <Loader2 size={14} className="animate-spin" /> : '   '}
                </span>
                <span className={done ? 'line-through' : ''}>{s}</span>
              </div>
            );
          })}
        </div>

        {/* Fun fact */}
        <div className="border-2 border-black p-4 bg-white">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">_ DID YOU KNOW</p>
          <p className="text-sm leading-relaxed text-gray-700">{FUN_FACTS[factIdx]}</p>
        </div>
      </div>
    </div>
  );
}
