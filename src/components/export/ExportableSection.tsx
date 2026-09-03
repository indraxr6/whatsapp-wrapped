import type { ReactNode } from "react";
import { useExportContext } from "../../contexts/ExportContext";
import { Check } from "lucide-react";

interface Props {
  id: string;
  children: ReactNode;
  className?: string;
}

export default function ExportableSection({ id, children, className = "" }: Props) {
  const { isSelecting, isExporting, selectedSectionIds, toggleSelection } = useExportContext();
  const isSelected = selectedSectionIds.includes(id);

  // If we are exporting a specific selection and THIS section is not in it, hide it completely.
  if (isExporting && selectedSectionIds.length > 0 && !isSelected) {
    return null;
  }

  return (
    <div id={`export-section-${id}`} className={`relative ${className}`}>
      {/* Click-interceptor overlay for selection mode */}
      {isSelecting && !isExporting && (
        <div
          className={`absolute inset-0 z-40 cursor-pointer transition-colors ${!isSelected ? "bg-white/40" : "bg-transparent"}`}
          onClick={() => toggleSelection(id)}
        >
          <div className="absolute top-4 right-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div
              className={`w-8 h-8 border-2 border-black flex items-center justify-center transition-colors ${isSelected ? "bg-black text-white" : "bg-white text-transparent"}`}
            >
              <Check size={20} strokeWidth={4} />
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
