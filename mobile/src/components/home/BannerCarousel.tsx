import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadow, FontSize } from '../../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - Spacing.base * 2;

const banners = [
  {
    id: '1',
    headline: 'HỖ TRỢ',
    title: 'CHI TRẢ LƯƠNG HƯU,\nTRỢ CẤP BHXH',
    subtitle: 'THỰC HIỆN THỦ TỤC NGAY TẠI NƠI CƯ TRÚ',
    bgTop: '#0D47A1',
    bgBottom: '#1976D2',
    accentColor: '#FFEB3B',
    ctaText: 'XEM TẠI ĐÂY',
  },
  {
    id: '2',
    headline: 'TIỆN ÍCH',
    title: 'DỊCH VỤ CÔNG\nTRỰC TUYẾN',
    subtitle: 'GIẢI QUYẾT THỦ TỤC HÀNH CHÍNH NHANH CHÓNG',
    bgTop: '#1B5E20',
    bgBottom: '#388E3C',
    accentColor: '#A5D6A7',
    ctaText: 'ĐĂNG KÝ NGAY',
  },
  {
    id: '3',
    headline: 'KẾT NỐI',
    title: 'CHÍNH QUYỀN\nVÀ NGƯỜI DÂN',
    subtitle: 'PHẢN ÁNH KIẾN NGHỊ NHANH CHÓNG & HIỆU QUẢ',
    bgTop: '#BF360C',
    bgBottom: '#E64A19',
    accentColor: '#FFCCBC',
    ctaText: 'TÌM HIỂU THÊM',
  },
];

export const BannerCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Auto scroll
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % banners.length;
      scrollRef.current?.scrollTo({
        x: nextIndex * (BANNER_WIDTH + Spacing.sm),
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleScroll = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (BANNER_WIDTH + Spacing.sm));
    setActiveIndex(Math.max(0, Math.min(index, banners.length - 1)));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={BANNER_WIDTH + Spacing.sm}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {banners.map((banner, idx) => (
          <TouchableOpacity
            key={banner.id}
            activeOpacity={0.95}
            style={styles.bannerWrapper}
          >
            <View style={[styles.banner, { backgroundColor: banner.bgTop }]}>
              {/* Header row */}
              <View style={styles.bannerHeader}>
                <View style={styles.logoCircle}>
                  <MaterialCommunityIcons name="city-variant" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.orgInfo}>
                  <Text style={styles.orgName}>TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG</Text>
                  <Text style={styles.orgSub}>THÀNH PHỐ HÀ NỘI</Text>
                </View>
                <View style={styles.tagBox}>
                  <MaterialCommunityIcons name="home" size={12} color="#FFFFFF" />
                  <Text style={styles.tagText}>BIÊN TẬN NHÀ{'\n'}VÌ NGƯỜI DÂN</Text>
                </View>
              </View>

              {/* Body */}
              <View style={styles.bannerBody}>
                <Text style={[styles.bannerHeadline, { color: banner.accentColor }]}>
                  {banner.headline}
                </Text>
                <Text style={styles.bannerTitle}>{banner.title}</Text>
                <Text style={styles.bannerSub}>{banner.subtitle}</Text>
              </View>

              {/* CTA */}
              <View style={styles.bannerFooter}>
                <Text style={styles.bannerNote}>với trường hợp không đủ điều kiện...</Text>
                <TouchableOpacity style={[styles.cta, { borderColor: banner.accentColor }]}>
                  <Text style={[styles.ctaText, { color: banner.accentColor }]}>{banner.ctaText}</Text>
                </TouchableOpacity>
              </View>

              {/* Bottom strip */}
              <View style={[styles.strip, { backgroundColor: banner.bgBottom }]}>
                <Text style={styles.stripText}>Hành chính phục vụ • Vì nhân dân phục vụ</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dots}>
        {banners.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              scrollRef.current?.scrollTo({ x: i * (BANNER_WIDTH + Spacing.sm), animated: true });
              setActiveIndex(i);
            }}
          >
            <View style={[styles.dot, i === activeIndex && styles.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: Spacing.sm },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  bannerWrapper: {
    width: BANNER_WIDTH,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.md,
  },
  banner: {
    width: '100%',
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orgInfo: { flex: 1 },
  orgName: { fontSize: 7, color: 'rgba(255,255,255,0.9)', fontWeight: '700', letterSpacing: 0.3 },
  orgSub: { fontSize: 6, color: 'rgba(255,255,255,0.75)', letterSpacing: 0.2 },
  tagBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    padding: 4,
    alignItems: 'center',
  },
  tagText: { fontSize: 5.5, color: '#FFFFFF', textAlign: 'center', fontWeight: '700', lineHeight: 8 },
  bannerBody: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  bannerHeadline: { fontSize: FontSize.sm, fontWeight: '800', letterSpacing: 1 },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 22,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  bannerSub: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    letterSpacing: 0.3,
    fontWeight: '600',
  },
  bannerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  bannerNote: { fontSize: 7, color: 'rgba(255,255,255,0.65)', flex: 1 },
  cta: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  ctaText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },
  strip: {
    paddingVertical: 5,
    paddingHorizontal: Spacing.md,
  },
  stripText: { fontSize: 7.5, color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 20,
    borderRadius: 3,
  },
});
