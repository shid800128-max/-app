import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../styles/colors';

type Props = {
  current: number;
  max?: number;
};

export default function HealthBar({ current, max = 3 }: Props) {
  const hearts = Array.from({ length: max }, (_, i) => i < current);

  return (
    <View style={styles.row}>
      {hearts.map((full, i) => (
        <HeartIcon key={i} full={full} />
      ))}
    </View>
  );
}

function HeartIcon({ full }: { full: boolean }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevFull = useRef(full);

  useEffect(() => {
    if (prevFull.current && !full) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.4, duration: 120, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.6, duration: 120, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    }
    prevFull.current = full;
  }, [full]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Text style={styles.heart}>{full ? '❤️' : '🖤'}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  heart: {
    fontSize: 26,
  },
});
