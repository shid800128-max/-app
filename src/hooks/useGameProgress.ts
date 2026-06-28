import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
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

async function readProgress(): Promise<GameProgress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GameProgress) : defaultProgress();
  } catch {
    return defaultProgress();
  }
}

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Re-read from storage. Safe to call on focus so each screen reflects the
  // latest progress saved by another screen (e.g. after completing a level).
  const reload = useCallback(async () => {
    const loaded = await readProgress();
    setProgress(loaded);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const completeLevel = useCallback(
    async (levelId: number, heartsRemaining: number, isPerfect: boolean) => {
      const stars = heartsRemaining >= 3 ? 3 : heartsRemaining >= 2 ? 2 : 1;
      const status: LevelStatus = isPerfect ? 'perfect' : 'completed';

      // Read-modify-write against storage so the unlock is always persisted,
      // regardless of whether this screen's in-memory progress finished loading.
      const base = await readProgress();
      const next: GameProgress = { ...base, levels: { ...base.levels } };

      const prev = next.levels[levelId] ?? { status: 'available' as LevelStatus, stars: 0 };
      const alreadyDone = prev.status === 'completed' || prev.status === 'perfect';
      next.levels[levelId] = {
        status: prev.stars >= stars ? prev.status : status,
        stars: Math.max(prev.stars, stars),
        completedAt: Date.now(),
      };

      // Award a diamond only the first time a level is cleared perfectly.
      if (isPerfect && !(alreadyDone && prev.status === 'perfect')) {
        next.totalDiamonds = (next.totalDiamonds ?? 0) + 1;
      }

      // Unlock the level that requires this one.
      const nextLevel = LEVELS.find((l) => l.unlockRequirement === levelId);
      if (nextLevel && next.levels[nextLevel.id]?.status === 'locked') {
        next.levels[nextLevel.id] = { status: 'available', stars: 0 };
      }

      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors; in-memory state still updates below
      }
      setProgress(next);
    },
    []
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
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // ignore
    }
    setProgress(fresh);
  }, []);

  return {
    progress,
    isLoading,
    completeLevel,
    isLevelUnlocked,
    getLevelProgress,
    resetAll,
    reload,
  };
}
