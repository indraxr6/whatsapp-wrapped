import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface ExportContextType {
  isExporting: boolean;
  setIsExporting: (val: boolean) => void;
  isSelecting: boolean;
  setIsSelecting: (val: boolean) => void;
  selectedSectionIds: string[];
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
}

const ExportContext = createContext<ExportContextType | undefined>(undefined);

export function ExportProvider({ children }: { children: ReactNode }) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedSectionIds((prev) =>
      prev.includes(id) ? prev.filter((secId) => secId !== id) : [...prev, id],
    );
  };

  const clearSelection = () => {
    setSelectedSectionIds([]);
  };

  return (
    <ExportContext.Provider
      value={{
        isExporting,
        setIsExporting,
        isSelecting,
        setIsSelecting,
        selectedSectionIds,
        toggleSelection,
        clearSelection,
      }}
    >
      {children}
    </ExportContext.Provider>
  );
}

export function useExportContext() {
  const context = useContext(ExportContext);
  if (context === undefined) {
    throw new Error("useExportContext must be used within an ExportProvider");
  }
  return context;
}
