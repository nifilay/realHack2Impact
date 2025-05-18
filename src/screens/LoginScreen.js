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

const SLOGANS = [
  'Restore Dignity',
  'Empower Lives',
  'Join the Mission',
];

export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  // Animated slogan logic (unchanged)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [idx, setIdx] = useState(0);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const cycle = Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.delay(1400),
      Animated.timing(fadeAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]);
    Animated.loop(cycle).start();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % SLOGANS.length), 2600);
    return () => clearInterval(id);
  }, []);

  // ← FIXED login: no API import, uses axios.defaults.baseURL from App.js
  const login = async () => {
    if (!email.trim() || !password) {
      return Alert.alert('Validation', 'Please enter both email and password.');
    }
    try {
      setLoading(true);
      // because App.js set axios.defaults.baseURL = http://<host>:3000/api
      // this calls POST http://<host>:3000/api/auth/login
      const res = await axios.post('/auth/login', { email, password });
      const { token } = res.data;
      // persist & set header
      await AsyncStorage.setItem('userToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // let App.js know we succeeded
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
      start={[0, 0]}
      end={[1, 1]}
      style={styles.background}
    >
      <SafeAreaView style={styles.safe}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Image
            source={require('../../assets/clothes.png')}
            style={styles.topLogo}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.topButton}>
            <Text style={styles.topButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Header & Animated Slogan */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Welcome Back</Text>
          <Animated.Text style={[styles.slogan, { opacity: fadeAnim }]}>
            {SLOGANS[idx]}
          </Animated.Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <View style={styles.imageWrapper}>
            <Image
              source={require('../../assets/clothes.png')}
              style={styles.cardImage}
            />
          </View>

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

          <TouchableOpacity onPress={() => navigation.navigate('Scan')} style={styles.footerLinkWrap}>
            <Text style={styles.footerLinkText}>Have a QR? Scan Donation</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 32 : 0,
    paddingHorizontal: 20,
  },
  topBar: {
    height: 50, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 16,
  },
  topLogo:    { width: 36, height: 36 },
  topButton:  { paddingVertical:6,paddingHorizontal:12, borderRadius:20, backgroundColor:'#66a6ff20' },
  topButtonText: { color:'#66a6ff', fontWeight:'600' },

  headerContainer:{ alignItems:'center', marginBottom:24 },
  header:         { fontSize:30,fontWeight:'800',color:'#333' },
  slogan:         { fontSize:16,fontStyle:'italic',color:'#555',marginTop:4 },

  card: {
    backgroundColor:'#fff', width:'90%', alignSelf:'center',
    borderRadius:40, padding:24, alignItems:'center', marginVertical:20,
    shadowColor:'#000', shadowOffset:{width:0,height:6},
    shadowOpacity:0.1, shadowRadius:12, elevation:6,
  },
  imageWrapper:{
    backgroundColor:'#fff',borderRadius:12,padding:6,marginBottom:16,
    transform:[{rotate:'-3deg'}],shadowColor:'#000',shadowOpacity:0.1,
    shadowOffset:{width:0,height:4},shadowRadius:8,elevation:4,
  },
  cardImage:{ width:200,height:200,borderRadius:8 },

  input: {
    width:'100%', backgroundColor:'#f0f0f5', borderRadius:12,
    paddingHorizontal:16, paddingVertical:14, marginBottom:16,
    fontSize:16, color:'#333',
  },
  button:        { width:'100%', borderRadius:12, overflow:'hidden', marginTop:8 },
  buttonDisabled:{ opacity:0.6 },
  buttonGradient:{ paddingVertical:16, alignItems:'center' },
  buttonText:    { color:'#fff', fontSize:18, fontWeight:'700' },

  footerLinkWrap:{ marginTop:16 },
  footerLinkText:{ color:'#66a6ff', fontSize:15, textDecorationLine:'underline' },
});
