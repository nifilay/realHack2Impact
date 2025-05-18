// src/screens/DonationListScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

export default function DonationListScreen({ navigation }) {
  const [donations, setDonations] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const { data } = await axios.get('/donations');
          if (active) setDonations(data);
        } catch (e) {
          console.error(e);
        }
      })();
      return () => { active = false };
    }, [])
  );

  return (
    <FlatList
      data={donations}
      keyExtractor={d => d._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Generate')} // or wherever
          style={styles.item}
        >
          <Text style={styles.details}>{item.details}</Text>
          <Text style={styles.status}>Status: {item.status}</Text>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No donations yet.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  item:    { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  details: { fontSize: 16, fontWeight: '500' },
  status:  { fontSize: 14, color: '#0066cc', marginTop: 4 },
  date:    { fontSize: 12, color: '#999', marginTop: 2 },
  empty:   { padding: 16, textAlign: 'center' },
});
