// src/screens/ScanDonationScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function ScanDonationScreen({ navigation }) {
  // 1️⃣ Camera permission hook
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning,   setScanning]       = useState(false);

  // 2️⃣ Ask on mount
  useEffect(() => {
    if (permission === null) return;      // still loading
    if (!permission.granted) requestPermission();
  }, [permission]);

  // 3️⃣ Handle QR scan and record city
  const handleBarcode = useCallback(
    async ({ data: donationId }) => {
      if (scanning) return;
      setScanning(true);

      // get location & reverse‐geocode
      let city = 'unknown';
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const { coords } = await Location.getCurrentPositionAsync();
          const [place]   = await Location.reverseGeocodeAsync(coords);
          city = place.city || place.region || place.country || 'unknown';
        }
      } catch {}

      try {
        const { data: donation } = await axios.post(
          `/donations/${donationId}/scan`,
          { city }
        );
        Alert.alert(
          '✅ Status Updated',
          `Stage ${donation.statusIndex + 1}: ${donation.status}\nIn ${city}`
        );
      } catch (err) {
        Alert.alert('Error', err.response?.data?.error || err.message);
        navigation.goBack();
      } finally {
        // 10s cooldown before scanning again
        setTimeout(() => setScanning(false), 10000);
      }
    },
    [scanning, navigation]
  );

  // 4️⃣ Loading / denied UI
  if (permission === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6ea9ff" />
        <Text style={{ marginTop: 8 }}>Checking camera permission…</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notice}>
          Camera permission is required to scan QR codes.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 5️⃣ Main scanner UI
  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarcode}
      />

      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.hintBox}>
        <Text style={styles.hint}>Point at QR code to advance status</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#000' },
  centered:  { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  notice:    { textAlign:'center', fontSize:16, marginBottom:20, color:'#555' },
  button:    { padding:12, backgroundColor:'#6ea9ff', borderRadius:8 },
  buttonText:{ color:'#fff', fontSize:16 },
  back:      { position:'absolute', top:40, left:20, zIndex:10 },
  hintBox:   { position:'absolute', bottom:50, left:0, right:0, alignItems:'center' },
  hint:      { color:'#fff', fontSize:16 },
});
