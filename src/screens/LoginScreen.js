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
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../App';

const SLOGANS = ['Restore Dignity', 'Empower Lives', 'Join the Mission'];

export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [emailFocused, setEmailFocused]       = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [idx, setIdx] = useState(0);
  const { width } = useWindowDimensions();
  const isSmall = width < 350;

  // button press scale
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true }).start();

  // slogan fade
  useEffect(() => {
    const cycle = Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600,  useNativeDriver: true }),
      Animated.delay(1400),
      Animated.timing(fadeAnim, { toValue: 0, duration: 600,  useNativeDriver: true }),
    ]);
    Animated.loop(cycle).start();
  }, []);

  // rotate slogans
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % SLOGANS.length), 2600);
    return () => clearInterval(id);
  }, []);

  const login = async () => {
    if (!email || !password) {
      return Alert.alert('Validation', 'Please enter both email and password.');
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
      colors={['#fffdf9', '#f3f1ee']}
      start={[0, 0]} end={[1, 1]}
      style={styles.background}
    >
      {/* subtle background circles */}
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <SafeAreaView style={styles.safe}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Image
            source={require('../../assets/clothes.png')}
            style={styles.topLogo}
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.topButton}
            activeOpacity={0.7}
          >
            <Text style={styles.topButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Welcome Back</Text>
          <Animated.Text style={[styles.slogan, { opacity: fadeAnim }]}>
            {SLOGANS[idx]}
          </Animated.Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <View style={styles.imageWrapper}>
            <Image
              source={require('../../assets/clothes.png')}
              style={styles.cardImage}
            />
          </View>

          {/* Email */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            style={[
              styles.input,
              emailFocused && styles.inputFocused
            ]}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />

          {/* Password */}
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            style={[
              styles.input,
              passwordFocused && styles.inputFocused
            ]}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />

          {/* Sign In */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={login}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={loading ? ['#cccccc', '#aaaaaa'] : ['#89f7fe', '#66a6ff']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Signing In…' : 'Sign In'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer Link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Scan')}
            style={styles.footerLinkWrap}
            activeOpacity={0.7}
          >
            <Text style={styles.footerLinkText}>
              Have a QR? Scan Donation
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, position: 'relative' },
  circleTop: {
    position: 'absolute',
    width: 200, height: 200,
    backgroundColor: '#89f7fe33',
    borderRadius: 100,
    top: -80, left: -80,
  },
  circleBottom: {
    position: 'absolute',
    width: 300, height: 300,
    backgroundColor: '#66a6ff22',
    borderRadius: 150,
    bottom: -120, right: -100,
  },
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 32 : 0,
    paddingHorizontal: 20,
  },
  topBar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  topLogo: { width: 36, height: 36 },
  topButton: {
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#66a6ff20',
  },
  topButtonText: {
    color: '#66a6ff',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  headerContainer: { alignItems: 'center', marginBottom: 24 },
  header: {
    fontSize: 32,
    fontWeight: '800',
    color: '#66a6ff',
    letterSpacing: 0.5,
  },
  slogan: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#89f7fe',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 40,
    padding: 24,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  imageWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 6,
    marginBottom: 16,
    transform: [{ rotate: '-3deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
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
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputFocused: {
    borderColor: '#66a6ff',
  },
  button: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footerLinkWrap: { marginTop: 16 },
  footerLinkText: {
    color: '#66a6ff',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});
