import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../styles/colors';
import { pixelShadow } from '../styles/minecraft';

type Props = {
  message: string;
  mood?: 'happy' | 'thinking' | 'cheer' | 'sad';
};

const MOODS = {
  happy: '😄',
  thinking: '🤔',
  cheer: '🥳',
  sad: '😢',
};

export default function SteveGuide({ message, mood = 'happy' }: Props) {
  return (
    <View style={styles.container}>
      {/* Steve face pixel art (emoji stand-in) */}
      <View style={styles.faceBox}>
        <Text style={styles.face}>{MOODS[mood]}</Text>
      </View>

      {/* Speech bubble */}
      <View style={styles.bubbleWrapper}>
        {/* Triangle pointer */}
        <View style={styles.triangle} />
        <View style={styles.bubble}>
          <Text style={[styles.message, pixelShadow]}>{message}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  faceBox: {
    width: 52,
    height: 52,
    backgroundColor: Colors.bgCard,
    borderRadius: 2,
    borderWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.15)',
    borderLeftColor: 'rgba(255,255,255,0.15)',
    borderBottomColor: 'rgba(0,0,0,0.35)',
    borderRightColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: {
    fontSize: 30,
  },
  bubbleWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: Colors.bgCard,
  },
  bubble: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 4,
    padding: 10,
    borderWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.15)',
    borderLeftColor: 'rgba(255,255,255,0.15)',
    borderBottomColor: 'rgba(0,0,0,0.35)',
    borderRightColor: 'rgba(0,0,0,0.35)',
  },
  message: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
});
