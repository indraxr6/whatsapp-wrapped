import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import type { ParsedChatMetrics } from '../../types/chat';

interface Props {
  metrics: ParsedChatMetrics;
}

const HOUR_LABELS_AXIS = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', 
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

function getHourCallout(hour: number): string {
  if (hour === 0) return '12 midnight';
  if (hour === 12) return '12 noon';
  if (hour < 12) return `${hour} in the morning`;
  if (hour < 17) return `${hour - 12} in the afternoon`;
  if (hour < 20) return `${hour - 12} in the evening`;
  return `${hour - 12} at night`;
}

export default function HeatmapCard({ metrics }: Props) {
  const { hourlyHeatmap } = metrics;
  const max = Math.max(...hourlyHeatmap, 1);
  const peakHour = hourlyHeatmap.indexOf(max);

  const data = hourlyHeatmap.map((count, hour) => ({ hour: HOUR_LABELS_AXIS[hour], count }));

  return (
    <div className="p-6 h-full">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">_ ACTIVE HOURS</p>

      <div className="mb-4">
        <p className="nb-stat-sm">{getHourCallout(peakHour)}</p>
        <p className="text-xs text-gray-500 mt-1">peak activity time</p>
      </div>

      <div className="h-28 border-b-2 border-black mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="2%">
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 8, fontFamily: 'IBM Plex Mono', fill: '#888' }}
              axisLine={false}
              tickLine={false}
              interval={5}
            />
            <Bar dataKey="count" radius={0} isAnimationActive={false}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === peakHour ? '#0000FF' : '#000000'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="font-mono text-xs text-gray-500">
        {hourlyHeatmap[peakHour].toLocaleString()} messages around {HOUR_LABELS_AXIS[peakHour]}
      </p>
    </div>
  );
}
