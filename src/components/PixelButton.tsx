import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../styles/colors';
import { pixelShadow } from '../styles/minecraft';

type Props = {
  label: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
  fontSize?: number;
};

export default function PixelButton({
  label,
  onPress,
  color = Colors.grass,
  textColor = Colors.textPrimary,
  disabled = false,
  style,
  fontSize = 17,
}: Props) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={style}>
      {({ pressed }) => (
        <View
          style={[
            styles.btn,
            {
              backgroundColor: disabled ? Colors.stone : color,
              transform: [{ translateY: pressed ? 2 : 0 }],
            },
          ]}
        >
          {/* Top highlight strip */}
          <View style={styles.topHighlight} />
          <Text
            style={[
              styles.label,
              { fontSize, color: disabled ? Colors.textSecondary : textColor },
              pixelShadow,
            ]}
          >
            {label}
          </Text>
          {/* Bottom shadow strip */}
          <View style={[styles.bottomShadow, { backgroundColor: pressed ? 'transparent' : 'rgba(0,0,0,0.3)' }]} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopColor: 'rgba(255,255,255,0.25)',
    borderLeftColor: 'rgba(255,255,255,0.25)',
    borderBottomColor: 'rgba(0,0,0,0.40)',
    borderRightColor: 'rgba(0,0,0,0.40)',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
    overflow: 'hidden',
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  bottomShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  label: {
    fontWeight: '900',
    letterSpacing: 1,
  },
});
