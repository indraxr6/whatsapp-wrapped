import { useLanguage } from '../../i18n/LanguageContext';
import type { ParsedChatMetrics } from '../../types/chat';
import {
  Music,
  Video,
  Camera,
  PlayCircle,
  Hash,
  MapPin,
  FileText,
  Table,
  MonitorPlay,
  Link2,
  HardDrive,
  Code,
  Users,
  ShoppingCart,
  Music2Icon,
} from 'lucide-react';

interface Props {
  metrics: ParsedChatMetrics;
}

const ICONS: Record<string, React.ElementType> = {
  'Spotify': Music,
  'Apple Music': Music,
  'YouTube': PlayCircle,
  'Instagram Reels': Camera,
  'Instagram Stories': Camera,
  'Instagram Profile': Camera,
  'TikTok': Music2Icon,
  'X': Hash,
  'Google Maps': MapPin,
  'Google Forms': FileText,
  'Google Sheets': Table,
  'Google Docs': FileText,
  'Google Slides': MonitorPlay,
  'Google Drive': HardDrive,
  'GitHub': Code,
  'Google Meet': Video,
  'Facebook': Users,
  'Tokopedia': ShoppingCart,
  'Other Links': Link2,
};

export default function SharedLinksCard({ metrics }: Props) {
  const { t } = useLanguage();
  const { sharedLinks } = metrics;

  // Filter only categories with > 0 links
  const activeLinks = Object.entries(sharedLinks)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  if (activeLinks.length === 0) {
    return null;
  }

  const totalShared = activeLinks.reduce((sum, [_, count]) => sum + count, 0);
  const maxCount = Math.max(...activeLinks.map(l => l[1]));

  return (
    <div className="p-6 h-full flex flex-col">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-700 mb-4">{t('links.title')}</p>

      <div className="mb-4">
        <p className="nb-stat">{totalShared.toLocaleString()}</p>
        <p className="text-sm text-gray-700 mt-1">{t('links.total')}</p>
      </div>

      <div className="space-y-3 border-t-2 border-black pt-4 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[340px]">
        {activeLinks.map(([category, count]) => {
          const Icon = ICONS[category] || Link2;
          const barPct = Math.round((count / maxCount) * 100);

          return (
            <div key={category}>
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <Icon size={14} className="text-black" />
                  <span className="font-mono uppercase font-bold text-gray-900">{category}</span>
                </div>
                <span className="font-bold">{count}</span>
              </div>
              <div className="border border-black h-2 bg-white">
                <div className="h-full bg-black" style={{ width: `${barPct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
