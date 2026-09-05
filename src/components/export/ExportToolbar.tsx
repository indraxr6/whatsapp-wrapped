import { useExportContext } from "../../contexts/ExportContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { Download, X, Loader2 } from "lucide-react";

interface Props {
  onExport: () => void;
}

export default function ExportToolbar({ onExport }: Props) {
  const { isSelecting, setIsSelecting, selectedSectionIds, clearSelection, isExporting } =
    useExportContext();
  const { t } = useLanguage();

  if (!isSelecting) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none flex justify-center">
      <div className="bg-white border-2 border-black shadow-nb p-4 pointer-events-auto flex items-center gap-4 max-w-xl w-full">
        <div className="flex-1">
          <p className="font-bold font-mono text-sm uppercase">
            {selectedSectionIds.length} {t("export.selected_sections") || "Sections Selected"}
          </p>
          <p className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase tracking-wide leading-tight">
            {t("export.select_instruction") || "Click a section to include it in your export"}
          </p>
        </div>

        <button
          onClick={() => {
            setIsSelecting(false);
            clearSelection();
            setTimeout(() => {
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            }, 50);
          }}
          className="nb-btn px-3 py-2 flex items-center gap-2"
        >
          <X size={16} />
          <span className="hidden sm:inline">{t("export.cancel") || "Cancel"}</span>
        </button>

        <button
          onClick={onExport}
          disabled={selectedSectionIds.length === 0 || isExporting}
          className="nb-btn-primary px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {isExporting ? (t("export.exporting") || "Exporting...") : (t("export.export_btn") || "Export")}
        </button>
      </div>
    </div>
  );
}
