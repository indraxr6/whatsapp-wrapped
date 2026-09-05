import { useExportContext } from "../../contexts/ExportContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { exportDashboardToPng } from "../../utils/exportUtils";
import { Download, CheckSquare, Loader2 } from "lucide-react";

export default function ExportMenu() {
  const { setIsSelecting, setIsExporting, isSelecting, isExporting } = useExportContext();
  const { t } = useLanguage();

  const handleExportEverything = async () => {
    setIsExporting(true);
    // Give state a moment to flush and re-render sections without whileInView
    setTimeout(async () => {
      const dashboardNode = document.getElementById("dashboard-export-root");
      if (dashboardNode) {
        await exportDashboardToPng(dashboardNode, "whatsapp-wrapped-full.png");
      }
      setIsExporting(false);
    }, 300);
  };

  const handleToggleSelecting = () => {
    const newValue = !isSelecting;
    setIsSelecting(newValue);
    if (newValue) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggleSelecting}
        className={`nb-btn flex items-center gap-1.5 text-[10px] min-[415px]:text-xs py-1 min-[415px]:py-1.5 px-2 min-[415px]:px-3 ${isSelecting ? "bg-black text-white" : ""}`}
        title={t("export.choose_sections") || "Choose Sections"}
      >
        <CheckSquare size={14} />
        <span className="hidden sm:inline">
          {t("export.choose_sections") || "Choose Sections"}
        </span>
      </button>
      <button
        onClick={handleExportEverything}
        disabled={isExporting}
        className="nb-btn-primary flex items-center gap-1.5 text-[10px] min-[415px]:text-xs py-1 min-[415px]:py-1.5 px-2 min-[415px]:px-3 disabled:opacity-50 disabled:cursor-not-allowed"
        title={t("export.export_all") || "Export Everything"}
      >
        {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        <span className="hidden sm:inline">
          {isExporting ? (t("export.exporting") || "Exporting...") : (t("export.export_all") || "Export All")}
        </span>
      </button>
    </div>
  );
}
