// App.js

import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen     from './src/screens/LoginScreen';
import RegisterScreen  from './src/screens/RegisterScreen';
import DonationGeneratorScreen from './src/screens/DonationGeneratorScreen';
import ScanDonationScreen      from './src/screens/ScanDonationScreen';

export const API = 'http://localhost:3000'; // or your server URL

const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

function AuthNavigator({ onLogin, onRegister }) {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn">
        {props => <LoginScreen {...props} onLogin={onLogin} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="Register">
        {props => <RegisterScreen {...props} onRegister={onRegister} />}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}

function MainNavigator({ onLogout }) {
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
        options={{
          title: 'New Donation',
          headerRight: () => <Button title="Logout" color="#fff" onPress={onLogout} />
        }}
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
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading]     = useState(true);

  // Check AsyncStorage for token on app start
  useEffect(() => {
    AsyncStorage.getItem('userToken').then(token => {
      setUserToken(token);
      setLoading(false);
    });
  }, []);

  const handleLogin = token => setUserToken(token);
  const handleRegister = token => setUserToken(token);
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUserToken(null);
  };

  if (loading) {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken
        ? <MainNavigator onLogout={handleLogout} />
        : <AuthNavigator onLogin={handleLogin} onRegister={handleRegister} />
      }
    </NavigationContainer>
  );
}
