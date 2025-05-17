import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';

export default function DonationGeneratorScreen() {
  const [details, setDetails] = useState('');
  const [donationId, setDonationId] = useState('');

  const createDonation = async () => {
    try {
      // TODO: point to your real backend when ready
      const res = await axios.post('https://your-api.com/donations', { details });
      setDonationId(res.data.donationId);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Donation Details</Text>
        <TextInput
          style={styles.input}
          value={details}
          onChangeText={setDetails}
          placeholder="e.g. 10 T-shirts, 5 bars soap"
        />
        <Button title="Generate QR" onPress={createDonation} />
      </View>

      {donationId ? (
        <View style={styles.qrContainer}>
          <QRCode value={donationId} size={200} />
          <Text style={styles.idText}>ID: {donationId}</Text>
        </View>
      ) : (
        <Text style={styles.placeholder}>
          Fill out the form and tap “Generate QR” to see your code.
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  form: { marginBottom: 24 },
  label: { fontSize: 18, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  qrContainer: { alignItems: 'center' },
  idText: { marginTop: 12, fontSize: 16 },
  placeholder: { textAlign: 'center', color: '#666' },
});
