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
import { Colors } from '../styles/colors';
import { MC, pixelShadow, Spacing } from '../styles/minecraft';
import PixelButton from '../components/PixelButton';
import { useGameProgress } from '../hooks/useGameProgress';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { progress, isLoading } = useGameProgress();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation for Steve
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 900, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    // Title fade-in
    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const hasProgress =
    progress && Object.values(progress.levels).some((l) => l.status === 'completed' || l.status === 'perfect');

  return (
    <SafeAreaView style={MC.screen}>
      {/* Sky gradient simulation */}
      <View style={styles.skyTop} />
      <View style={styles.skyMid} />

      {/* Ground strip */}
      <View style={styles.ground} />

      <View style={styles.content}>
        {/* Title */}
        <Animated.View style={{ opacity: titleAnim }}>
          <Text style={[styles.titleLine1, pixelShadow]}>注音</Text>
          <Text style={[styles.titleLine2, pixelShadow]}>方塊</Text>
          <Text style={[styles.titleSub, pixelShadow]}>BOPOMOFO MINECRAFT</Text>
        </Animated.View>

        {/* Steve floating character */}
        <Animated.View style={[styles.steveContainer, { transform: [{ translateY: floatAnim }] }]}>
          <Text style={styles.steveEmoji}>🧑‍🎤</Text>
          <View style={styles.steveShadow} />
        </Animated.View>

        {/* Buttons */}
        <View style={styles.btnGroup}>
          <PixelButton
            label={hasProgress ? '繼續冒險 ▶' : '開始冒險 ▶'}
            onPress={() => navigation.navigate('LevelMap')}
            color={Colors.grass}
            fontSize={20}
          />
          {hasProgress && (
            <Text style={[MC.textLabel, { textAlign: 'center', marginTop: Spacing.xs }]}>
              💎 {progress?.totalDiamonds ?? 0} 顆鑽石
            </Text>
          )}
        </View>

        {/* Decorative bottom blocks */}
        <View style={styles.blockRow}>
          {['#A07850', '#6B9E4A', '#8A8A8A', '#6B9E4A', '#A07850'].map((c, i) => (
            <View key={i} style={[styles.deco, { backgroundColor: c }]} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  skyTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: '#1C2A38',
  },
  skyMid: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    height: '25%',
    backgroundColor: '#253545',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: Colors.dirtDark,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: Spacing.lg,
    paddingBottom: 70,
  },
  titleLine1: {
    fontSize: 52,
    fontWeight: '900',
    color: Colors.textYellow,
    textAlign: 'center',
    letterSpacing: 6,
    lineHeight: 58,
  },
  titleLine2: {
    fontSize: 52,
    fontWeight: '900',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 6,
    lineHeight: 58,
  },
  titleSub: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 3,
    marginTop: 6,
  },
  steveContainer: {
    alignItems: 'center',
  },
  steveEmoji: {
    fontSize: 80,
  },
  steveShadow: {
    width: 60,
    height: 8,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginTop: 4,
  },
  btnGroup: {
    alignItems: 'center',
    gap: 8,
  },
  blockRow: {
    flexDirection: 'row',
    gap: 4,
    position: 'absolute',
    bottom: 12,
  },
  deco: {
    width: 52,
    height: 52,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopColor: 'rgba(255,255,255,0.18)',
    borderLeftColor: 'rgba(255,255,255,0.18)',
    borderBottomColor: 'rgba(0,0,0,0.35)',
    borderRightColor: 'rgba(0,0,0,0.35)',
  },
});
