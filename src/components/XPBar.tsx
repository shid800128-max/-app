import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../styles/colors';

type Props = {
  progress: number; // 0.0 – 1.0
  label?: string;
  width?: number;
};

export default function XPBar({ progress, label, width = 200 }: Props) {
  const fillAnim = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: progress,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - 6],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.outer, { width }]}>
        <Animated.View style={[styles.fill, { width: fillWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    height: 12,
    backgroundColor: Colors.xpBg,
    borderRadius: 2,
    borderWidth: 2,
    borderTopColor: 'rgba(0,0,0,0.4)',
    borderLeftColor: 'rgba(0,0,0,0.4)',
    borderBottomColor: 'rgba(255,255,255,0.15)',
    borderRightColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    padding: 1,
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.xpBar,
    borderRadius: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textGreen,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    letterSpacing: 0.5,
  },
});
