/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { ChessBoard } from './components/Board/ChessBoard';
import { GameControls } from './components/UI/GameControls';
import { MoveHistory } from './components/UI/MoveHistory';
import { PromotionModal } from './components/UI/PromotionModal';
import { useChessGame } from './hooks/useChessGame';
import { useStockfish } from './hooks/useStockfish';
import { Difficulty, TIME_CONTROLS } from './types/chess';
import { soundManager } from './lib/sounds';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Swords, User, Cpu, Timer } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const { game, gameState, makeMove, undo, reset } = useChessGame();
  const { isReady, isCalculating, evaluation, getBestMove } = useStockfish();
  
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [promotionMove, setPromotionMove] = useState<{ from: string; to: string } | null>(null);
  const [gameMode, setGameMode] = useState<'PvP' | 'PvE'>('PvE');

  // AI Move Handling
  useEffect(() => {
    if (gameMode === 'PvE' && gameState.turn === 'b' && !gameState.isCheckmate && !gameState.isDraw) {
      const timer = setTimeout(() => {
        getBestMove(gameState.fen, difficulty, (move) => {
          makeMove({
            from: move.slice(0, 2),
            to: move.slice(2, 4),
            promotion: move.length === 5 ? move[4] : undefined
          });
        });
      }, 800); // Natural delay
      return () => clearTimeout(timer);
    }
  }, [gameState.fen, gameState.turn, gameMode, difficulty, getBestMove, makeMove, gameState.isCheckmate, gameState.isDraw]);

  const handleMove = useCallback((from: string, to: string) => {
    // Check for promotion
    const piece = game.get(from as any);
    if (piece?.type === 'p' && ((piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1'))) {
      setPromotionMove({ from, to });
      return;
    }

    makeMove({ from, to });
  }, [game, makeMove]);

  const handlePromotion = (piece: string) => {
    if (promotionMove) {
      makeMove({ ...promotionMove, promotion: piece });
      setPromotionMove(null);
      soundManager.play('promote');
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundManager.setMuted(newMuted);
  };

  return (
    <div className={cn(
      "min-h-screen w-full transition-colors duration-500 flex flex-col relative overflow-hidden",
      isDarkMode ? "bg-black text-white" : "bg-[#f5f5f5] text-black"
    )}>
      {/* Background Effect */}
      <div className="mesh-gradient opacity-40 mix-blend-screen" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      {/* Header */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 lg:px-8 backdrop-blur-xl sticky top-0 z-50 bg-black/20">
        <div className="flex items-center gap-2 lg:gap-4 group">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-[10px] lg:rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <Trophy className="text-black" size={24} />
          </motion.div>
          <div className="hidden sm:block">
            <h1 className="text-lg lg:text-2xl font-black tracking-tighter uppercase italic leading-none">Grandmaster AI</h1>
            <p className="text-[8px] lg:text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-bold mt-1">Elite Chess Engine</p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-lg font-black tracking-tighter uppercase italic leading-none">GM AI</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3 lg:gap-6">
          <div className="flex bg-neutral-900/80 rounded-xl lg:rounded-2xl p-1 lg:p-1.5 border border-white/10 backdrop-blur-xl">
            <button 
              onClick={() => setGameMode('PvE')}
              className={cn(
                "flex items-center gap-1 lg:gap-2 px-3 lg:px-6 py-1.5 lg:py-2 rounded-lg lg:rounded-xl text-[10px] lg:text-xs font-black transition-all uppercase tracking-wider",
                gameMode === 'PvE' ? "bg-white text-black shadow-lg" : "text-neutral-500 hover:text-white"
              )}
            >
              <Cpu size={12} className="lg:w-[14px]" /> <span className="hidden xs:inline">AI</span>
            </button>
            <button 
              onClick={() => setGameMode('PvP')}
              className={cn(
                "flex items-center gap-1 lg:gap-2 px-3 lg:px-6 py-1.5 lg:py-2 rounded-lg lg:rounded-xl text-[10px] lg:text-xs font-black transition-all uppercase tracking-wider",
                gameMode === 'PvP' ? "bg-white text-black shadow-lg" : "text-neutral-500 hover:text-white"
              )}
            >
              <Swords size={12} className="lg:w-[14px]" /> <span className="hidden xs:inline">PvP</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col xl:flex-row items-start justify-center gap-8 p-4 lg:p-8 max-w-[1800px] mx-auto w-full">
        {/* Left Panel: Game Info & Controls */}
        <div className="flex flex-col gap-6 w-full xl:w-[380px] order-2 xl:order-1 sticky top-28">
          <div className="flex items-center justify-between glass-panel p-5 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center border border-white/5">
                <User size={24} className="text-neutral-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-0.5">Opponent</p>
                <p className="text-sm font-bold tracking-tight">{gameMode === 'PvE' ? `Stockfish LVL ${difficulty === 'Grandmaster' ? '10' : '5'}` : 'Local Rival'}</p>
              </div>
            </div>
            {isCalculating && (
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest animate-pulse bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Analyzing
              </div>
            )}
          </div>

          <GameControls 
            onUndo={undo}
            onReset={reset}
            onFlip={() => setOrientation(o => o === 'white' ? 'black' : 'white')}
            onDifficultyChange={setDifficulty}
            difficulty={difficulty}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            evaluation={evaluation}
          />
        </div>

        {/* Center: Chess Board */}
        <div className="relative order-1 xl:order-2 flex-1 flex justify-center w-full">
          <ChessBoard 
            game={game}
            onMove={handleMove}
            orientation={orientation}
            lastMove={gameState.lastMove}
          />
          
          <AnimatePresence>
            {gameState.isCheckmate && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
              >
                <div className="bg-black/80 backdrop-blur-xl px-12 py-8 rounded-3xl border border-white/20 shadow-2xl text-center">
                  <Trophy size={64} className="mx-auto mb-4 text-yellow-400" />
                  <h2 className="text-4xl font-black uppercase italic mb-2 tracking-tighter">Checkmate</h2>
                  <p className="text-neutral-400 font-medium">
                    {gameState.turn === 'w' ? 'Black' : 'White'} wins the game
                  </p>
                  <button 
                    onClick={reset}
                    className="mt-6 px-8 py-3 bg-white text-black rounded-full font-bold text-sm pointer-events-auto hover:scale-105 transition-transform"
                  >
                    Play Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel: History */}
        <div className="w-full xl:w-[400px] h-[600px] xl:h-[820px] order-3 xl:sticky xl:top-28">
          <MoveHistory history={gameState.history} />
        </div>
      </main>

      <PromotionModal 
        isOpen={!!promotionMove}
        color={gameState.turn}
        onSelect={handlePromotion}
      />

      <footer className="p-4 text-center text-[10px] text-neutral-600 font-mono uppercase tracking-[0.2em]">
        Built with Stockfish WASM & Framer Motion • 2026
      </footer>
    </div>
  );
}
