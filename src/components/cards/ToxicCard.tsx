import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import type { ParsedChatMetrics } from "../../types/chat";
import { Flame } from "lucide-react";
import { formatParticipantPhrase } from "../../utils/pluralize";

interface Props {
  metrics: ParsedChatMetrics;
}

export default function ToxicCard({ metrics }: Props) {
  const { t } = useLanguage();
  const [isRevealed, setIsRevealed] = useState(false);

  const totalSlurs = Object.values(metrics.slurCount || {}).reduce((a, b) => a + b, 0);

  if (totalSlurs === 0) return null;

  return (
    <div className="p-6 h-full bg-white flex flex-col relative group overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Flame size={16} className="text-red-500" />
        <p className="font-mono text-xs uppercase tracking-widest text-red-500 font-bold">
          {t("toxic.title")}
        </p>
      </div>

      <p className="text-xs text-gray-500 mb-6">
        {formatParticipantPhrase(
          metrics.participants.length,
          t("toxic.desc") || "",
          t("toxic.desc.plural") || "",
        )}
      </p>

      <div className="space-y-3 mb-6 flex-1">
        {Object.entries(metrics.slurCount || {})
          .filter(([_, count]) => count > 0)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([sender, count], idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="font-semibold text-sm truncate pr-4">{sender}</span>
              <span className="font-mono text-xs bg-red-50 text-red-700 font-bold px-2 py-1 rounded">
                {count}x
              </span>
            </div>
          ))}
      </div>

      {metrics.topSlurs && metrics.topSlurs.length > 0 && (
        <div className="pt-4 border-t-2 border-red-100">
          <button
            onClick={() => setIsRevealed(!isRevealed)}
            className="w-full text-center text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors mb-3 outline-none"
            data-export-exclude="true"
          >
            {isRevealed ? t("toxic.hidden") : t("toxic.reveal")}
          </button>

          <div className="flex flex-wrap gap-2 justify-center">
            {metrics.topSlurs.map((slur, i) => (
              <div
                key={i}
                className="relative group/word cursor-pointer"
                onClick={() => setIsRevealed(true)}
              >
                <div
                  className={`px-3 py-1.5 border-2 border-black font-bold tracking-wider text-sm bg-red-50 transition-all duration-200 ${isRevealed
                    ? "opacity-100 filter-none"
                    : "opacity-10 blur-md group-hover/word:blur-none group-hover/word:opacity-100"
                    }`}
                >
                  {slur.word}
                </div>
                {!isRevealed && (
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold pointer-events-none opacity-100 group-hover/word:opacity-0 transition-opacity">
                    [C*NSRD]
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
