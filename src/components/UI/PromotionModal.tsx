import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PromotionModalProps {
  isOpen: boolean;
  color: 'w' | 'b';
  onSelect: (piece: string) => void;
}

const PIECES = [
  { type: 'q', label: 'Queen' },
  { type: 'r', label: 'Rook' },
  { type: 'b', label: 'Bishop' },
  { type: 'n', label: 'Knight' },
];

const PIECE_IMAGES: Record<string, string> = {
  'wq': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
  'wr': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
  'wb': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
  'wn': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
  'bq': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
  'br': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
  'bb': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
  'bn': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
};

export const PromotionModal: React.FC<PromotionModalProps> = ({ isOpen, color, onSelect }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-neutral-900 p-8 rounded-2xl border border-white/10 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-white mb-6 text-center">Pawn Promotion</h3>
            <div className="flex gap-4">
              {PIECES.map((piece) => (
                <button
                  key={piece.type}
                  onClick={() => onSelect(piece.type)}
                  className="group flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-neutral-800 rounded-lg group-hover:scale-110 transition-transform">
                    <img 
                      src={PIECE_IMAGES[`${color}${piece.type}`]} 
                      alt={piece.label}
                      className="w-12 h-12"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-xs font-medium text-neutral-400 group-hover:text-white transition-colors">
                    {piece.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
