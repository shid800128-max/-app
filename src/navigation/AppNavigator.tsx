import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LevelMapScreen from '../screens/LevelMapScreen';
import LearnScreen from '../screens/LearnScreen';
import GameScreen from '../screens/GameScreen';
import ResultScreen from '../screens/ResultScreen';
import { Colors } from '../styles/colors';

export type RootStackParamList = {
  Home: undefined;
  LevelMap: undefined;
  Learn: { levelId: number; symbolSequenceIndex: number };
  Game: { levelId: number; stage: 'match' | 'mine' };
  Result: {
    levelId: number;
    success: boolean;
    heartsRemaining: number;
    isPerfect: boolean;
    diamondsEarned: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bgDeep },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="LevelMap"
          component={LevelMapScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Learn"
          component={LearnScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{ animation: 'fade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
