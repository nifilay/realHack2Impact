// App.js
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import LoginScreen    from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen     from './src/screens/HomeScreen';

// pick your API host here:
export const API = 'http://localhost:3000'; 

const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

export default function App() {
  const [token, setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  // on app start try to load token
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('userToken');
      if (saved) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${saved}`;
        setToken(saved);
      }
      setLoading(false);
    })();
  }, []);

  const handleLogin = async (newToken) => {
    await AsyncStorage.setItem('userToken', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
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
      {token == null ? (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login">
            {props => <LoginScreen {...props} onLogin={handleLogin} />}
          </AuthStack.Screen>
          <AuthStack.Screen name="Register">
            {props => <RegisterScreen {...props} onLogin={handleLogin} />}
          </AuthStack.Screen>
        </AuthStack.Navigator>
      ) : (
        <MainStack.Navigator>
          <MainStack.Screen name="Home">
            {props => <HomeScreen {...props} onLogout={handleLogout} />}
          </MainStack.Screen>
        </MainStack.Navigator>
      )}
    </NavigationContainer>
  );
}
