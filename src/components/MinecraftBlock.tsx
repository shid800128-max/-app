import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlockSizes, MC, pixelShadow } from '../styles/minecraft';
import { Colors } from '../styles/colors';

export type BlockState = 'normal' | 'cracked1' | 'cracked2' | 'correct' | 'wrong' | 'broken';
export type BlockSize = keyof typeof BlockSizes;

type Props = {
  symbol?: string;
  emoji?: string;
  faceColor: string;
  size?: BlockSize;
  state?: BlockState;
  onPress?: () => void;
  disabled?: boolean;
  showLabel?: boolean;
  label?: string;
};

export default function MinecraftBlock({
  symbol,
  emoji,
  faceColor,
  size = 'md',
  state = 'normal',
  onPress,
  disabled = false,
  showLabel = false,
  label,
}: Props) {
  const dim = BlockSizes[size];
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state === 'correct') {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.15, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    } else if (state === 'wrong') {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -5, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    } else if (state === 'broken') {
      Animated.timing(scaleAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [state]);

  const crackOverlay = () => {
    if (state === 'cracked1') {
      return (
        <View style={[StyleSheet.absoluteFill, styles.crackOverlay1]} pointerEvents="none">
          <View style={styles.crackLine1} />
          <View style={styles.crackLine2} />
        </View>
      );
    }
    if (state === 'cracked2') {
      return (
        <View style={[StyleSheet.absoluteFill, styles.crackOverlay2]} pointerEvents="none">
          <View style={styles.crackLine1} />
          <View style={styles.crackLine2} />
          <View style={styles.crackLine3} />
          <View style={styles.crackLine4} />
        </View>
      );
    }
    if (state === 'correct') {
      return <View style={[StyleSheet.absoluteFill, styles.correctOverlay]} pointerEvents="none" />;
    }
    if (state === 'wrong') {
      return <View style={[StyleSheet.absoluteFill, styles.wrongOverlay]} pointerEvents="none" />;
    }
    return null;
  };

  const noisePixels = () => (
    <>
      <View style={[styles.noise, { top: 8, left: 8, opacity: 0.18 }]} />
      <View style={[styles.noise, { top: 8, right: 10, opacity: 0.12 }]} />
      <View style={[styles.noise, { bottom: 10, left: 12, opacity: 0.14 }]} />
      <View style={[styles.noise, { bottom: 8, right: 8, opacity: 0.10 }]} />
      <View style={[styles.noise, { top: dim * 0.45, left: dim * 0.55, opacity: 0.10 }]} />
    </>
  );

  return (
    <View style={{ alignItems: 'center' }}>
      <Pressable onPress={onPress} disabled={disabled || state === 'broken'}>
        {({ pressed }) => (
          <Animated.View
            style={[
              {
                width: dim,
                height: dim,
                borderRadius: 2,
                overflow: 'hidden',
                borderTopWidth: 3,
                borderLeftWidth: 3,
                borderBottomWidth: 3,
                borderRightWidth: 3,
                borderTopColor: Colors.borderLight,
                borderLeftColor: Colors.borderLight,
                borderBottomColor: Colors.borderDark,
                borderRightColor: Colors.borderDark,
                backgroundColor: faceColor,
                alignItems: 'center',
                justifyContent: 'center',
                transform: [
                  { scale: pressed ? 0.94 : scaleAnim },
                  { translateX: shakeAnim },
                ],
                opacity: opacityAnim,
              },
            ]}
          >
            {noisePixels()}
            {symbol ? (
              <Text style={[
                { fontSize: dim * 0.48, fontWeight: '900', color: Colors.textPrimary },
                pixelShadow,
              ]}>
                {symbol}
              </Text>
            ) : emoji ? (
              <Text style={{ fontSize: dim * 0.5 }}>{emoji}</Text>
            ) : null}
            {crackOverlay()}
          </Animated.View>
        )}
      </Pressable>
      {showLabel && label ? (
        <Text style={[MC.textLabel, { marginTop: 4 }]}>{label}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  noise: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#000000',
    borderRadius: 0,
  },
  crackOverlay1: {
    backgroundColor: 'rgba(0,0,0,0.20)',
  },
  crackOverlay2: {
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  correctOverlay: {
    backgroundColor: 'rgba(107,168,112,0.35)',
  },
  wrongOverlay: {
    backgroundColor: 'rgba(196,80,80,0.35)',
  },
  crackLine1: {
    position: 'absolute',
    top: '15%',
    left: '25%',
    width: '55%',
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.55)',
    transform: [{ rotate: '35deg' }],
  },
  crackLine2: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    width: '45%',
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.45)',
    transform: [{ rotate: '-25deg' }],
  },
  crackLine3: {
    position: 'absolute',
    top: '30%',
    right: '15%',
    width: '35%',
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.50)',
    transform: [{ rotate: '60deg' }],
  },
  crackLine4: {
    position: 'absolute',
    bottom: '20%',
    left: '30%',
    width: '40%',
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.40)',
    transform: [{ rotate: '-50deg' }],
  },
});
