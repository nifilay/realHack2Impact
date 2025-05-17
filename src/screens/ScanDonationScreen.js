import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Alert, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';

export default function ScanDonationScreen() {
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <Text>QR scanning is only supported on iOS & Android.</Text>
      </View>
    );
  }
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    BarCodeScanner.requestPermissionsAsync().then(({ status }) => {
      setHasPermission(status === 'granted');
    });
  }, []);

  const handleScan = async ({ data }) => {
    try {
      // TODO: point to your real backend when ready
      await axios.post('https://your-api.com/scan', { donationId: data });
      Alert.alert('Success', 'Donation logged!');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission…</Text>;
  }
  if (hasPermission === false) {
    return <Text>No camera access. Please enable it in settings.</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BarCodeScanner
        onBarCodeScanned={handleScan}
        style={StyleSheet.absoluteFillObject}
      >
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Point camera at the QR code</Text>
        </View>
      </BarCodeScanner>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 32,
  },
  overlayText: { color: 'white', fontSize: 16 },
});
