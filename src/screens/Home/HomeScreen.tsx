import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors, Spacing, FontSize, Shadow, BorderRadius } from '../../constants';
import { BannerCarousel, ServiceGrid, NewServicesRow } from '../../components/home';
import { ServiceItem } from '../../api/mockData';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  navigation: HomeNavigationProp;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleServicePress = (service: ServiceItem) => {
    if (service.screen) {
      navigation.navigate(service.screen as any);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Blue header – extends into safe area */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarBox}>
              <MaterialCommunityIcons name="city-variant" size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.cityName}>Thành phố Hà Nội</Text>
              <View style={styles.weatherRow}>
                <MaterialCommunityIcons name="weather-sunny" size={13} color="#FDD835" />
                <Text style={styles.weatherText}>36°C</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.searchBtn} activeOpacity={0.7}>
            <MaterialCommunityIcons name="magnify" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Content */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner */}
        <BannerCarousel />

        {/* Smart City Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiện ích đô thị thông minh</Text>
          <ServiceGrid onServicePress={handleServicePress} />
        </View>

        {/* New Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiện ích mới ra mắt</Text>
          <NewServicesRow />
        </View>

        {/* Hotline */}
        <TouchableOpacity style={styles.hotlineCard} activeOpacity={0.8}>
          <View style={styles.hotlineIcon}>
            <MaterialCommunityIcons name="phone" size={18} color={Colors.primary} />
          </View>
          <Text style={styles.hotlineLabel}>Tổng đài Hà Nội: </Text>
          <Text style={styles.hotlineNumber}>1022</Text>
          <Text style={styles.hotlineSep}> • Quận/Phường 7</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={18}
            color={Colors.textHint}
            style={{ marginLeft: 'auto' }}
          />
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  headerSafe: { backgroundColor: Colors.primary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.base,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  weatherRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 1 },
  weatherText: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.85)' },
  searchBtn: { padding: 6 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  section: { paddingVertical: Spacing.md },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  hotlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.xs,
    gap: 4,
    ...Shadow.sm,
  },
  hotlineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  hotlineLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  hotlineNumber: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary },
  hotlineSep: { fontSize: FontSize.sm, color: Colors.textSecondary },
});
