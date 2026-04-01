import { useState, useCallback, useMemo, useEffect } from 'react';
import { Chess, Move } from 'chess.js';
import { GameState, Difficulty } from '../types/chess';
import { soundManager } from '../lib/sounds';
import confetti from 'canvas-confetti';

export const useChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | undefined>();

  const updateGameState = useCallback((newGame: Chess) => {
    setGame(new Chess(newGame.fen()));
    setMoveHistory(newGame.history());
    
    if (newGame.isCheckmate()) {
      soundManager.play('gameEnd');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#facc15', '#eab308', '#ffffff']
      });
    } else if (newGame.isCheck()) {
      soundManager.play('check');
    }
  }, []);

  const makeMove = useCallback((move: string | { from: string; to: string; promotion?: string }) => {
    try {
      const result = game.move(move);
      if (result) {
        if (result.captured) {
          soundManager.play('capture');
        } else if (result.flags.includes('k') || result.flags.includes('q')) {
          soundManager.play('castle');
        } else {
          soundManager.play('move');
        }
        
        setLastMove({ from: result.from, to: result.to });
        updateGameState(game);
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }, [game, updateGameState]);

  const undo = useCallback(() => {
    game.undo();
    setLastMove(undefined);
    updateGameState(game);
  }, [game, updateGameState]);

  const reset = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    setLastMove(undefined);
    setMoveHistory([]);
    updateGameState(newGame);
  }, [updateGameState]);

  const gameState: GameState = useMemo(() => ({
    fen: game.fen(),
    turn: game.turn(),
    isCheck: game.isCheck(),
    isCheckmate: game.isCheckmate(),
    isDraw: game.isDraw(),
    isStalemate: game.isStalemate(),
    isThreefoldRepetition: game.isThreefoldRepetition(),
    history: moveHistory,
    lastMove,
  }), [game, moveHistory, lastMove]);

  return {
    game,
    gameState,
    makeMove,
    undo,
    reset,
    setGame
  };
};
