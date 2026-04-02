import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface PieceProps {
  type: string;
  color: string;
  square: string;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: (event: any, info: any) => void;
}

const PIECE_IMAGES: Record<string, string> = {
  'wP': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
  'wN': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
  'wB': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
  'wR': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
  'wQ': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
  'wK': 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
  'bP': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
  'bN': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
  'bB': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
  'bR': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
  'bQ': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
  'bK': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
};

export const Piece: React.FC<PieceProps> = ({ type, color, square, isDragging, onDragStart, onDragEnd }) => {
  const pieceKey = `${color}${type.toUpperCase()}`;
  const image = PIECE_IMAGES[pieceKey];

  return (
    <motion.div
      layoutId={`${color}${type}-${square}`}
      drag
      dragElastic={0.2}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: isDragging ? 1.25 : 1,
        opacity: 1,
        zIndex: isDragging ? 50 : 10,
        y: isDragging ? -12 : 0,
        filter: isDragging 
          ? "drop-shadow(0 20px 20px rgba(0,0,0,0.4))" 
          : "drop-shadow(0 4px 6px rgba(0,0,0,0.2))",
      }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.8
      }}
      className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
    >
      <img 
        src={image} 
        alt={pieceKey} 
        className={cn(
          "w-[82%] h-[82%] transition-transform duration-300",
          isDragging ? "scale-110" : "hover:scale-105"
        )}
        referrerPolicy="no-referrer"
      />
    </motion.div>
  );
};
