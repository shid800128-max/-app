import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BopomofoSymbol } from '../data/bopomofo';
import { Colors } from '../styles/colors';
import { pixelShadow } from '../styles/minecraft';

type Props = {
  symbol: BopomofoSymbol;
  onSpeak?: () => void;
};

export default function SymbolCard({ symbol, onSpeak }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleSpeakPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    onSpeak?.();
  };

  return (
    <View style={styles.card}>
      {/* Symbol block */}
      <View style={[styles.symbolBlock, { backgroundColor: symbol.blockColor }]}>
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.noiseA} />
          <View style={styles.noiseB} />
          <View style={styles.noiseC} />
        </View>
        <Text style={[styles.symbol, pixelShadow]}>{symbol.symbol}</Text>
      </View>

      {/* Romanization label */}
      <Text style={[styles.roman, pixelShadow]}>/{symbol.romanization}/</Text>

      {/* Example word + emoji */}
      <View style={styles.wordRow}>
        <Text style={styles.wordEmoji}>{symbol.emoji}</Text>
        <Text style={[styles.word, pixelShadow]}>{symbol.exampleWord}</Text>
      </View>

      {/* Pronunciation button */}
      <Pressable onPress={handleSpeakPress} style={styles.speakBtn}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Text style={styles.speakText}>🔊 聽發音</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: 14,
    paddingVertical: 8,
  },
  symbolBlock: {
    width: 120,
    height: 120,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderTopColor: 'rgba(255,255,255,0.20)',
    borderLeftColor: 'rgba(255,255,255,0.20)',
    borderBottomColor: 'rgba(0,0,0,0.38)',
    borderRightColor: 'rgba(0,0,0,0.38)',
    overflow: 'hidden',
  },
  symbol: {
    fontSize: 64,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  noiseA: { position: 'absolute', width: 5, height: 5, top: 10, left: 12, backgroundColor: 'rgba(0,0,0,0.15)' },
  noiseB: { position: 'absolute', width: 4, height: 4, top: 16, right: 14, backgroundColor: 'rgba(255,255,255,0.10)' },
  noiseC: { position: 'absolute', width: 4, height: 4, bottom: 12, left: 20, backgroundColor: 'rgba(0,0,0,0.12)' },
  roman: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.bgPanel,
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.12)',
    borderLeftColor: 'rgba(255,255,255,0.12)',
    borderBottomColor: 'rgba(0,0,0,0.30)',
    borderRightColor: 'rgba(0,0,0,0.30)',
  },
  wordEmoji: {
    fontSize: 36,
  },
  word: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  speakBtn: {
    backgroundColor: Colors.bgCard,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.15)',
    borderLeftColor: 'rgba(255,255,255,0.15)',
    borderBottomColor: 'rgba(0,0,0,0.35)',
    borderRightColor: 'rgba(0,0,0,0.35)',
  },
  speakText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textYellow,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});
