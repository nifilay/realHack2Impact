// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import axios from 'axios';

const API = 'http://<YOUR_SERVER_IP>:3000'; // update with your server

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone]     = useState('');

  // 1) load existing profile (if any)
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/profile`);
        if (res.data) {
          setFullName(res.data.fullName);
          setPhone(res.data.phone);
        }
      // even on 404 we just let them fill in
      } catch (err) {}
      setLoading(false);
    })();
  }, []);

  const saveProfile = async () => {
    if (!fullName.trim()) {
      return Alert.alert('Validation', 'Please enter your name.');
    }
    setLoading(true);
    try {
      await axios.post(`${API}/profile`, { fullName, phone });
      // after saving, go to the main donation flow
      navigation.replace('Generate');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone (optional)"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <Button title="Save Profile" onPress={saveProfile} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex:1, alignItems:'center', justifyContent:'center' },
  container: { flex:1, padding:24 },
  title:     { fontSize:24, fontWeight:'bold', marginBottom:24 },
  form:      { },
  input:     {
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:8,
    padding:12,
    marginBottom:16,
  },
});
