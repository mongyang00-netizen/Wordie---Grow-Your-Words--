import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface PraisePopupProps {
  isOpen: boolean;
  message: string;
  image?: string;
}

export const PraisePopup: React.FC<PraisePopupProps> = ({
  isOpen,
  message,
  image,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          {/* Subtle backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/25 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -10 }}
            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            className="relative bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-emerald-400 text-center flex flex-col items-center gap-2.5 max-w-[290px] sm:max-w-xs pointer-events-auto ring-8 ring-emerald-100/80"
          >
            {/* Wordie Character Avatar with Sparkles */}
            <div className="relative mb-1">
              {image ? (
                <img
                  src={image}
                  alt="Wordie"
                  referrerPolicy="no-referrer"
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover border-3 border-emerald-300 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border-3 border-emerald-300 shadow-md">
                  <CheckCircle2 className="w-9 h-9 sm:w-10 sm:h-10" />
                </div>
              )}
              <Sparkles className="w-7 h-7 text-amber-400 absolute -top-1.5 -right-1.5 fill-amber-400 animate-pulse drop-shadow-xs" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Fredoka']">
              Great Job! 🎉
            </h3>
            <p className="text-base sm:text-lg font-extrabold text-emerald-700 leading-snug">
              {message}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
