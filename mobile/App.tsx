import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SplashScreen } from './src/components/common/SplashScreen';
import { useAuthStore } from './src/store/authStore';

export default function App() {

  const [showSplash, setShowSplash] = useState(true);

  React.useEffect(() => {
    useAuthStore.getState().initAuth();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <RootNavigator />
      )}
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  root: { flex: 1 },
});
