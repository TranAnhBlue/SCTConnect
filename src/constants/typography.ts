import { StyleSheet } from 'react-native';

export const FontFamily = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  semibold: 'System',
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 15,
  lg: 16,
  xl: 18,
  xxl: 20,
  h3: 22,
  h2: 24,
  h1: 28,
};

export const LineHeight = {
  tight: 18,
  snug: 20,
  normal: 22,
  relaxed: 24,
  loose: 28,
};

export const Typography = StyleSheet.create({
  h1: { fontSize: FontSize.h1, fontWeight: '700', lineHeight: 34 },
  h2: { fontSize: FontSize.h2, fontWeight: '700', lineHeight: 30 },
  h3: { fontSize: FontSize.h3, fontWeight: '600', lineHeight: 28 },
  title: { fontSize: FontSize.xl, fontWeight: '600', lineHeight: 24 },
  subtitle: { fontSize: FontSize.lg, fontWeight: '600', lineHeight: 22 },
  body: { fontSize: FontSize.base, fontWeight: '400', lineHeight: 22 },
  bodyMd: { fontSize: FontSize.md, fontWeight: '400', lineHeight: 20 },
  caption: { fontSize: FontSize.sm, fontWeight: '400', lineHeight: 18 },
  tiny: { fontSize: FontSize.xs, fontWeight: '400', lineHeight: 14 },
  label: { fontSize: FontSize.sm, fontWeight: '600', lineHeight: 16 },
});
