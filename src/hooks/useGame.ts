import { useCallback, useMemo, useState } from 'react';
import { BOPOMOFO } from '../data/bopomofo';
import { Level } from '../data/levels';

export type GameStage = 'match' | 'mine';

export type GameState = {
  hearts: number;
  xp: number; // 0–100
  currentSymbolIdx: number; // 0–(symbols.length-1)
  isPerfect: boolean;
  stage: GameStage;
  // mine stage crack tracking [blockIdx] → 0|1|2|3
  crackLevels: [number, number, number, number];
  correctBlockIndex: number; // which of the 4 blocks hides the correct answer
  distractorSymbolIndices: number[]; // indices into BOPOMOFO for the 4 option blocks
};

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDistractors(level: Level, currentBopomofoIdx: number): number[] {
  // Use the other symbols in this level as distractors
  const pool = level.symbolIndices.filter((i) => i !== currentBopomofoIdx);
  // If fewer than 3, pad with random symbols
  while (pool.length < 3) {
    const rand = Math.floor(Math.random() * BOPOMOFO.length);
    if (!pool.includes(rand) && rand !== currentBopomofoIdx) pool.push(rand);
  }
  const distractors = pool.slice(0, 3);
  // Shuffle the 4 options and return [correct + 3 distractors] shuffled
  return shuffleArray([currentBopomofoIdx, ...distractors]);
}

export function useGame(level: Level, initialStage: GameStage = 'match') {
  const symbolCount = level.symbolIndices.length;

  const initialState = (): GameState => ({
    hearts: 3,
    xp: 0,
    currentSymbolIdx: 0,
    isPerfect: true,
    stage: initialStage,
    crackLevels: [0, 0, 0, 0],
    correctBlockIndex: Math.floor(Math.random() * 4),
    distractorSymbolIndices: buildDistractors(level, level.symbolIndices[0]),
  });

  const [state, setState] = useState<GameState>(initialState);

  const currentBopomofoIdx = level.symbolIndices[state.currentSymbolIdx];
  const currentSymbol = BOPOMOFO[currentBopomofoIdx];

  const reshuffleDistractors = useCallback((symIdx: number) => {
    const bopoIdx = level.symbolIndices[symIdx];
    return buildDistractors(level, bopoIdx);
  }, [level]);

  // Match stage: player tapped a block
  const handleMatchTap = useCallback(
    (tappedBopomofoIdx: number): 'correct' | 'wrong' => {
      const correct = tappedBopomofoIdx === currentBopomofoIdx;

      if (correct) {
        setState((prev) => {
          const next = prev.currentSymbolIdx + 1;
          const newDistractors = next < symbolCount ? reshuffleDistractors(next) : [];
          return {
            ...prev,
            xp: Math.min(100, prev.xp + Math.floor(100 / symbolCount)),
            currentSymbolIdx: next,
            distractorSymbolIndices: newDistractors,
          };
        });
      } else {
        setState((prev) => ({
          ...prev,
          hearts: prev.hearts - 1,
          isPerfect: false,
          // Re-shuffle positions to prevent memorisation
          distractorSymbolIndices: reshuffleDistractors(prev.currentSymbolIdx),
        }));
      }

      return correct ? 'correct' : 'wrong';
    },
    [currentBopomofoIdx, symbolCount, reshuffleDistractors]
  );

  // Mine stage: player tapped a block
  const handleMineTap = useCallback(
    (blockIndex: number): 'cracked' | 'broken_correct' | 'broken_wrong' => {
      let result: 'cracked' | 'broken_correct' | 'broken_wrong' = 'cracked';

      setState((prev) => {
        const newCracks = [...prev.crackLevels] as [number, number, number, number];
        newCracks[blockIndex] = Math.min(3, newCracks[blockIndex] + 1);

        if (newCracks[blockIndex] < 3) {
          return { ...prev, crackLevels: newCracks };
        }

        // Block broken
        const isCorrectBlock = blockIndex === prev.correctBlockIndex;
        if (isCorrectBlock) {
          result = 'broken_correct';
          const next = prev.currentSymbolIdx + 1;
          const newCorrectBlock = Math.floor(Math.random() * 4);
          const newDistractors = next < symbolCount ? reshuffleDistractors(next) : [];
          return {
            ...prev,
            xp: Math.min(100, prev.xp + Math.floor(100 / symbolCount)),
            currentSymbolIdx: next,
            crackLevels: [0, 0, 0, 0],
            correctBlockIndex: newCorrectBlock,
            distractorSymbolIndices: newDistractors,
          };
        } else {
          result = 'broken_wrong';
          // Respawn the wrong block (reset its crack)
          newCracks[blockIndex] = 0;
          return {
            ...prev,
            hearts: prev.hearts - 1,
            isPerfect: false,
            crackLevels: newCracks,
          };
        }
      });

      return result;
    },
    [symbolCount, reshuffleDistractors]
  );

  const isMatchDone = state.currentSymbolIdx >= symbolCount && state.stage === 'match';
  const isMineDone = state.currentSymbolIdx >= symbolCount && state.stage === 'mine';
  const isGameOver = state.hearts <= 0;

  const startMineStage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      stage: 'mine',
      currentSymbolIdx: 0,
      crackLevels: [0, 0, 0, 0],
      correctBlockIndex: Math.floor(Math.random() * 4),
      distractorSymbolIndices: reshuffleDistractors(0),
    }));
  }, [reshuffleDistractors]);

  return {
    state,
    currentSymbol,
    isMatchDone,
    isMineDone,
    isGameOver,
    handleMatchTap,
    handleMineTap,
    startMineStage,
  };
}
