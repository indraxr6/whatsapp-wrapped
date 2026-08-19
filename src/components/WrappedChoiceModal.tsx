import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onCancel: () => void;
  onSelectAI: () => void;
  onSelectStats: () => void;
}

export default function WrappedChoiceModal({ onCancel, onSelectAI, onSelectStats }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: 'linear' }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="nb-card max-w-md w-full relative overflow-hidden"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 z-10 border-2 border-black p-1 bg-white hover:-translate-y-px active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="p-8 sm:p-10 text-center">
          <h2 className="font-extrabold text-2xl sm:text-3xl tracking-tight mb-2 uppercase">Ready for your Wrapped?</h2>
          <p className="text-gray-600 mb-8 font-mono text-sm max-w-sm mx-auto">
            Your chat has been crunched and you will be getting your wrapped right away!
          </p>

          <div className="flex flex-col gap-6">
            <button
              onClick={onSelectStats}
              className="nb-btn-primary w-full py-4 text-lg tracking-wide uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              Show my wrapped
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 border-t-2 border-black"></div>
              <span className="font-mono text-xs font-bold uppercase text-gray-500">OR</span>
              <div className="flex-1 border-t-2 border-black"></div>
            </div>

            <button
              onClick={onSelectAI}
              className="nb-btn w-full py-3 bg-white text-sm"
            >
              Analyze with AI
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
