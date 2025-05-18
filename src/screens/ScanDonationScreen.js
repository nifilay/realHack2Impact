// src/screens/ScanDonationScreen.js

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function ScanDonationScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);

  const handleBarCodeScanned = useCallback(
    async ({ data }) => {
      if (scanning) return;
      setScanning(true);
      try {
        await axios.post(`/donations/${data}/scan`);
        Alert.alert('Success', 'Donation logged!');
        navigation.navigate('Donations');
      } catch (err) {
        Alert.alert('Error', err.response?.data?.error || err.message);
      } finally {
        setScanning(false);
      }
    },
    [scanning, navigation]
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.centered}>
        <Text style={styles.notice}>QR scanning only works on device.</Text>
      </View>
    );
  }
  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#66a6ff" />
        <Text style={styles.loadingText}>Loading permissions…</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>
          We need camera access to scan QR codes
        </Text>
        <TouchableOpacity
          style={styles.permButton}
          onPress={requestPermission}
        >
          <Text style={styles.permButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Scan Donation QR</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.cameraWrapper}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            barcodeScannerSettings={{
              // use the literal string "qr"
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={handleBarCodeScanned}
          />
          {scanning && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex:1, backgroundColor:'#F5F7FA' },
  safe:          { flex:1 },
  centered:      { flex:1,justifyContent:'center',alignItems:'center',padding:20 },
  notice:        { fontSize:16, color:'#555', textAlign:'center' },
  loadingText:   { marginTop:12, fontSize:16, color:'#555', textAlign:'center' },
  permButton:    { marginTop:20, padding:12, backgroundColor:'#66a6ff', borderRadius:8 },
  permButtonText:{ color:'#fff', fontWeight:'600' },

  header:        {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    padding:20,
  },
  title:         { fontSize:20, fontWeight:'700', color:'#333' },

  cameraWrapper: {
    flex:1,
    margin:20,
    borderRadius:24,
    overflow:'hidden',
    shadowColor:'#000',
    shadowOffset:{ width:0, height:6 },
    shadowOpacity:0.1,
    shadowRadius:16,
    elevation:8,
  },
  overlay:       {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent:'center',
    alignItems:'center',
  },
});
