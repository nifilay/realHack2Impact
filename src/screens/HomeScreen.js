// src/screens/HomeScreen.js
import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ onLogout }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>You’re logged in!</Text>
      <Button title="Log Out" onPress={onLogout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:24 },
  welcome:   { fontSize:20, marginBottom:24 },
});
