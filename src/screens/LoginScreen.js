// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');

  const tryLogin = () => {
    // *** Replace this with your real auth call ***
    if (email === 'test@example.com' && password === 'password') {
      onLogin({ email });
    } else {
      Alert.alert('Login failed', 'Invalid credentials');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Project Ropa Login</Text>
      <View style={styles.form}>
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
        <Button title="Log In" onPress={tryLogin} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title:     { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 32 },
  form:      { },
  input:     {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});
