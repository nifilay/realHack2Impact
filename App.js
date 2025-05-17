// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DonationGeneratorScreen from './src/screens/DonationGeneratorScreen';
import ScanDonationScreen      from './src/screens/ScanDonationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Generate"
        screenOptions={{
          headerStyle: { backgroundColor: '#6ea9ff' },
          headerTintColor: 'white',
        }}
      >
        <Stack.Screen
          name="Generate"
          component={DonationGeneratorScreen}
          options={{ title: 'New Donation' }}
        />
        <Stack.Screen
          name="Scan"
          component={ScanDonationScreen}
          options={{ title: 'Scan Donation QR' }}
        />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
