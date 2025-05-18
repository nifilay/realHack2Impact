// src/screens/DonationListScreen.js
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

export default function DonationListScreen() {
  const [donations, setDonations] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/donations');
        if (active) setDonations(data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6ea9ff" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }
  if (donations.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No donations yet.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={donations}
        keyExtractor={item => item._id}
        renderItem={({ item }) => {
          // last history entry:
          const last = item.history[item.history.length - 1] || {};
          return (
            <View style={styles.card}>
              <Text style={styles.details}>{item.details}</Text>
              <Text>
                Current status: <Text style={styles.bold}>{item.status}</Text>
              </Text>
              <Text>
                Last scanned in <Text style={styles.bold}>{last.city || 'n/a'}</Text>{' '}
                on{' '}
                <Text style={styles.bold}>
                  {last.timestamp
                    ? new Date(last.timestamp).toLocaleString()
                    : 'n/a'}
                </Text>
              </Text>
              <Text style={styles.historyTitle}>History:</Text>
              {item.history.map((h, i) => (
                <Text key={i} style={styles.historyItem}>
                  {i+1}. {h.status} in {h.city || 'n/a'} on{' '}
                  {h.timestamp
                    ? new Date(h.timestamp).toLocaleString()
                    : 'n/a'}
                </Text>
              ))}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f9f9f9' },
  centered:  { flex:1, justifyContent:'center', alignItems:'center' },
  error:     { color:'red' },
  card:      { padding:16, backgroundColor:'#fff', margin:8, borderRadius:8, elevation:2 },
  details:   { fontSize:16, fontWeight:'500', marginBottom:4 },
  bold:      { fontWeight:'700' },
  historyTitle: { marginTop:8, fontWeight:'600' },
  historyItem:  { fontSize:12, color:'#555' },
});
