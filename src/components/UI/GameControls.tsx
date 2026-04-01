import React from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, ChevronLeft, ChevronRight, Settings, Volume2, VolumeX, Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Difficulty, TimeControl } from '../../types/chess';

interface GameControlsProps {
  onUndo: () => void;
  onReset: () => void;
  onFlip: () => void;
  onDifficultyChange: (d: Difficulty) => void;
  difficulty: Difficulty;
  isMuted: boolean;
  onToggleMute: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  evaluation: number;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onUndo,
  onReset,
  onFlip,
  onDifficultyChange,
  difficulty,
  isMuted,
  onToggleMute,
  isDarkMode,
  onToggleDarkMode,
  evaluation
}) => {
  const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced', 'Grandmaster'];

  return (
    <div className="flex flex-col gap-8 w-full glass-panel p-8 rounded-3xl relative overflow-hidden group">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Evaluation Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Engine Analysis</span>
            <span className="text-sm font-bold text-neutral-300">Position Status</span>
          </div>
          <motion.span 
            key={evaluation}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "text-lg font-black font-mono px-3 py-1 rounded-xl border",
              evaluation > 0 
                ? "text-green-400 bg-green-500/10 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]" 
                : "text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
            )}
          >
            {evaluation > 0 ? `+${evaluation.toFixed(1)}` : evaluation.toFixed(1)}
          </motion.span>
        </div>
        <div className="h-3 w-full bg-neutral-900 rounded-2xl overflow-hidden flex p-0.5 border border-white/5 shadow-inner">
          <div className="w-full h-full relative overflow-hidden rounded-xl">
             <div className="absolute inset-0 bg-neutral-800" />
             <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 z-10" />
             <motion.div 
               animate={{ width: `${50 + (evaluation * 5)}%`, backgroundColor: evaluation > 0 ? '#ffffff' : '#4b5563' }}
               className="h-full relative z-0 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(255,255,255,0.1)]"
             />
          </div>
        </div>
      </div>

      {/* Difficulty Selector */}
      <div className="flex flex-col gap-4">
        <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Monitor size={14} /> AI Intellect
        </label>
        <div className="grid grid-cols-2 gap-2">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => onDifficultyChange(d)}
              className={cn(
                "px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300",
                difficulty === d 
                  ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-[1.02]" 
                  : "bg-white/[0.03] border border-white/5 text-neutral-500 hover:text-white hover:bg-white/[0.08]"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onUndo}
            className="glass-button flex items-center justify-center gap-3 px-4 py-4 text-white rounded-2xl group/btn"
          >
            <ChevronLeft size={20} className="group-hover/btn:-translate-x-1 transition-transform" /> 
            <span className="text-xs font-black uppercase tracking-widest">Retract</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-3 px-4 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-all duration-300 border border-red-500/20 group/btn"
          >
            <RotateCcw size={20} className="group-hover/btn:rotate-180 transition-transform duration-500" /> 
            <span className="text-xs font-black uppercase tracking-widest">Reset</span>
          </button>
        </div>

        <button
          onClick={onFlip}
          className="glass-button flex items-center justify-center gap-3 px-4 py-4 text-white rounded-2xl"
        >
          <RotateCcw size={18} className="opacity-50" />
          <span className="text-xs font-black uppercase tracking-widest">Flip Perspective</span>
        </button>
      </div>

      {/* Settings Row */}
      <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-2">
        <div className="flex gap-3">
          <button
            onClick={onToggleMute}
            className="w-12 h-12 flex items-center justify-center rounded-2xl glass-button text-neutral-400"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button
            onClick={onToggleDarkMode}
            className="w-12 h-12 flex items-center justify-center rounded-2xl glass-button text-neutral-400"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div className="flex items-center gap-3 text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
          <Settings size={14} /> Stockfish.WASM
        </div>
      </div>
    </div>
  );
};
