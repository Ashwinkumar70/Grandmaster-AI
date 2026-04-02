/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chess, Move } from 'chess.js';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Grandmaster';

export interface GameState {
  fen: string;
  turn: 'w' | 'b';
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  isStalemate: boolean;
  isThreefoldRepetition: boolean;
  history: string[];
  lastMove?: { from: string; to: string };
}

export interface TimeControl {
  name: string;
  minutes: number;
  increment: number;
}

export const TIME_CONTROLS: TimeControl[] = [
  { name: 'Bullet', minutes: 1, increment: 0 },
  { name: 'Blitz', minutes: 3, increment: 2 },
  { name: 'Rapid', minutes: 10, increment: 5 },
  { name: 'Classical', minutes: 30, increment: 0 },
];

export const DIFFICULTY_LEVELS: Record<Difficulty, { depth: number; skill: number; movetime?: number }> = {
  'Beginner': { depth: 2, skill: 0, movetime: 500 },
  'Intermediate': { depth: 8, skill: 5, movetime: 1500 },
  'Advanced': { depth: 12, skill: 15, movetime: 3000 },
  'Grandmaster': { depth: 20, skill: 20, movetime: 5000 },
};
