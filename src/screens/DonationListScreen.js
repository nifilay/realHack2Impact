import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Tracking from '../components/Tracking';

// Static placeholder data
const mockDonations = [
  {
    _id: '1',
    details: 'Sample donation: 3 books',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    details: 'Sample donation: 5 canned goods',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
];

export default function DonationListScreen() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = id => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const renderDonation = ({ item }) => {
    const isExpanded = item._id === expandedId;
    return (
      <View>
        <TouchableOpacity onPress={() => toggleExpand(item._id)}>
          <View style={styles.card}>
            <Text style={styles.details}>{item.details}</Text>
            <Text style={styles.meta}>
              Status: <Text style={styles.status}>{item.status}</Text>
            </Text>
            <Text style={styles.meta}>
              Created: {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.expanded}>
            <Tracking />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {mockDonations.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>You haven’t made any donations yet.</Text>
        </View>
      ) : (
        <FlatList
          data={mockDonations}
          keyExtractor={item => item._id}
          renderItem={renderDonation}
          extraData={expandedId}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  empty: { color: '#555', fontSize: 16 },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  details: { fontSize: 16, marginBottom: 4, color: '#333' },
  meta: { fontSize: 14, color: '#666' },
  status: { fontWeight: '600', color: '#66a6ff' },
  expanded: {
    backgroundColor: '#eef',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
});