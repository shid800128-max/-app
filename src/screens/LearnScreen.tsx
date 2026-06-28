import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { speak as speakChinese } from '../utils/speech';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { BOPOMOFO } from '../data/bopomofo';
import { getLevelById } from '../data/levels';
import { Colors } from '../styles/colors';
import { MC, Spacing, pixelShadow } from '../styles/minecraft';
import SymbolCard from '../components/SymbolCard';
import PixelButton from '../components/PixelButton';
import SteveGuide from '../components/SteveGuide';

type Props = NativeStackScreenProps<RootStackParamList, 'Learn'>;

const STEVE_MESSAGES = [
  '認識這個注音符號吧！',
  '記住它的長相喔！',
  '試試看唸出來！',
  '最後一個，加油！',
];

export default function LearnScreen({ navigation, route }: Props) {
  const { levelId, symbolSequenceIndex } = route.params;
  const level = getLevelById(levelId)!;
  const [current, setCurrent] = useState(symbolSequenceIndex);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const bopomofoIdx = level.symbolIndices[current];
  const symbol = BOPOMOFO[bopomofoIdx];
  const isLast = current >= level.symbolIndices.length - 1;

  const speak = () => {
    speakChinese(symbol.ttsText, { rate: 0.5, pitch: 1.1 });
  };

  useEffect(() => {
    // Auto-speak after a short delay
    const t = setTimeout(speak, 400);
    return () => clearTimeout(t);
  }, [current]);

  const animateNext = (next: number) => {
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: -30, duration: 120, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
    setCurrent(next);
  };

  const handleNext = () => {
    if (!isLast) {
      animateNext(current + 1);
    } else {
      navigation.replace('Game', { levelId, stage: 'match' });
    }
  };

  return (
    <SafeAreaView style={[MC.screen, { backgroundColor: level.colors.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[MC.textLabel, { color: Colors.textSecondary }]}>
          {level.emoji} {level.title}
        </Text>
        <Text style={[MC.textLabel, { color: Colors.textYellow }]}>
          {current + 1} / {level.symbolIndices.length}
        </Text>
      </View>

      {/* Progress dots */}
      <View style={styles.dotsRow}>
        {level.symbolIndices.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i < current
                    ? Colors.xpBar
                    : i === current
                    ? Colors.textYellow
                    : Colors.bgCard,
              },
            ]}
          />
        ))}
      </View>

      {/* Symbol card */}
      <View style={styles.cardArea}>
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <SymbolCard symbol={symbol} onSpeak={speak} />
        </Animated.View>
      </View>

      {/* Steve guide */}
      <View style={styles.steveArea}>
        <SteveGuide
          message={STEVE_MESSAGES[Math.min(current, STEVE_MESSAGES.length - 1)]}
          mood={isLast ? 'cheer' : 'happy'}
        />
      </View>

      {/* Navigation button */}
      <View style={styles.btnArea}>
        <PixelButton
          label={isLast ? '開始遊戲 🎮' : '下一個 →'}
          onPress={handleNext}
          color={isLast ? Colors.gold : level.colors.blockPrimary}
          textColor={isLast ? Colors.dirtDark : Colors.textPrimary}
          fontSize={18}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  steveArea: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  btnArea: {
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
});
