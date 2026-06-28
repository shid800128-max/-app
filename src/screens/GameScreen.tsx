import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { speak as speakChinese } from '../utils/speech';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { BOPOMOFO } from '../data/bopomofo';
import { getLevelById } from '../data/levels';
import { Colors } from '../styles/colors';
import { MC, BlockSizes, Spacing, pixelShadow } from '../styles/minecraft';
import MinecraftBlock, { BlockState } from '../components/MinecraftBlock';
import HealthBar from '../components/HealthBar';
import XPBar from '../components/XPBar';
import SteveGuide from '../components/SteveGuide';
import { useGame } from '../hooks/useGame';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export default function GameScreen({ navigation, route }: Props) {
  const { levelId, stage } = route.params;
  const level = getLevelById(levelId)!;
  const {
    state,
    currentSymbol,
    isMatchDone,
    isMineDone,
    isGameOver,
    handleMatchTap,
    handleMineTap,
    advanceMineSymbol,
    startMineStage,
  } = useGame(level, stage);

  // Per-block visual states for feedback
  const [blockStates, setBlockStates] = useState<BlockState[]>(['normal', 'normal', 'normal', 'normal']);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearFeedback = () => {
    feedbackTimer.current.forEach(clearTimeout);
    feedbackTimer.current = [];
  };

  // Navigate when done or game over
  useEffect(() => {
    if (isGameOver) {
      navigation.replace('Result', {
        levelId,
        success: false,
        heartsRemaining: 0,
        isPerfect: false,
        diamondsEarned: 0,
      });
    }
  }, [isGameOver]);

  useEffect(() => {
    if (isMatchDone && state.stage === 'match') {
      const t = setTimeout(() => startMineStage(), 800);
      feedbackTimer.current.push(t);
    }
  }, [isMatchDone]);

  useEffect(() => {
    if (isMineDone) {
      navigation.replace('Result', {
        levelId,
        success: true,
        heartsRemaining: state.hearts,
        isPerfect: state.isPerfect,
        diamondsEarned: state.isPerfect ? 1 : 0,
      });
    }
  }, [isMineDone]);

  // Auto-speak current symbol
  useEffect(() => {
    if (!isMatchDone && !isMineDone && !isGameOver && currentSymbol) {
      const t = setTimeout(() => {
        speakChinese(currentSymbol.symbol, { rate: 0.5 });
      }, 300);
      return () => clearTimeout(t);
    }
  }, [state.currentSymbolIdx, state.stage]);

  const resetBlockStates = () =>
    setBlockStates(['normal', 'normal', 'normal', 'normal']);

  // ─── MATCH STAGE ───────────────────────────────────────────────
  const handleMatchBlockTap = (bopomofoIdx: number, blockIdx: number) => {
    clearFeedback();
    const result = handleMatchTap(bopomofoIdx);

    if (result === 'correct') {
      const next: BlockState[] = ['normal', 'normal', 'normal', 'normal'];
      next[blockIdx] = 'correct';
      setBlockStates(next);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      feedbackTimer.current.push(setTimeout(resetBlockStates, 500));
    } else {
      const next: BlockState[] = ['normal', 'normal', 'normal', 'normal'];
      next[blockIdx] = 'wrong';
      setBlockStates(next);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      feedbackTimer.current.push(setTimeout(resetBlockStates, 600));
    }
  };

  // ─── MINE STAGE ────────────────────────────────────────────────
  const [mineBlockStates, setMineBlockStates] = useState<BlockState[]>(['normal', 'normal', 'normal', 'normal']);
  const isAdvancing = useRef(false);

  useEffect(() => {
    // Reset mine state when a new symbol loads
    setMineBlockStates(['normal', 'normal', 'normal', 'normal']);
    isAdvancing.current = false;
  }, [state.currentSymbolIdx]);

  const handleMineBlockTap = (blockIdx: number) => {
    if (isAdvancing.current) return; // ignore taps while the broken block animates out
    clearFeedback();
    const result = handleMineTap(blockIdx);

    if (result === 'cracked') {
      const crackLevel = state.crackLevels[blockIdx] + 1;
      const next = [...mineBlockStates] as BlockState[];
      next[blockIdx] = crackLevel >= 2 ? 'cracked2' : 'cracked1';
      setMineBlockStates(next);
      Haptics.impactAsync(
        crackLevel >= 2 ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium
      ).catch(() => {});
    } else if (result === 'broken_correct') {
      // Play the shatter on the correct block, THEN advance to the next symbol.
      isAdvancing.current = true;
      const next = [...mineBlockStates] as BlockState[];
      next[blockIdx] = 'broken';
      setMineBlockStates(next);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      feedbackTimer.current.push(setTimeout(() => advanceMineSymbol(), 380));
    } else {
      // wrong block — shake it, heart already deducted by the hook
      const next = [...mineBlockStates] as BlockState[];
      next[blockIdx] = 'wrong';
      setMineBlockStates(next);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      feedbackTimer.current.push(
        setTimeout(() => {
          setMineBlockStates((cur) => {
            const reset = [...cur] as BlockState[];
            reset[blockIdx] = 'normal';
            return reset;
          });
        }, 600)
      );
    }
  };

  const progressFraction = state.xp / 100;
  const symbolCount = level.symbolIndices.length;
  const isMatchStage = state.stage === 'match';

  return (
    <SafeAreaView style={[MC.screen, { backgroundColor: level.colors.bg }]}>
      {/* Top HUD */}
      <View style={styles.hud}>
        <HealthBar current={state.hearts} />
        <XPBar
          progress={state.currentSymbolIdx / symbolCount + (isMatchStage ? 0 : 0.5)}
          label={isMatchStage ? `選擇 ${state.currentSymbolIdx}/${symbolCount}` : `挖礦 ${state.currentSymbolIdx}/${symbolCount}`}
          width={160}
        />
      </View>

      {/* Stage banner */}
      <View style={styles.stageBanner}>
        <Text style={[styles.stageText, pixelShadow]}>
          {isMatchStage ? '⚔️ 選擇關' : '⛏️ 挖礦關'}
        </Text>
      </View>

      {/* Prompt */}
      {currentSymbol && !isMatchDone && !isMineDone && (
        <View style={styles.promptArea}>
          <View style={styles.promptRow}>
            <Text style={[MC.textTitle, { color: Colors.textSecondary }]}>
              {isMatchStage ? '找到 ' : '挖出 '}
            </Text>
            <View style={[styles.promptBlock, { backgroundColor: currentSymbol.blockColor }]}>
              <Text style={[styles.promptSymbol, pixelShadow]}>{currentSymbol.symbol}</Text>
            </View>
            {isMatchStage && (
              <Text style={[MC.textTitle, { color: Colors.textSecondary }]}> ！</Text>
            )}
          </View>

          {/* Example-word picture hint */}
          <View style={styles.hintRow}>
            <Text style={styles.hintEmoji}>{currentSymbol.emoji}</Text>
            <Text style={[styles.hintWord, pixelShadow]}>{currentSymbol.exampleWord}</Text>
          </View>
        </View>
      )}

      {/* Block grid */}
      <View style={styles.gridArea}>
        {isMatchStage ? (
          <MatchGrid
            distractorIndices={state.distractorSymbolIndices}
            correctIdx={level.symbolIndices[state.currentSymbolIdx] ?? -1}
            blockStates={blockStates}
            onTap={handleMatchBlockTap}
            levelColors={level.colors}
          />
        ) : (
          <MineGrid
            distractorIndices={state.distractorSymbolIndices}
            blockStates={mineBlockStates}
            stoneColor={Colors.stone}
            onTap={handleMineBlockTap}
          />
        )}
      </View>

      {/* Steve guide */}
      <View style={styles.steveArea}>
        <SteveGuide
          message={
            isMatchStage
              ? `點擊正確的注音符號！`
              : `敲碎磚塊，找出正確的注音！`
          }
          mood="thinking"
        />
      </View>
    </SafeAreaView>
  );
}

// ─── MATCH GRID ──────────────────────────────────────────────────
type MatchGridProps = {
  distractorIndices: number[];
  correctIdx: number;
  blockStates: BlockState[];
  onTap: (bopomofoIdx: number, blockIdx: number) => void;
  levelColors: { blockPrimary: string; blockSecondary: string };
};

function MatchGrid({ distractorIndices, correctIdx, blockStates, onTap, levelColors }: MatchGridProps) {
  const grid = distractorIndices.slice(0, 4);
  const colors = [levelColors.blockPrimary, levelColors.blockSecondary, levelColors.blockPrimary, levelColors.blockSecondary];

  return (
    <View style={styles.grid}>
      {grid.map((bIdx, i) => {
        const sym = BOPOMOFO[bIdx];
        if (!sym) return null;
        return (
          <MinecraftBlock
            key={`${bIdx}-${i}`}
            symbol={sym.symbol}
            faceColor={sym.blockColor}
            size="lg"
            state={blockStates[i]}
            onPress={() => onTap(bIdx, i)}
          />
        );
      })}
    </View>
  );
}

// ─── MINE GRID ───────────────────────────────────────────────────
// Each block is a uniform "stone" block carved with one of the 4 candidate
// symbols. The child mines (taps) the block showing the target symbol.
type MineGridProps = {
  distractorIndices: number[];
  blockStates: BlockState[];
  stoneColor: string;
  onTap: (blockIdx: number) => void;
};

function MineGrid({ distractorIndices, blockStates, stoneColor, onTap }: MineGridProps) {
  const grid = distractorIndices.slice(0, 4);

  return (
    <View style={styles.grid}>
      {grid.map((bIdx, i) => {
        const sym = BOPOMOFO[bIdx];
        if (!sym) return null;
        return (
          <MinecraftBlock
            key={`${bIdx}-${i}`}
            symbol={sym.symbol}
            faceColor={stoneColor}
            size="lg"
            state={blockStates[i]}
            onPress={() => onTap(i)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.bgPanel,
    borderBottomWidth: 2,
    borderBottomColor: Colors.borderDark,
  },
  stageBanner: {
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: Colors.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  stageText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.textYellow,
    letterSpacing: 2,
  },
  promptArea: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.bgCard,
  },
  hintEmoji: {
    fontSize: 30,
  },
  hintWord: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  promptBlock: {
    width: 52,
    height: 52,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopColor: 'rgba(255,255,255,0.20)',
    borderLeftColor: 'rgba(255,255,255,0.20)',
    borderBottomColor: 'rgba(0,0,0,0.38)',
    borderRightColor: 'rgba(0,0,0,0.38)',
  },
  promptSymbol: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  gridArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    width: BlockSizes.lg * 2 + 16 * 3,
    justifyContent: 'center',
  },
  steveArea: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
});
