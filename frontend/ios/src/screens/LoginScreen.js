// src/screens/LoginScreen.js
import { styled } from 'nativewind';

import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  Pressable,
  Alert,
  Animated,
  Image,
  useWindowDimensions,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../App'; // adjust if your App.js lives elsewhere

// wrap Animated.Text so we can use className
const AnimatedText = styled(Animated.Text);

const SLOGANS = [
  'Restore Dignity',
  'Empower Lives',
  'Join the Mission',
];

export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  // animation state
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [idx, setIdx] = useState(0);
  const { width } = useWindowDimensions();
  const isSmall = width < 350;

  // cycle fade in/out
  useEffect(() => {
    const cycle = Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);
    Animated.loop(cycle).start();
  }, [fadeAnim]);

  // update slogan index
  useEffect(() => {
    const id = setInterval(() => {
      setIdx(i => (i + 1) % SLOGANS.length);
    }, 3100);
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
      colors={['#ffe4f0', '#e0ccff']}
      start={[0, 0]}
      end={[1, 1]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 justify-center items-center px-6">
        {/* Logo */}
        <Image
          source={require('../assets/logo.png')}
          className={`mb-6 ${isSmall ? 'w-24 h-24' : 'w-32 h-32'}`}
          resizeMode="contain"
        />

        {/* Animated slogan */}
        <AnimatedText
          className="text-xl font-serif text-slate mb-8"
          style={{ opacity: fadeAnim }}
        >
          {SLOGANS[idx]}
        </AnimatedText>

        {/* Card */}
        <View className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
          {/* Email */}
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="border border-midgray rounded-lg px-4 py-2 mb-4 text-slate"
            value={email}
            onChangeText={setEmail}
          />

          {/* Password */}
          <TextInput
            placeholder="Password"
            secureTextEntry
            className="border border-midgray rounded-lg px-4 py-2 mb-6 text-slate"
            value={password}
            onChangeText={setPassword}
          />

          {/* Sign In Button */}
          <Pressable
            className="overflow-hidden rounded-lg mb-4"
            onPress={login}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? ['#d1d1d1','#b1b1b1'] : ['#ccefff','#e0ccff']}
              start={[0,0]} end={[1,1]}
              className="py-3"
            >
              <Pressable onPress={login}>
                <AnimatedText className="text-center text-white font-bold text-lg">
                  {loading ? 'Signing In...' : 'Sign In'}
                </AnimatedText>
              </Pressable>
            </LinearGradient>
          </Pressable>

          {/* Create Account */}
          <View className="flex-row justify-center">
            <AnimatedText className="text-midgray mr-2">New here?</AnimatedText>
            <Pressable onPress={() => navigation.navigate('Register')}>
              <AnimatedText className="text-babyblue font-semibold">
                Create Account
              </AnimatedText>
            </Pressable>
          </View>
        </View>

        {/* Footer link */}
        <Pressable
          className="mt-4"
          onPress={() => Linking.openURL('https://projectropa.org')}
        >
          <AnimatedText className="text-sm text-midgray underline">
            Visit our website
          </AnimatedText>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}
