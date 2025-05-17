// src/screens/HomeScreen.js

import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 1.2;

export default function HomeScreen({ onLogout }) {
  return (
    <View style={styles.container}>
      {/* Decorative Gradient Circles */}
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      {/* Semi-transparent Overlay */}
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(243,241,238,0.9)']}
        style={StyleSheet.absoluteFill}
        start={[0, 0]}
        end={[1, 1]}
      />

      <SafeAreaView style={styles.safe}>
        {/* Greeting Card */}
        <LinearGradient
          colors={['#89f7fe', '#66a6ff']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.cardBorder}
        >
          <View style={styles.card}>
            <Text style={styles.welcome}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              It’s great to see you again. What would you like to do today?
            </Text>

            <TouchableOpacity style={styles.button} onPress={onLogout}>
              <LinearGradient
                colors={['#66a6ff', '#89f7fe']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.buttonInner}
              >
                <Ionicons name="exit-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Log Out</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  // large soft circles for depth
  circleTop: {
    position: 'absolute',
    top: -CIRCLE_SIZE / 2,
    left: -CIRCLE_SIZE / 3,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#66a6ff33',
  },
  circleBottom: {
    position: 'absolute',
    bottom: -CIRCLE_SIZE / 2,
    right: -CIRCLE_SIZE / 4,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#89f7fe33',
  },
  // card border
  cardBorder: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 32,
    padding: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
});
