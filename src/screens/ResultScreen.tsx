import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getLevelById, LEVELS } from '../data/levels';
import { Colors } from '../styles/colors';
import { MC, Spacing, pixelShadow } from '../styles/minecraft';
import PixelButton from '../components/PixelButton';
import { useGameProgress } from '../hooks/useGameProgress';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export default function ResultScreen({ navigation, route }: Props) {
  const { levelId, success, heartsRemaining, isPerfect, diamondsEarned } = route.params;
  const level = getLevelById(levelId)!;
  const { completeLevel } = useGameProgress();

  const stars = heartsRemaining >= 3 ? 3 : heartsRemaining >= 2 ? 2 : 1;
  const nextLevelExists = LEVELS.some((l) => l.id === levelId + 1);

  // Animations
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const chestLidAnim = useRef(new Animated.Value(0)).current;
  const starAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const diamondAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (success) {
      completeLevel(levelId, heartsRemaining, isPerfect).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!success) return;

    // Banner entrance
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 6 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    // Chest lid opens
    Animated.sequence([
      Animated.delay(400),
      Animated.timing(chestLidAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    // Stars appear one by one
    const starDelay = [500, 700, 900];
    starAnims.forEach((a, i) => {
      setTimeout(() => {
        Animated.spring(a, { toValue: 1, useNativeDriver: true, tension: 80, friction: 5 }).start();
      }, starDelay[i]);
    });

    // Diamond sparkle
    if (isPerfect) {
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(diamondAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(diamondAnim, { toValue: 0.6, duration: 500, useNativeDriver: true }),
          ])
        ).start();
      }, 1000);
    }
  }, []);

  if (!success) {
    return (
      <SafeAreaView style={[MC.screen, { backgroundColor: '#1A1020' }]}>
        <View style={styles.failContent}>
          <Text style={styles.failEmoji}>💀</Text>
          <Text style={[styles.failTitle, pixelShadow]}>挑戰失敗</Text>
          <Text style={[MC.textBody, { color: Colors.textSecondary, textAlign: 'center', marginTop: 8 }]}>
            不要放棄！再試一次吧！
          </Text>
          <View style={styles.failBtns}>
            <PixelButton
              label="再試一次 🔄"
              onPress={() =>
                navigation.replace('Learn', {
                  levelId,
                  symbolSequenceIndex: 0,
                })
              }
              color={Colors.redstone}
              fontSize={17}
            />
            <PixelButton
              label="回地圖 🗺"
              onPress={() => navigation.navigate('LevelMap')}
              color={Colors.stoneDark}
              fontSize={15}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const chestLidRotate = chestLidAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-55deg'],
  });

  return (
    <SafeAreaView style={[MC.screen, { backgroundColor: level.colors.bg }]}>
      {/* Sparkle background dots */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {['✨', '🌟', '✨', '⭐', '✨'].map((s, i) => (
          <Text
            key={i}
            style={[styles.sparkle, { top: `${10 + i * 15}%`, left: `${10 + i * 18}%` } as any]}
          >
            {s}
          </Text>
        ))}
      </View>

      {/* Banner */}
      <Animated.View
        style={[styles.banner, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}
      >
        <Text style={[styles.bannerText, pixelShadow]}>
          {isPerfect ? '完美過關！ 🏆' : '過關了！ 🎉'}
        </Text>
      </Animated.View>

      {/* Chest */}
      <View style={styles.chestArea}>
        {/* Chest bottom */}
        <View style={styles.chestBottom}>
          <Text style={styles.chestEmoji}>📦</Text>
        </View>
        {/* Chest lid */}
        <Animated.View
          style={[
            styles.chestLid,
            {
              transform: [{ rotateX: chestLidRotate }],
              transformOrigin: 'bottom',
            },
          ]}
        >
          <View style={styles.chestLidInner}>
            <Text style={{ fontSize: 20 }}>{isPerfect ? '💎' : '📜'}</Text>
          </View>
        </Animated.View>

        {/* Stars */}
        <View style={styles.starsContainer}>
          {starAnims.map((a, i) => (
            <Animated.Text
              key={i}
              style={[
                styles.starText,
                {
                  opacity: a,
                  transform: [{ scale: a }],
                  color: i < stars ? Colors.gold : Colors.bgCard,
                },
              ]}
            >
              ★
            </Animated.Text>
          ))}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={[MC.textLabel, { textAlign: 'center' }]}>愛心</Text>
          <Text style={styles.statValue}>{heartsRemaining === 3 ? '❤️❤️❤️' : heartsRemaining === 2 ? '❤️❤️🖤' : '❤️🖤🖤'}</Text>
        </View>
        {isPerfect && (
          <View style={styles.stat}>
            <Text style={[MC.textLabel, { textAlign: 'center' }]}>完美！</Text>
            <Animated.Text style={[styles.statValue, { opacity: diamondAnim }]}>💎</Animated.Text>
          </View>
        )}
      </View>

      {/* Buttons */}
      <View style={styles.btnArea}>
        {nextLevelExists && (
          <PixelButton
            label="下一關 ▶"
            onPress={() =>
              navigation.replace('Learn', {
                levelId: levelId + 1,
                symbolSequenceIndex: 0,
              })
            }
            color={Colors.emerald}
            fontSize={18}
          />
        )}
        <PixelButton
          label="回地圖 🗺"
          onPress={() => navigation.navigate('LevelMap')}
          color={Colors.bgCard}
          fontSize={15}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.bgPanel,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: 4,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopColor: Colors.borderLight,
    borderLeftColor: Colors.borderLight,
    borderBottomColor: Colors.borderDark,
    borderRightColor: Colors.borderDark,
  },
  bannerText: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textYellow,
    letterSpacing: 2,
  },
  chestArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  chestBottom: {
    width: 90,
    height: 60,
    backgroundColor: Colors.wood,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopColor: Colors.borderLight,
    borderLeftColor: Colors.borderLight,
    borderBottomColor: Colors.borderDark,
    borderRightColor: Colors.borderDark,
  },
  chestEmoji: { fontSize: 30 },
  chestLid: {
    width: 90,
    height: 30,
    backgroundColor: Colors.woodDark,
    borderRadius: 2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopColor: Colors.borderLight,
    borderLeftColor: Colors.borderLight,
    borderBottomColor: Colors.borderDark,
    borderRightColor: Colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  chestLidInner: { alignItems: 'center' },
  starsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  starText: {
    fontSize: 42,
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingVertical: Spacing.sm,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 22,
  },
  btnArea: {
    alignItems: 'center',
    gap: 12,
    paddingBottom: Spacing.xl,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 20,
    opacity: 0.4,
  },
  // Fail screen
  failContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  failEmoji: {
    fontSize: 80,
  },
  failTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.redstone,
    letterSpacing: 3,
  },
  failBtns: {
    gap: 12,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
});
