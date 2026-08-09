import { useEffect, useRef, useState } from 'react';
import WordCloud from 'wordcloud';
import type { ParsedChatMetrics } from '../../types/chat';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  metrics: ParsedChatMetrics;
}

const ACCENT_COLORS = ['#FF5500', '#0000FF', '#00FF00', '#FFD700'];

export default function WordCloudCard({ metrics }: Props) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !metrics.topKeywords.length) return;

    // Use full width of container, multiplied by devicePixelRatio for HD
    const dpr = window.devicePixelRatio || 1;
    const width = containerRef.current.clientWidth;
    const height = 400; // Increased height since it's full width now

    canvasRef.current.width = width * dpr;
    canvasRef.current.height = height * dpr;
    
    // Scale canvas via CSS back to original dimensions
    canvasRef.current.style.width = `${width}px`;
    canvasRef.current.style.height = `${height}px`;

    const list: [string, number][] = metrics.topKeywords.map(k => [k.word, k.count]);
    
    // Normalize counts to font sizes
    const maxCount = Math.max(...list.map(w => w[1]));
    const minCount = Math.min(...list.map(w => w[1]));
    
    // Scale weights based on devicePixelRatio to maintain visual size
    const scaledList: [string, number][] = list.map(([word, count]) => {
      const weight = maxCount === minCount 
        ? 30 * dpr
        : (15 + ((count - minCount) / (maxCount - minCount)) * 45) * dpr;
      return [word, weight];
    });

    WordCloud(canvasRef.current, {
      list: scaledList,
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 'bold',
      color: () => ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
      rotateRatio: 0.5,
      minRotation: 0,
      maxRotation: Math.PI / 2, // 90 degrees
      rotationSteps: 2, // 0 and 90 degrees only
      backgroundColor: 'transparent',
      gridSize: 8 * dpr,
      shrinkToFit: true,
      drawOutOfBound: false,
    });
  }, [metrics.topKeywords, key]);

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">{t('wordcloud.title')}</p>
        <button 
          onClick={() => setKey(k => k + 1)}
          className="border-2 border-black p-1 hover:-translate-y-px active:translate-x-[2px] active:translate-y-[2px] transition-all duration-[150ms] ease-linear bg-white"
          title={t('wordcloud.reroll')}
        >
          <RefreshCw size={14} strokeWidth={2.5} />
        </button>
      </div>
      <div ref={containerRef} className="flex-1 w-full bg-white border-2 border-black overflow-hidden relative" style={{ minHeight: '400px' }}>
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>
    </div>
  );
}
