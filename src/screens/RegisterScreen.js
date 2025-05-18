// src/screens/RegisterScreen.js

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../App';

export default function RegisterScreen({ navigation, onRegister }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [emailFocused, setEmailFocused]       = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const register = async () => {
    if (!email.trim() || !password.trim()) {
      return Alert.alert('Validation', 'Please enter both email and password.');
    }
    try {
      setLoading(true);
      const res = await axios.post(`/auth/register`, { email, password });
      const { token } = res.data;
      await AsyncStorage.setItem('userToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      onRegister(token);
    } catch (err) {
      Alert.alert('Registration failed', err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#fffdf9', '#f3f1ee']}
      start={[0, 0]}
      end={[1, 1]}
      style={styles.background}
    >
      {/* subtle background circles */}
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Create Account</Text>
            <Text style={styles.subheader}>Join us and make a difference!</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {/* Email */}
            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              style={[
                styles.input,
                emailFocused && styles.inputFocused,
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
                passwordFocused && styles.inputFocused,
              ]}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />

            {/* Sign Up */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={register}
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
                  {loading ? 'Signing Up…' : 'Sign Up'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign In link */}
            <View style={styles.links}>
              <Text style={styles.linkText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.linkAction}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Skip link */}
          <TouchableOpacity onPress={() => navigation.navigate('Generate')} style={styles.footerLinkWrap}>
            <Text style={styles.footerLinkText}>Skip and explore</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const CIRCLE_SMALL = 200;
const CIRCLE_LARGE = 300;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    position: 'relative',
  },
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 32 : 0,
    paddingHorizontal: 20,
  },
  scroll: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  circleTop: {
    position: 'absolute',
    width: CIRCLE_SMALL,
    height: CIRCLE_SMALL,
    backgroundColor: '#89f7fe33',
    borderRadius: CIRCLE_SMALL / 2,
    top: -CIRCLE_SMALL * 0.4,
    left: -CIRCLE_SMALL * 0.4,
  },
  circleBottom: {
    position: 'absolute',
    width: CIRCLE_LARGE,
    height: CIRCLE_LARGE,
    backgroundColor: '#66a6ff22',
    borderRadius: CIRCLE_LARGE / 2,
    bottom: -CIRCLE_LARGE * 0.4,
    right: -CIRCLE_LARGE * 0.3,
  },
  headerContainer: {
    marginTop: 40,
    alignItems: 'center',
    marginBottom: 32,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    color: '#66a6ff',
  },
  subheader: {
    fontSize: 16,
    color: '#89f7fe',
    marginTop: 6,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
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
    letterSpacing: 0.5,
  },
  links: {
    flexDirection: 'row',
    marginTop: 12,
  },
  linkText: {
    color: '#555',
    fontSize: 15,
  },
  linkAction: {
    color: '#66a6ff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  footerLinkWrap: {
    marginTop: 16,
  },
  footerLinkText: {
    color: '#66a6ff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
