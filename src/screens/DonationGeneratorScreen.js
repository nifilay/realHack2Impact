// src/screens/DonationGeneratorScreen.js

import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 1.2;

export default function DonationGeneratorScreen({ navigation }) {
  const [details, setDetails]       = useState('');
  const [donationId, setDonationId] = useState(null);
  const [loading, setLoading]       = useState(false);

  const handleGenerate = async () => {
    console.log('▶️ Generate button pressed');
    if (!details.trim()) {
      return Alert.alert('Validation', 'Please enter donation details.');
    }
    try {
      setLoading(true);
      const response = await axios.post('/donations', { details });
      console.log('🔔 POST /donations →', response.data);

      const id = response.data._id || response.data.id;
      if (!id) throw new Error('No ID returned');
      setDonationId(String(id));

    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.decorTop} />
      <View style={styles.decorBottom} />

      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(243,241,238,0.9)']}
        style={StyleSheet.absoluteFill}
        start={[0, 0]} end={[1, 1]}
      />

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>New Donation</Text>
          <Text style={styles.subtitle}>
            Fill out the form and tap “Generate QR” to log your donation.
          </Text>

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Ionicons name="pricetag-outline" size={20} color="#66a6ff" />
              <TextInput
                style={styles.input}
                placeholder="Donation Details"
                placeholderTextColor="#999"
                value={details}
                onChangeText={setDetails}
                multiline
              />
            </View>
            <Text style={styles.helperText}>e.g. 10 T-shirts, 5 bars soap</Text>

            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={handleGenerate}
              disabled={loading}
            >
              <LinearGradient
                colors={['#66a6ff', '#89f7fe']}
                start={[0,0]} end={[1,1]}
                style={styles.button}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.buttonText}>Generate QR</Text>
                }
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {donationId && (
            <View style={styles.qrContainer}>
              <QRCode
                value={donationId}
                size={width * 0.6}
                color="#66a6ff"
                backgroundColor="white"
              />
              <Text style={styles.qrLabel}>
                Scan this code to advance its status
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Donations')}>
                <Text style={styles.link}>View My Donations</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex:1, backgroundColor:'#F5F7FA' },
  safe:         { flex:1 },
  scroll:       { padding:24, alignItems:'center', paddingBottom:60 },
  decorTop:     {
    position:'absolute', top:-CIRCLE_SIZE/2, left:-CIRCLE_SIZE/3,
    width:CIRCLE_SIZE, height:CIRCLE_SIZE, borderRadius:CIRCLE_SIZE/2,
    backgroundColor:'#66a6ff33'
  },
  decorBottom:  {
    position:'absolute', bottom:-CIRCLE_SIZE/2, right:-CIRCLE_SIZE/4,
    width:CIRCLE_SIZE*1.2, height:CIRCLE_SIZE*1.2,
    borderRadius:(CIRCLE_SIZE*1.2)/2, backgroundColor:'#89f7fe33'
  },
  title:        { fontSize:32, fontWeight:'800', color:'#333', marginBottom:8 },
  subtitle:     { fontSize:16, color:'#555', textAlign:'center', marginBottom:24 },
  card:         {
    width:'100%', maxWidth:360, backgroundColor:'#fff', borderRadius:24,
    padding:20, alignItems:'center',
    shadowColor:'#000', shadowOffset:{width:0,height:6},
    shadowOpacity:0.12, shadowRadius:16, elevation:8, marginBottom:32
  },
  inputContainer:{
    width:'100%', flexDirection:'row', alignItems:'flex-start',
    backgroundColor:'#F4F6F8', borderRadius:12, padding:12
  },
  input:        { flex:1, marginLeft:8, fontSize:16, color:'#333', minHeight:60 },
  helperText:   { fontSize:13, color:'#999', alignSelf:'flex-start', marginTop:4 },
  buttonWrapper:{ width:'100%', marginTop:20, borderRadius:12, overflow:'hidden' },
  button:       { paddingVertical:16, alignItems:'center' },
  buttonText:   { color:'#fff', fontSize:18, fontWeight:'700' },
  qrContainer:  { alignItems:'center', marginTop:16 },
  qrLabel:      { marginTop:12, fontSize:16, color:'#555', textAlign:'center' },
  link:         { marginTop:12, fontSize:16, color:'#66a6ff', textDecorationLine:'underline' },
});
