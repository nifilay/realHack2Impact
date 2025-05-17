// src/screens/LoginScreen.js

import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  Image,
  StyleSheet,
  useWindowDimensions,
  Linking,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../App'; // adjust path if needed

const SLOGANS = [
  'Restore Dignity',
  'Empower Lives',
  'Join the Mission',
];

export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  // animated slogan
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [idx, setIdx] = useState(0);
  const { width } = useWindowDimensions();
  const isSmall = width < 350;

  useEffect(() => {
    const cycle = Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.delay(1400),
      Animated.timing(fadeAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]);
    Animated.loop(cycle).start();
  }, [fadeAnim]);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % SLOGANS.length), 2600);
    return () => clearInterval(id);
  }, []);

  const login = async () => {
    if (!email || !password) {
      return Alert.alert('Please enter both email and password');
    }
    try {
      setLoading(true);
      const res = await axios.post(`${API}/auth/login`, { email, password });
      const { token } = res.data;
      await AsyncStorage.setItem('userToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      onLogin(token);
    } catch (err) {
      Alert.alert('Login failed', err.response?.data?.error || err.message);
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
          <Text style={styles.header}>Welcome Back</Text>
          <Animated.Text style={[styles.slogan, { opacity: fadeAnim }]}>
            {SLOGANS[idx]}
          </Animated.Text>
        </View>

        <View style={styles.card}>
          {/* Logo */}
          <Image
            source={require('../../assets/logo.png')}
            style={[
              styles.logo,
              isSmall ? styles.logoSmall : styles.logoLarge
            ]}
            resizeMode="contain"
          />

          {/* Inputs */}
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={login}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? ['#cccccc','#aaaaaa'] : ['#89f7fe','#66a6ff']}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Signing In…' : 'Sign In'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Links */}
          <View style={styles.links}>
            <Text style={styles.linkText}>New here?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkAction}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <TouchableOpacity onPress={() => Linking.openURL('https://projectropa.org')}>
          <Text style={styles.footerLink}>Visit our website</Text>
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
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 32 : 0,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    color: '#222',
    marginBottom: 8,
  },
  slogan: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#555',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // Android
    elevation: 6,
  },
  logo: {
    marginBottom: 24,
  },
  logoSmall: {
    width: 80,
    height: 80,
  },
  logoLarge: {
    width: 120,
    height: 120,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 24,
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
    alignItems: 'center',
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
    color: '#999',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});
