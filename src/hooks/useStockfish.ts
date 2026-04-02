import { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, DIFFICULTY_LEVELS } from '../types/chess';

export interface StockfishMove {
  bestMove: string;
  evaluation: number;
}

export const useStockfish = () => {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [evaluation, setEvaluation] = useState<number>(0);

  useEffect(() => {
    let worker: Worker | null = null;
    
    try {
      // Use a blob to load the script to avoid CORS issues while letting the script act as the worker
      const blob = new Blob(
        [`importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');`],
        { type: 'application/javascript' }
      );
      worker = new Worker(URL.createObjectURL(blob));

      worker.onmessage = (e) => {
        const line = e.data;
        if (typeof line !== 'string') return;
        
        if (line === 'readyok') {
          setIsReady(true);
        } else if (line.startsWith('bestmove')) {
          const move = line.split(' ')[1];
          setIsCalculating(false);
          if (onMoveCallback.current) {
            onMoveCallback.current(move);
          }
        } else if (line.includes('score cp')) {
          const parts = line.split(' ');
          const scoreIndex = parts.indexOf('cp');
          if (scoreIndex !== -1) {
            const score = parseInt(parts[scoreIndex + 1]);
            setEvaluation(score / 100);
          }
        } else if (line.includes('score mate')) {
          const parts = line.split(' ');
          const mateIndex = parts.indexOf('mate');
          if (mateIndex !== -1) {
            const mate = parseInt(parts[mateIndex + 1]);
            setEvaluation(mate > 0 ? 100 : -100);
          }
        }
      };

      worker.onerror = (err) => {
        console.error('Stockfish Worker Error:', err);
        setIsCalculating(false);
      };

      workerRef.current = worker;
      worker.postMessage('uci');
      worker.postMessage('isready');
    } catch (err) {
      console.error('Failed to initialize Stockfish worker:', err);
    }

    return () => {
      if (worker) {
        worker.terminate();
      }
    };
  }, []);

  const onMoveCallback = useRef<((move: string) => void) | null>(null);

  const getBestMove = useCallback((fen: string, difficulty: Difficulty, callback: (move: string) => void) => {
    if (!workerRef.current) return;

    onMoveCallback.current = callback;
    setIsCalculating(true);

    const { depth, skill, movetime } = DIFFICULTY_LEVELS[difficulty];
    
    workerRef.current.postMessage(`setoption name Skill Level value ${skill}`);
    workerRef.current.postMessage(`position fen ${fen}`);
    workerRef.current.postMessage(`go depth ${depth}${movetime ? ` movetime ${movetime}` : ''}`);
  }, []);

  return { isReady, isCalculating, evaluation, getBestMove };
};
