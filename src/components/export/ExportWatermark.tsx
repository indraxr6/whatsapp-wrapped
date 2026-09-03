export default function ExportWatermark() {
  return (
    <div
      className="absolute bottom-4 right-4 pointer-events-none opacity-80"
      data-export-watermark
    >
      <div className="flex items-center gap-2 bg-white/90 border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <img src="/favicon.svg" alt="" className="w-5 h-5 object-contain" />
        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-black leading-none pt-0.5">
          WhatsApp Wrapped <span className="font-normal lowercase">by indra w.</span>
        </p>
      </div>
    </div>
  );
}
