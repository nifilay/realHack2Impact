// src/screens/ScanDonationScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Alert,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const CIRCLE_SIZE = 200;

export default function ScanDonationScreen({ navigation }) {
  // On web, show notice
  if (Platform.OS === 'web') {
    return (
      <View style={styles.centered}>
        <Text style={styles.webNotice}>
          QR scanning is only supported on iOS & Android.
        </Text>
      </View>
    );
  }

  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScan = useCallback(
    async ({ data }) => {
      if (scanning) return;
      setScanning(true);
      try {
        await axios.post('https://your-api.com/scan', { donationId: data });
        Alert.alert('Success', 'Donation logged!');
      } catch (err) {
        Alert.alert('Error', err.message);
      } finally {
        setScanning(false);
      }
    },
    [scanning]
  );

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#66a6ff" />
        <Text style={styles.loadingText}>Requesting camera permission…</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Ionicons name="camera-off-outline" size={48} color="#aaa" />
        <Text style={styles.loadingText}>
          No camera access. Please enable it in settings.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Decorative Circles */}
      <View style={styles.decorTop} />
      <View style={styles.decorBottom} />

      {/* Semi-transparent overlay */}
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(243,241,238,0.9)']}
        style={StyleSheet.absoluteFill}
        start={[0, 0]}
        end={[1, 1]}
      />

      <SafeAreaView style={styles.safe}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Donation</Text>
          <View style={{ width: 28 }} /> {/* placeholder for spacing */}
        </View>

        {/* Scanner View */}
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={handleScan}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Framing Overlay */}
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.overlayText}>
              Point camera at the QR code
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  safe: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  webNotice: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  // Decorative circles
  decorTop: {
    position: 'absolute',
    top: -CIRCLE_SIZE / 2,
    left: -CIRCLE_SIZE / 3,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#66a6ff33',
  },
  decorBottom: {
    position: 'absolute',
    bottom: -CIRCLE_SIZE / 2,
    right: -CIRCLE_SIZE / 4,
    width: CIRCLE_SIZE * 1.2,
    height: CIRCLE_SIZE * 1.2,
    borderRadius: (CIRCLE_SIZE * 1.2) / 2,
    backgroundColor: '#89f7fe33',
  },
  // Header
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  // Scanner
  scannerContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
    // shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    // elevation for Android
    elevation: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: '70%',
    aspectRatio: 1,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    marginBottom: 20,
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
