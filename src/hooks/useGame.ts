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
  distractorSymbolIndices: number[]; // indices into BOPOMOFO for the 4 option blocks (match & mine)
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

  // Mine stage: player tapped a block.
  // Each block is carved with a symbol (distractorSymbolIndices); the correct
  // one is the block whose symbol matches the current target. Tapping the
  // correct block mines it (3 taps → break → advance); a wrong block costs a heart.
  const handleMineTap = useCallback(
    (blockIndex: number): 'cracked' | 'broken_correct' | 'wrong' => {
      let result: 'cracked' | 'broken_correct' | 'wrong' = 'cracked';

      setState((prev) => {
        const tappedBopomofoIdx = prev.distractorSymbolIndices[blockIndex];
        const isCorrectBlock = tappedBopomofoIdx === currentBopomofoIdx;

        if (!isCorrectBlock) {
          result = 'wrong';
          return {
            ...prev,
            hearts: prev.hearts - 1,
            isPerfect: false,
          };
        }

        const newCracks = [...prev.crackLevels] as [number, number, number, number];
        newCracks[blockIndex] = Math.min(3, newCracks[blockIndex] + 1);

        // Correct block fully mined. Don't advance here — let the shatter
        // animation play first; GameScreen calls advanceMineSymbol() afterwards.
        result = newCracks[blockIndex] >= 3 ? 'broken_correct' : 'cracked';
        return { ...prev, crackLevels: newCracks };
      });

      return result;
    },
    [currentBopomofoIdx]
  );

  // Called after the broken-block animation finishes, to move to the next symbol.
  const advanceMineSymbol = useCallback(() => {
    setState((prev) => {
      const next = prev.currentSymbolIdx + 1;
      const newDistractors = next < symbolCount ? reshuffleDistractors(next) : [];
      return {
        ...prev,
        xp: Math.min(100, prev.xp + Math.floor(100 / symbolCount)),
        currentSymbolIdx: next,
        crackLevels: [0, 0, 0, 0],
        distractorSymbolIndices: newDistractors,
      };
    });
  }, [symbolCount, reshuffleDistractors]);

  const isMatchDone = state.currentSymbolIdx >= symbolCount && state.stage === 'match';
  const isMineDone = state.currentSymbolIdx >= symbolCount && state.stage === 'mine';
  const isGameOver = state.hearts <= 0;

  const startMineStage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      stage: 'mine',
      currentSymbolIdx: 0,
      crackLevels: [0, 0, 0, 0],
      distractorSymbolIndices: reshuffleDistractors(0),
    }));
  }, [reshuffleDistractors]);

  return {
    state,
    currentSymbol,
    currentBopomofoIdx,
    isMatchDone,
    isMineDone,
    isGameOver,
    handleMatchTap,
    handleMineTap,
    advanceMineSymbol,
    startMineStage,
  };
}
