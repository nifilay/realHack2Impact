// src/components/Tracking.js

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Tracking({ style }) {
  const locations = ['Santa Monica Warehouse', 'Sorting Center', 'In Transit', 'Delivered'];
  const StartDate = new Date('2025-05-10T08:00:00');
  const CurrentDate = new Date('2025-05-13T14:00:00');

  const data = locations.map((location, idx) => ({
    location,
    date: idx === 0 ? StartDate : idx === locations.length - 1 ? CurrentDate : null,
  }));
  const currentIndex = data.length - 1;

  // Dynamic sizing
  const { width } = Dimensions.get('window');
  const circleSize = Math.min(50, (width - 32) / (data.length * 1.2));
  const lineHeight = circleSize / 3;

  const formatDate = d => (d instanceof Date ? d.toLocaleString() : '');

  const dynamicStyles = StyleSheet.create({
    progressLine: {
      position: 'absolute',
      top: circleSize / 2 + 10,
      width: '80%',
      alignSelf: 'center',
      height: lineHeight,
      backgroundColor: '#007aff77',
      borderRadius: lineHeight / 2,
    },
    stepWrapper: {
      flex: 1,
      alignItems: 'center',
    },
    circle: {
      width: circleSize / 1.3,
      height: circleSize / 1.3,
      borderRadius: circleSize / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    labelWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: circleSize,
    },
    titleText: {
      fontSize: circleSize * 0.25,
      textAlign: 'center',
    },
    dateText: {
      fontSize: circleSize * 0.2,
      textAlign: 'center',
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* progress line */}
      <View style={dynamicStyles.progressLine} />

      {/* circles / checkmarks */}
      <View style={styles.row}>
        {data.map((item, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <View key={idx} style={dynamicStyles.stepWrapper}>
              <View
                style={[
                  dynamicStyles.circle,
                  styles.circleBase,
                  (isCompleted || isCurrent) && styles.activeCircle,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={circleSize * 0.4} color="#fff" />
                ) : (
                  <Text
                    style={[
                      styles.stepLabel,
                      isCurrent && styles.currentLabel,
                      { fontSize: circleSize * 0.4 },
                    ]}
                  >
                    {idx + 1}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* location labels */}
      <View style={styles.row}>
        {data.map((item, idx) => (
          <View key={idx} style={dynamicStyles.labelWrapper}>
            <Text
              style={[
                dynamicStyles.titleText,
                styles.titleText,
                idx === currentIndex && styles.currentText,
              ]}
            >
              {item.location}
            </Text>
          </View>
        ))}
      </View>

      {/* dates */}
      <View style={styles.row}>
        {data.map((item, idx) => (
          <View key={idx} style={dynamicStyles.labelWrapper}>
            <Text
              style={[
                dynamicStyles.dateText,
                styles.dateText,
                idx === currentIndex && styles.currentDateText,
              ]}
            >
              {formatDate(item.date)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleBase: {
    backgroundColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeCircle: {
    backgroundColor: '#007aff',
    shadowColor: '#007aff',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  stepLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  currentLabel: {
    color: '#fff',
  },
  titleText: {
    color: '#555',
  },
  currentText: {
    color: '#007aff',
    fontWeight: '700',
  },
  dateText: {
    color: '#999',
  },
  currentDateText: {
    color: '#007aff',
    fontWeight: '700',
  },
});
