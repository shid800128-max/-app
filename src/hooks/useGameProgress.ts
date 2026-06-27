import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LEVELS } from '../data/levels';

export type LevelStatus = 'locked' | 'available' | 'completed' | 'perfect';

export type LevelProgress = {
  status: LevelStatus;
  stars: number;
  completedAt?: number;
};

export type GameProgress = {
  version: number;
  levels: Record<number, LevelProgress>;
  totalDiamonds: number;
};

const STORAGE_KEY = '@bopomofo_progress';
const SCHEMA_VERSION = 1;

function defaultProgress(): GameProgress {
  const levels: Record<number, LevelProgress> = {};
  LEVELS.forEach((l) => {
    levels[l.id] = {
      status: l.unlockRequirement === 0 ? 'available' : 'locked',
      stars: 0,
    };
  });
  return { version: SCHEMA_VERSION, levels, totalDiamonds: 0 };
}

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pendingUpdate = useRef<((p: GameProgress) => GameProgress) | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const loaded: GameProgress = raw ? JSON.parse(raw) : defaultProgress();
        // Run any pending update that arrived before load finished
        const final = pendingUpdate.current ? pendingUpdate.current(loaded) : loaded;
        pendingUpdate.current = null;
        setProgress(final);
      } catch {
        setProgress(defaultProgress());
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const save = useCallback(async (next: GameProgress) => {
    setProgress(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // silently ignore storage errors
    }
  }, []);

  const completeLevel = useCallback(
    async (levelId: number, heartsRemaining: number, isPerfect: boolean) => {
      const stars = heartsRemaining >= 3 ? 3 : heartsRemaining >= 2 ? 2 : 1;
      const status: LevelStatus = isPerfect ? 'perfect' : 'completed';

      const applyUpdate = (p: GameProgress): GameProgress => {
        const next = { ...p, levels: { ...p.levels } };
        const prev = next.levels[levelId] ?? { status: 'available', stars: 0 };
        next.levels[levelId] = {
          status: prev.stars >= stars ? prev.status : status,
          stars: Math.max(prev.stars, stars),
          completedAt: Date.now(),
        };
        if (isPerfect) {
          next.totalDiamonds = (next.totalDiamonds ?? 0) + 1;
        }
        // Unlock next level
        const nextLevel = LEVELS.find((l) => l.unlockRequirement === levelId);
        if (nextLevel && next.levels[nextLevel.id]?.status === 'locked') {
          next.levels[nextLevel.id] = { status: 'available', stars: 0 };
        }
        return next;
      };

      if (!progress) {
        pendingUpdate.current = applyUpdate;
        return;
      }
      await save(applyUpdate(progress));
    },
    [progress, save]
  );

  const isLevelUnlocked = useCallback(
    (levelId: number): boolean => {
      if (!progress) return levelId === 1;
      return progress.levels[levelId]?.status !== 'locked';
    },
    [progress]
  );

  const getLevelProgress = useCallback(
    (levelId: number): LevelProgress => {
      return (
        progress?.levels[levelId] ?? {
          status: levelId === 1 ? 'available' : 'locked',
          stars: 0,
        }
      );
    },
    [progress]
  );

  const resetAll = useCallback(async () => {
    const fresh = defaultProgress();
    await save(fresh);
  }, [save]);

  return {
    progress,
    isLoading,
    completeLevel,
    isLevelUnlocked,
    getLevelProgress,
    resetAll,
  };
}
