import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { prewarmVoices } from './src/utils/speech';

export default function App() {
  useEffect(() => {
    // Preload the device voice list so the first pronunciation plays instantly
    // with the best (most natural) Chinese voice.
    prewarmVoices();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}
