import React, { useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { LEVELS } from '../data/levels';
import { Colors } from '../styles/colors';
import { MC, Spacing } from '../styles/minecraft';
import LevelCard from '../components/LevelCard';
import { useGameProgress } from '../hooks/useGameProgress';

type Props = NativeStackScreenProps<RootStackParamList, 'LevelMap'>;

// Staggered X positions for winding path effect
const CARD_POSITIONS = [
  0.15, 0.55, 0.15, 0.55, 0.15,
  0.55, 0.15, 0.55, 0.15, 0.55,
];

export default function LevelMapScreen({ navigation }: Props) {
  const { getLevelProgress, isLoading, reload } = useGameProgress();

  // Refresh progress every time the map regains focus (e.g. returning from a
  // result screen) so newly unlocked levels show immediately.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={MC.screen}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={MC.textBody}>載入中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={MC.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[MC.textTitle, MC.textYellow]}>🗺 世界地圖</Text>
        <View style={styles.diamondBadge}>
          <Text style={MC.textBody}>💎 {/* shown via progress */}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.mapContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Reversed so Level 1 is at bottom (natural scroll direction) */}
        {[...LEVELS].reverse().map((level, revIdx) => {
          const idx = LEVELS.length - 1 - revIdx;
          const prog = getLevelProgress(level.id);
          const xFraction = CARD_POSITIONS[idx] ?? 0.3;

          return (
            <View key={level.id} style={styles.levelRow}>
              {/* Path dot between levels */}
              {revIdx < LEVELS.length - 1 && (
                <View style={styles.pathDots}>
                  {[0, 1, 2].map((d) => (
                    <View key={d} style={styles.dot} />
                  ))}
                </View>
              )}

              <View style={[styles.cardWrapper, { paddingLeft: `${xFraction * 60}%` as any }]}>
                <LevelCard
                  level={level}
                  status={prog.status}
                  stars={prog.stars}
                  onPress={() =>
                    navigation.navigate('Learn', {
                      levelId: level.id,
                      symbolSequenceIndex: 0,
                    })
                  }
                />
                <View style={styles.levelLabel}>
                  <Text style={MC.textLabel}>{level.title}</Text>
                </View>
              </View>
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: Colors.borderDark,
    backgroundColor: Colors.bgPanel,
  },
  diamondBadge: {
    backgroundColor: Colors.bgCard,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 2,
  },
  mapContainer: {
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  levelRow: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  pathDots: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: 4,
    marginVertical: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 1,
    backgroundColor: Colors.stoneDark,
  },
  cardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  levelLabel: {
    maxWidth: 120,
  },
});
