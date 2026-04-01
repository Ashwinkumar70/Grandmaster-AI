import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Chess, Square } from 'chess.js';
import { Piece } from './Piece';
import { cn } from '../../lib/utils';

interface ChessBoardProps {
  game: Chess;
  onMove: (from: string, to: string) => void;
  orientation?: 'white' | 'black';
  lastMove?: { from: string; to: string };
}

export const ChessBoard: React.FC<ChessBoardProps> = ({ game, onMove, orientation = 'white', lastMove }) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [hoveredSquare, setHoveredSquare] = useState<string | null>(null);

  const board = useMemo(() => {
    const b = game.board();
    return orientation === 'white' ? b : [...b].reverse().map(row => [...row].reverse());
  }, [game, orientation]);

  const legalMoves = useMemo(() => {
    if (!selectedSquare) return [];
    return game.moves({ square: selectedSquare as Square, verbose: true });
  }, [game, selectedSquare]);

  const handleSquareClick = (square: string) => {
    if (selectedSquare === square) {
      setSelectedSquare(null);
      return;
    }

    const move = legalMoves.find(m => m.to === square);
    if (move) {
      onMove(selectedSquare!, square);
      setSelectedSquare(null);
    } else {
      const piece = game.get(square as Square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
      } else {
        setSelectedSquare(null);
      }
    }
  };

  const getSquareName = (rowIndex: number, colIndex: number): string => {
    const files = orientation === 'white' ? 'abcdefgh' : 'hgfedcba';
    const ranks = orientation === 'white' ? '87654321' : '12345678';
    return `${files[colIndex]}${ranks[rowIndex]}`;
  };

  return (
    <div className="relative aspect-square w-full max-w-[800px] glass-panel rounded-2xl p-2 sm:p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded-lg overflow-hidden border-4 border-white/5 shadow-inner">
        {board.map((row, rowIndex) => (
          row.map((piece, colIndex) => {
            const squareName = getSquareName(rowIndex, colIndex);
            const isDark = (rowIndex + colIndex) % 2 === 1;
            const isSelected = selectedSquare === squareName;
            const isLastMove = lastMove?.from === squareName || lastMove?.to === squareName;
            const isLegalMove = legalMoves.some(m => m.to === squareName);
            const isCheck = piece?.type === 'k' && piece?.color === game.turn() && game.isCheck();

            return (
              <motion.div
                key={squareName}
                onClick={() => handleSquareClick(squareName)}
                onMouseEnter={() => setHoveredSquare(squareName)}
                onMouseLeave={() => setHoveredSquare(null)}
                className={cn(
                  "relative flex items-center justify-center transition-all duration-300 cursor-pointer",
                  isDark ? "bg-[#2a3439]" : "bg-[#e8edf0]",
                  isSelected && "bg-yellow-400/40 ring-4 ring-yellow-400/50 z-10",
                  isLastMove && "after:absolute after:inset-0 after:bg-blue-400/20",
                  isCheck && "bg-red-500/40 animate-pulse"
                )}
              >
                {/* Square Depth Effect */}
                <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.1)] pointer-events-none" />

                {/* Square Labels */}
                {colIndex === 0 && (
                  <span className={cn(
                    "absolute top-1 left-1 text-[9px] font-black select-none pointer-events-none tracking-tighter opacity-40",
                    isDark ? "text-[#e8edf0]" : "text-[#2a3439]"
                  )}>
                    {orientation === 'white' ? 8 - rowIndex : rowIndex + 1}
                  </span>
                )}
                {rowIndex === 7 && (
                  <span className={cn(
                    "absolute bottom-1 right-1 text-[9px] font-black select-none pointer-events-none uppercase opacity-40",
                    isDark ? "text-[#e8edf0]" : "text-[#2a3439]"
                  )}>
                    {orientation === 'white' ? 'abcdefgh'[colIndex] : 'hgfedcba'[colIndex]}
                  </span>
                )}

                {/* Legal Move Indicators */}
                {isLegalMove && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "absolute z-20 rounded-full",
                      piece 
                        ? "w-full h-full border-[6px] border-black/5" 
                        : "w-4 h-4 bg-black/10 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                    )} 
                  />
                )}

                {/* Piece */}
                <AnimatePresence mode="popLayout">
                  {piece && (
                    <Piece
                      key={`${piece.color}${piece.type}-${squareName}`}
                      type={piece.type}
                      color={piece.color}
                      square={squareName}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ))}
      </div>
    </div>
  );
};
