// src/screens/ScanDonationScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Alert, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';

export default function ScanDonationScreen({ navigation }) {
  const [granted, setGranted] = useState(null);
  const [busy, setBusy]       = useState(false);

  useEffect(() => {
    BarCodeScanner.requestPermissionsAsync()
      .then(({ status }) => setGranted(status === 'granted'));
  }, []);

  const onScan = useCallback(
    async ({ data: id }) => {
      if (busy) return;
      setBusy(true);
      try {
        const { data } = await axios.post(`/donations/${id}/scan`);
        Alert.alert(
          'Updated!',
          `Donation is now “${data.status}” (step ${data.statusIndex + 1})`
        );
        navigation.goBack();
      } catch (e) {
        Alert.alert('Error', e.response?.data?.error || e.message);
      } finally {
        setBusy(false);
      }
    },
    [busy, navigation]
  );

  if (granted === null) {
    return <ActivityIndicator style={styles.center} />;
  }
  if (!granted) {
    return <Text style={styles.center}>Camera access denied</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <BarCodeScanner onBarCodeScanned={onScan} style={StyleSheet.absoluteFill} />
      <Text style={styles.hint}>Point at QR code</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1 },
  center:    { flex:1, textAlign:'center', marginTop:20 },
  hint:      {
    position:'absolute',
    bottom:40,
    alignSelf:'center',
    padding:8,
    backgroundColor:'#0008',
    color:'#fff',
    borderRadius:4
  }
});
