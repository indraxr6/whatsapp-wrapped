import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onFileSelected: (file: File) => void;
}

export default function UploadZone({ onFileSelected }: Props) {
  const { t } = useLanguage();
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const isTxt = file.name.endsWith('.txt') || file.type === 'text/plain';
    const isZip = file.name.endsWith('.zip') || file.type === 'application/zip' || file.type === 'application/x-zip-compressed';
    if (!isTxt && !isZip) {
      alert(t('upload.error_invalid_file'));
      return;
    }
    onFileSelected(file);
  }, [onFileSelected, t]);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        id="upload-zone"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-black p-10 cursor-pointer select-none
          flex flex-col items-center justify-center gap-4
          transition-all duration-[150ms] ease-linear
          ${dragging
            ? 'bg-accent-lime shadow-nb-lg -translate-y-1'
            : 'bg-white hover:shadow-nb hover:-translate-y-px'
          }
        `}
      >
        <div className={`border-2 border-black p-4 ${dragging ? 'bg-black' : 'bg-canvas'} transition-colors duration-[150ms]`}>
          {dragging
            ? <FileText size={28} strokeWidth={2} className="text-white" />
            : <Upload size={28} strokeWidth={2} className="text-black" />
          }
        </div>

        <div className="text-center">
          <p className="font-bold text-base mb-1">
            {dragging ? t('upload.drag_active') : t('upload.drag_drop')}
          </p>
          <p className="text-sm text-gray-600">
            {t('upload.or')} <span className="underline underline-offset-2 font-semibold">{t('upload.click_browse')}</span> {t('upload.for_file')}
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-gray-500">
          <span className="border border-gray-400 px-1.5 py-0.5">iOS</span>
          <span className="border border-gray-400 px-1.5 py-0.5">Android</span>
          <span className="border border-gray-400 px-1.5 py-0.5">12h / 24h</span>
          <span className="border border-gray-400 px-1.5 py-0.5">ID / EN / ...</span>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".txt,text/plain,.zip,application/zip,application/x-zip-compressed,application/zip-compressed"
        id="file-input"
        className="hidden"
        onChange={onInputChange}
      />

      <p className="text-center mt-3 text-xs text-gray-500 font-mono">
        — processed entirely in your browser, nothing uploaded —
      </p>
    </div>
  );
}
