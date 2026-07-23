import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing } from '../../constants';

export const CommunityScreen: React.FC = () => (
  <SafeAreaView style={styles.safe}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Cộng đồng</Text>
    </View>
    <View style={styles.center}>
      <MaterialCommunityIcons name="account-group-outline" size={64} color={Colors.border} />
      <Text style={styles.empty}>Không có bài viết nào</Text>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.base,
    paddingTop: Spacing.lg,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '700', color: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md },
  empty: { fontSize: FontSize.md, color: Colors.textHint },
});
