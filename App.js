import React, { useEffect } from 'react';
import { I18nManager, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import RulesScreen from './src/screens/RulesScreen';
import CalcScreen from './src/screens/CalcScreen';
import AccountScreen from './src/screens/AccountScreen';
import AuthScreen from './src/screens/AuthScreen';
import strings from './src/strings';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f1419" />
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: { backgroundColor: '#1a2332' },
              headerTintColor: '#e7e9ea',
              headerTitleStyle: { fontSize: 18 },
              contentStyle: { backgroundColor: '#0f1419' },
              animation: 'slide_from_left',
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'أونو' }} />
            <Stack.Screen name="Game" component={GameScreen} options={{ title: strings.gameTitle }} />
            <Stack.Screen name="Rules" component={RulesScreen} options={{ title: strings.btnRules }} />
            <Stack.Screen name="Calc" component={CalcScreen} options={{ title: strings.calcTitle }} />
            <Stack.Screen name="Account" component={AccountScreen} options={{ title: strings.btnMyAccount }} />
            <Stack.Screen name="Auth" component={AuthScreen} options={{ title: 'تسجيل / دخول' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </>
  );
}
