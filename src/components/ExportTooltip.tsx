import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function ExportTooltip() {
  const [isOpen, setIsOpen] = useState(false);

  // We use onMouseEnter/onMouseLeave for desktop hover,
  // and onClick for mobile tap (toggles state).
  return (
    <div
      className="relative inline-flex items-center ml-2"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="text-gray-400 hover:text-black transition-colors focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="How to export chat walkthrough"
      >
        <HelpCircle size={18} strokeWidth={2.5} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full -right-2 md:right-auto md:left-1/2 md:-translate-x-1/2 mb-2 w-[280px] bg-white border-2 border-black shadow-[4px_4px_0_0_#000] p-2 z-50 pointer-events-none">
          <div className="relative w-full aspect-[1080/1312] bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
            {/* Lazy-loaded video (only renders when tooltip is open) */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/export-walkthrough.webm" type="video/webm" />
              <source src="/export-walkthrough.mp4" type="video/mp4" />
              {/* Fallback if video fails to load */}
              <p className="text-xs text-center text-gray-400 p-4">Video walkthrough unavailable</p>
            </video>
          </div>
          {/* Arrow pointing down */}
          <div className="absolute top-full right-[11px] md:right-auto md:left-1/2 md:-translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-black transform rotate-45 -mt-[1.5px]" />
        </div>
      )}
    </div>
  );
}
