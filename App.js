// App.js
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Button, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// screens
import LoginScreen               from './src/screens/LoginScreen';
import RegisterScreen            from './src/screens/RegisterScreen';
import DonationGeneratorScreen   from './src/screens/DonationGeneratorScreen';
import DonationListScreen        from './src/screens/DonationListScreen';
import ScanDonationScreen        from './src/screens/ScanDonationScreen';

const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

// 1) Configure Axios
const host = Platform.OS === 'android'
  ? '10.0.2.2'             // Android emulator
  : '172.23.64.18';      // your Mac’s IP
axios.defaults.baseURL = `http://${host}:3000/api`;

function AuthNavigator({ onLogin, onRegister }) {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn">
        {props => <LoginScreen {...props} onLogin={onLogin} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="Register">
        {props => <RegisterScreen {...props} onRegister={onRegister} />}
      </AuthStack.Screen>
      {/* allow scanning before you even sign in */}
      <AuthStack.Screen
        name="Scan"
        component={ScanDonationScreen}
        options={{ headerShown: true, title: 'Scan Donation QR' }}
      />
      <AuthStack.Screen
        name="Generate"
        component={DonationGeneratorScreen}
        options={{ headerShown: true, title: 'Explore' }}
      />

    </AuthStack.Navigator>
  );
}

function MainNavigator({ onLogout }) {
  return (
    <MainStack.Navigator
      initialRouteName="Donations"
      screenOptions={{
        headerStyle: { backgroundColor: '#6ea9ff' },
        headerTintColor: 'white',
      }}
    >
      <MainStack.Screen
        name="Donations"
        component={DonationListScreen}
        options={({ navigation }) => ({
          title: 'My Donations',
          headerLeft:  () => <Button title="Logout" color="#fff" onPress={onLogout} />,
          headerRight: () => <Button title="New"    color="#fff" onPress={() => navigation.navigate('Generate')} />
        })}
      />
      <MainStack.Screen
        name="Generate"
        component={DonationGeneratorScreen}
        options={({ navigation }) => ({
          title: 'New Donation',
          headerLeft:  () => <Button title="Back"  color="#fff" onPress={() => navigation.navigate('Donations')} />,
          headerRight: () => <Button title="Scan"  color="#fff" onPress={() => navigation.navigate('Scan')} />
        })}
      />
      <MainStack.Screen
        name="Scan"
        component={ScanDonationScreen}
        options={{
          title: 'Scan Donation',
          headerRight: () => <Button title="Logout" color="#fff" onPress={onLogout} />,
        }}
      />
    </MainStack.Navigator>
  );
}

export default function App() {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading]     = useState(true);

  // on app load, read token & set axios Authorization header
  useEffect(() => {
    AsyncStorage.getItem('userToken').then(token => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUserToken(token);
      }
      setLoading(false);
    });
  }, []);

  // called by LoginScreen when login succeeds
  const handleLogin = token => {
    AsyncStorage.setItem('userToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUserToken(token);
  };
  const handleRegister = handleLogin;

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    delete axios.defaults.headers.common['Authorization'];
    setUserToken(null);
  };

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" color="#6ea9ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken
        ? <MainNavigator  onLogout={handleLogout} />
        : <AuthNavigator onLogin={handleLogin} onRegister={handleRegister} />
      }
    </NavigationContainer>
  );
}
