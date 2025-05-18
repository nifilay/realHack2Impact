// src/screens/DonationListScreen.js

import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

export default function DonationListScreen() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/donations');
      setDonations(res.data);
    } catch (err) {
      Alert.alert('Error', 'Could not load donations.');
    } finally {
      setLoading(false);
    }
  }, []);

  // re-fetch whenever the screen comes into focus
  useFocusEffect(fetchDonations);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6ea9ff" />
      </View>
    );
  }

  if (donations.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.empty}>You haven’t made any donations yet.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={donations}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.details}>{item.details}</Text>
            <Text style={styles.meta}>
              Status: <Text style={styles.status}>{item.status || 'pending'}</Text>
            </Text>
            <Text style={styles.meta}>
              Created: {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff', padding:16 },
  center:    { flex:1, justifyContent:'center', alignItems:'center', padding:16 },
  empty:     { color:'#555', fontSize:16 },
  card:      {
    backgroundColor:'#f9f9f9',
    borderRadius:8,
    padding:16,
    marginBottom:12,
    shadowColor:'#000',
    shadowOffset:{width:0,height:2},
    shadowOpacity:0.05,
    shadowRadius:4,
    elevation:2,
  },
  details:  { fontSize:16, marginBottom:4, color:'#333' },
  meta:     { fontSize:14, color:'#666' },
  status:   { fontWeight:'600', color:'#66a6ff' },
});
