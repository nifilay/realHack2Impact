// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert
} from 'react-native';
import axios from 'axios';
import { API } from '../../App';

export default function RegisterScreen({ navigation, onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const register = async () => {
    try {
      const res = await axios.post(`${API}/auth/register`, { email, password });
      const { token } = res.data;
      onLogin(token);
    } catch (err) {
      Alert.alert('Registration failed', err.response?.data?.error || err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign Up" onPress={register} />
      <View style={{ height: 12 }} />
      <Button
        title="Have an account? Sign In"
        onPress={() => navigation.navigate('Login')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:24, justifyContent:'center' },
  title:     { fontSize:24, fontWeight:'bold', marginBottom:24, textAlign:'center' },
  input:     {
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:8,
    padding:12,
    marginBottom:16,
  },
});
