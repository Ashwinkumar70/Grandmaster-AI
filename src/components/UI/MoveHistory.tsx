import React from 'react';
import { motion } from 'motion/react';
import { ScrollText } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MoveHistoryProps {
  history: string[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
  const movePairs = [];
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({ white: history[i], black: history[i + 1] });
  }

  return (
    <div className="flex flex-col h-full glass-panel rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-white/5 bg-white/[0.02]">
        <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Historical Log</h3>
        <p className="text-sm font-bold text-neutral-300 mt-1">Move Sequence</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="grid grid-cols-1 gap-2">
          {movePairs.map((pair, i) => (
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              key={i} 
              className="flex items-center gap-3 glass-button p-3 rounded-xl border-white/[0.03]"
            >
              <span className="w-8 text-[10px] font-black text-neutral-600 font-mono italic">
                {(i + 1).toString().padStart(2, '0')}
              </span>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <span className="text-[10px] font-bold text-neutral-500 mr-1">W</span>
                  <span className="text-xs font-mono font-bold text-white tracking-widest">{pair.white}</span>
                </div>
                {pair.black && (
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <span className="text-[10px] font-bold text-neutral-500 mr-1">B</span>
                    <span className="text-xs font-mono font-bold text-white tracking-widest">{pair.black}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {movePairs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 opacity-20 italic">
              <p className="text-xs font-black uppercase tracking-widest">Waiting for opening move...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
