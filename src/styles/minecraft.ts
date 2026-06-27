import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Colors } from './colors';

// Pixel text shadow — 2px offset, no blur → crisp pixel look
export const pixelShadow: TextStyle = {
  textShadowColor: '#000000',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 0,
};

// Asymmetric border for 3D block bevel effect
export function blockBevel(faceColor: string): ViewStyle {
  // Compute lighter and darker variants of the face color
  return {
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopColor: Colors.borderLight,
    borderLeftColor: Colors.borderLight,
    borderBottomColor: Colors.borderDark,
    borderRightColor: Colors.borderDark,
    backgroundColor: faceColor,
  };
}

export const BlockSizes = {
  sm: 48,
  md: 68,
  lg: 84,
  xl: 100,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 36,
} as const;

export const MC = StyleSheet.create({
  // Full screen dark background
  screen: {
    flex: 1,
    backgroundColor: Colors.bgDeep,
  },

  // Panel / card container
  panel: {
    backgroundColor: Colors.bgPanel,
    borderRadius: 4,
    borderWidth: 2,
    borderTopColor: Colors.borderLight,
    borderLeftColor: Colors.borderLight,
    borderBottomColor: Colors.borderDark,
    borderRightColor: Colors.borderDark,
    padding: Spacing.md,
  },

  // Minecraft-style "pixel" button base (no background — apply faceColor separately)
  pixelBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: 2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopColor: Colors.borderLight,
    borderLeftColor: Colors.borderLight,
    borderBottomColor: Colors.borderDark,
    borderRightColor: Colors.borderDark,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  // Typography
  textDisplay: {
    fontSize: 32,
    fontWeight: '900' as const,
    letterSpacing: 2,
    color: Colors.textPrimary,
    ...pixelShadow,
  },
  textTitle: {
    fontSize: 22,
    fontWeight: '900' as const,
    letterSpacing: 1,
    color: Colors.textPrimary,
    ...pixelShadow,
  },
  textBody: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    ...pixelShadow,
  },
  textLabel: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
    ...pixelShadow,
  },
  textSymbol: {
    fontSize: 56,
    fontWeight: '900' as const,
    color: Colors.textPrimary,
    ...pixelShadow,
  },
  textYellow: {
    color: Colors.textYellow,
  },
  textGreen: {
    color: Colors.textGreen,
  },
});
