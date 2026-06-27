import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Level } from '../data/levels';
import { Colors } from '../styles/colors';
import { pixelShadow } from '../styles/minecraft';

type LevelStatus = 'locked' | 'available' | 'completed' | 'perfect';

type Props = {
  level: Level;
  status: LevelStatus;
  stars?: number;
  onPress?: () => void;
};

export default function LevelCard({ level, status, stars = 0, onPress }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === 'available') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.06, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [status]);

  const locked = status === 'locked';
  const bgColor = locked ? Colors.stone : level.colors.blockPrimary;

  return (
    <Pressable onPress={locked ? undefined : onPress} disabled={locked}>
      {({ pressed }) => (
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: bgColor,
              transform: [
                { scale: status === 'available' ? pulseAnim : pressed ? 0.95 : 1 },
              ],
              opacity: locked ? 0.6 : 1,
            },
          ]}
        >
          {/* Bevel borders */}
          <View style={[StyleSheet.absoluteFill, styles.topBorder]} pointerEvents="none" />
          <View style={[StyleSheet.absoluteFill, styles.bottomBorder]} pointerEvents="none" />

          {/* Biome emoji */}
          <Text style={styles.emoji}>{locked ? '🔒' : level.emoji}</Text>

          {/* Level number */}
          <Text style={[styles.levelNum, pixelShadow]}>{level.id}</Text>

          {/* Stars (completed) */}
          {status !== 'locked' && stars > 0 && (
            <View style={styles.starsRow}>
              {[1, 2, 3].map((i) => (
                <Text key={i} style={styles.star}>{i <= stars ? '⭐' : '☆'}</Text>
              ))}
            </View>
          )}

          {/* Diamond badge for perfect */}
          {status === 'perfect' && (
            <View style={styles.diamondBadge}>
              <Text style={{ fontSize: 12 }}>💎</Text>
            </View>
          )}
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 72,
    height: 72,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  topBorder: {
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: 'rgba(255,255,255,0.22)',
    borderLeftColor: 'rgba(255,255,255,0.22)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRadius: 4,
  },
  bottomBorder: {
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.38)',
    borderRightColor: 'rgba(0,0,0,0.38)',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRadius: 4,
  },
  emoji: {
    fontSize: 28,
  },
  levelNum: {
    position: 'absolute',
    top: 4,
    right: 7,
    fontSize: 11,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.7)',
  },
  starsRow: {
    position: 'absolute',
    bottom: 3,
    flexDirection: 'row',
  },
  star: {
    fontSize: 9,
  },
  diamondBadge: {
    position: 'absolute',
    top: 3,
    left: 4,
  },
});
