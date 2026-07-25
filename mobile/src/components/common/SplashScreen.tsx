import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Colors, FontSize, Spacing } from '../../constants';

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    // Smooth entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss after 2.2s
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require('../../../assets/logo.png') as any}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <Text style={styles.appName}>SCTConnect</Text>
        <Text style={styles.appSubTitle}>MẶT TRẬN TỔ QUỐC XÃ</Text>
      </Animated.View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color={Colors.primary} style={{ marginBottom: Spacing.xs }} />
        <Text style={styles.footerText}>Đang tải dữ liệu hệ thống...</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logoImage: {
    width: 260,
    height: 220,
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: FontSize.xxl || 24,
    fontWeight: '800',
    color: '#1565C0',
    letterSpacing: 0.5,
    marginTop: Spacing.xs,
  },
  appSubTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSize.xs,
    color: Colors.textHint,
  },
});
