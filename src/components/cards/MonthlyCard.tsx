import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { ParsedChatMetrics } from '../../types/chat';

interface Props {
  metrics: ParsedChatMetrics;
}

import { useLanguage } from '../../i18n/LanguageContext';

export default function MonthlyCard({ metrics }: Props) {
  const { t, language } = useLanguage();
  const { monthlyMessageCounts, peakMonth } = metrics;

  function formatMonth(monthStr: string): string {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { month: 'short', year: 'numeric' });
  }

  const data = monthlyMessageCounts.map((m) => ({
    month: formatMonth(m.month),
    count: m.count,
    raw: m.month,
  }));

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-1">{t('monthly.title')}</p>
          <p className="text-sm text-gray-600">{monthlyMessageCounts.length} {t('monthly.monthsOfData')}</p>
        </div>
        <div className="text-right border-2 border-black p-3">
          <p className="font-mono text-xs uppercase tracking-widest text-gray-500">{t('monthly.peak')}</p>
          <p className="font-extrabold text-lg">{formatMonth(peakMonth.month)}</p>
          <p className="font-mono text-xs">{peakMonth.count.toLocaleString()} {t('monthly.messages')}</p>
        </div>
      </div>

      <div className="h-48 border-b-2 border-black">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 9, fontFamily: 'IBM Plex Mono', fill: '#888' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                border: '2px solid #000',
                borderRadius: 0,
                boxShadow: '3px 3px 0 #000',
                fontFamily: 'IBM Plex Mono',
                fontSize: 12,
                background: '#fff',
              }}
              formatter={(value: number) => [value.toLocaleString(), 'messages']}
            />
            <ReferenceLine
              x={formatMonth(peakMonth.month)}
              stroke="#0000FF"
              strokeWidth={2}
              strokeDasharray="4 2"
            />
            <Line
              type="linear"
              dataKey="count"
              stroke="#000000"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#000', stroke: '#000' }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
