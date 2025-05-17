// App.js
import 'react-native-gesture-handler';                  // 1️⃣ MUST be first
import React, { useState } from 'react';
import { View, Text } from 'react-native';             // 2️⃣ import View/Text if you ever use them
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen             from './src/screens/LoginScreen';
import DonationGeneratorScreen from './src/screens/DonationGeneratorScreen';
import ScanDonationScreen      from './src/screens/ScanDonationScreen';

const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

function AuthNavigator({ onLogin }) {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login">
        {props => <LoginScreen {...props} onLogin={onLogin} />}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <MainStack.Navigator
      initialRouteName="Generate"
      screenOptions={{
        headerStyle: { backgroundColor: '#6ea9ff' },
        headerTintColor: 'white',
      }}
    >
      <MainStack.Screen
        name="Generate"
        component={DonationGeneratorScreen}
        options={{ title: 'New Donation' }}
      />
      <MainStack.Screen
        name="Scan"
        component={ScanDonationScreen}
        options={{ title: 'Scan Donation QR' }}
      />
    </MainStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userInfo) => {
    // e.g. store userInfo.token, etc.
    setUser(userInfo);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {user
          ? <MainNavigator />
          : <AuthNavigator onLogin={handleLogin} />
        }
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
