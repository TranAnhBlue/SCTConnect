import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors, Spacing, FontSize, Shadow, BorderRadius } from '../../constants';
import { AppBar } from '../../components/common';
import { feedbackMenuFeatures, AppFeatureItem } from '../../constants/features';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

interface MenuItemProps {
  id: string;
  label: string;
  iconName: string;
  backgroundColor: string;
  iconColor: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, iconName, backgroundColor, iconColor, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.75}>
    <View style={[styles.iconBox, { backgroundColor }]}>
      <MaterialCommunityIcons name={iconName as any} size={30} color={iconColor} />
    </View>
    <Text style={styles.itemLabel} numberOfLines={2}>{label.replace('\\n', '\n')}</Text>
  </TouchableOpacity>
);

export const FeedbackMenuScreen: React.FC<Props> = ({ navigation }) => {
  const handleItem = (screen?: string) => {
    if (screen) navigation.navigate(screen as any);
  };

  // Split into rows: 4 items
  const firstRow = feedbackMenuFeatures.slice(0, 4);
  const secondRow = feedbackMenuFeatures.slice(4);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <AppBar
        title="Phản ánh, kiến nghị"
        showBack
        onBack={() => navigation.goBack()}
        variant="primary"
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Main grid - row 1: 4 items */}
        <View style={styles.card}>
          <View style={styles.row}>
            {firstRow.map((item) => (
              <MenuItem
                key={item.id}
                id={item.id}
                label={item.label}
                iconName={item.iconName}
                backgroundColor={item.backgroundColor}
                iconColor={item.color}
                onPress={() => handleItem(item.screen)}
              />
            ))}
          </View>

          {/* Row 2: remaining items */}
          {secondRow.length > 0 && (
            <View style={[styles.row, { marginTop: Spacing.lg }]}>
              {secondRow.map((item) => (
                <MenuItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  iconName={item.iconName}
                  backgroundColor={item.backgroundColor}
                  iconColor={item.color}
                  onPress={() => handleItem(item.screen)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, gap: Spacing.base },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    paddingVertical: Spacing.xl,
    ...Shadow.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  menuItem: {
    alignItems: 'center',
    width: 72,
    gap: Spacing.sm,
  },
  iconBox: {
    width: 62,
    height: 62,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  itemLabel: {
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 15,
    fontWeight: '500',
  },
});
