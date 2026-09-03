import { useLanguage } from "../../i18n/LanguageContext";
import type { ParsedChatMetrics } from "../../types/chat";
import { Layers } from "lucide-react";
import { formatParticipantPhrase } from "../../utils/pluralize";

interface Props {
  metrics: ParsedChatMetrics;
}

export default function MirroredPhrasesCard({ metrics }: Props) {
  const { t } = useLanguage();
  const phrases = metrics.mirroredPhrases.slice(0, 5);
  const totalPings = Object.values(metrics.pingCount || {}).reduce((a, b) => a + b, 0);

  if (phrases.length === 0 && totalPings === 0) return null;

  return (
    <div className="p-6 h-full bg-white">
      <div className="flex items-center gap-2 mb-4">
        <Layers size={16} className="text-gray-500" />
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
          {t("mirrored.title")}
        </p>
      </div>

      {phrases.length > 0 && (
        <p className="text-xs text-gray-500 mb-4">
          {formatParticipantPhrase(
            metrics.participants.length,
            t("mirrored.desc") || "",
            t("mirrored.desc.plural") || "",
          )}
        </p>
      )}

      <div className="space-y-3">
        {phrases.map((p, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="font-semibold text-sm truncate pr-4">"{p.phrase}"</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{p.count}x</span>
          </div>
        ))}
        {totalPings > 0 && (
          <div
            className={`${phrases.length > 0 ? "pt-4 mt-4 border-t-2 border-gray-100" : ""}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 flex items-center justify-center bg-black text-white font-bold rounded-sm text-xs">
                P
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
                {t("mirrored.pingTitle")}
              </p>
            </div>

            <p className="text-xs text-gray-400 mb-4">{t("mirrored.pingDesc")}</p>

            <div className="space-y-2">
              {Object.entries(metrics.pingCount || {})
                .filter(([_, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([sender, count], idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="font-semibold text-sm truncate pr-4">{sender}</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {count}x
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
