import 'react-native-gesture-handler';
import React from 'react';
import { Platform, Button } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// screens
import DonationGeneratorScreen   from './src/screens/DonationGeneratorScreen';
import DonationListScreen        from './src/screens/DonationListScreen';
import ScanDonationScreen        from './src/screens/ScanDonationScreen';

const MainStack = createNativeStackNavigator();

// Configure Axios base URL
const host = Platform.OS === 'android'
  ? '10.0.2.2'
  : '172.26.94.137';
axios.defaults.baseURL = `http://${host}:3000/api`;

function MainNavigator() {
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
          headerLeft: () => <Button title="Logout" color="#fff" onPress={() => {/* add logout logic if needed */}} />, 
          headerRight: () => <Button title="New" color="#fff" onPress={() => navigation.navigate('Generate')} />
        })}
      />
      <MainStack.Screen
        name="Generate"
        component={DonationGeneratorScreen}
        options={({ navigation }) => ({
          title: 'New Donation',
          headerLeft: () => <Button title="Back" color="#fff" onPress={() => navigation.navigate('Donations')} />,
          headerRight: () => <Button title="Scan" color="#fff" onPress={() => navigation.navigate('Scan')} />
        })}
      />
      <MainStack.Screen
        name="Scan"
        component={ScanDonationScreen}
        options={{
          title: 'Scan Donation',
          headerRight: () => <Button title="Logout" color="#fff" onPress={() => {/* add logout logic if needed */}} />
        }}
      />
    </MainStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}