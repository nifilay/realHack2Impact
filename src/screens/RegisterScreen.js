// src/screens/RegisterScreen.js

import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../App'; // adjust path if needed

export default function RegisterScreen({ navigation, onRegister }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const { width } = useWindowDimensions();
  const isSmall = width < 350;

  const register = async () => {
    if (!email || !password) {
      return Alert.alert('Please enter both email and password');
    }
    try {
      setLoading(true);
      const res = await axios.post(`${API}/auth/register`, { email, password });
      const { token } = res.data;
      await AsyncStorage.setItem('userToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      onRegister(token);
    } catch (err) {
      Alert.alert(
        'Registration failed',
        err.response?.data?.error || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#ffd6e8', '#d6c8ff']}
      start={[0, 0]}
      end={[1, 1]}
      style={styles.background}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Create Account</Text>
          <Text style={styles.subheader}>
            Join us and make a difference!
          </Text>
        </View>

        <View style={styles.card}>
          {/* Email Input */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          {/* Password Input */}
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={register}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? ['#cccccc','#aaaaaa'] : ['#89f7fe','#66a6ff']}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Signing Up…' : 'Sign Up'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Already have an account */}
          <View style={styles.links}>
            <Text style={styles.linkText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.linkAction}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <TouchableOpacity onPress={() => navigation.navigate('Generate')}>
          <Text style={styles.footerLink}>Skip and explore</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 32 : 0,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    color: '#222',
  },
  subheader: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // Android elevation
    elevation: 6,
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f0f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  linkText: {
    color: '#777',
    marginRight: 6,
    fontSize: 15,
  },
  linkAction: {
    color: '#66a6ff',
    fontSize: 15,
    fontWeight: '600',
  },
  footerLink: {
    textAlign: 'center',
    color: '#999',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});
