// src/screens/AboutScreen.js
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  useWindowDimensions,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

export default function AboutScreen() {
  const { width } = useWindowDimensions();
  const isSmall = width < 600;

  return (
    <ScrollView className="bg-background flex-1 p-6">
      {/* HEADER */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-3xl font-serif text-slate">Project Ropa</Text>
        <View className="flex-row">
          <Pressable onPress={() => {/* link to socials */}}>
            <Entypo name="instagram" size={24} color="#777777" className="mx-2" />
          </Pressable>
          <Pressable onPress={() => {/* link to website */}}>
            <MaterialIcons name="public" size={24} color="#777777" className="mx-2" />
          </Pressable>
          <Pressable onPress={() => Linking.openURL('mailto:info@projectropa.org')}>
            <MaterialIcons name="email" size={24} color="#777777" className="mx-2" />
          </Pressable>
        </View>
      </View>

      {/* MISSION */}
      <Text className="text-base text-slate mb-4">
        <Text className="font-bold">Mission: </Text>
        Restore dignity and empower lives by providing clothing & hygiene essentials directly to those in need.
      </Text>

      {/* CONTACT / CTA SECTION */}
      <LinearGradient
        colors={['#ffe4f0','#e0ccff','#ccefff']}
        start={[0,0]}
        end={[1,1]}
        style={{
          borderRadius: 16,
          padding: 24,
          marginVertical: 16,
        }}
      >
        <View className={`${isSmall ? 'flex-col' : 'flex-row'} justify-between`}>
          {/* Left */}
          <View className="flex-1 pr-4">
            <Text className="text-3xl mb-2">👕</Text>
            <Text className="italic text-lg mb-2">
              Mobile clothing closet & community bank keeping essentials out of landfills…
            </Text>
            <View className="h-px bg-gray-300 my-3" />
            <Text className="text-md text-midgray leading-6">
              e.g. Clean clothes, shoes, hygiene kits, bulk distribution to shelters & outreach programs.
            </Text>
          </View>

          {/* Right */}
          <View className="flex-1 pl-4 justify-center">
            <Text className="font-serif text-2xl mb-1">Let’s talk! 💬</Text>
            <Text className="italic text-midgray mb-2">
              Reach out via email:
            </Text>
            <Pressable onPress={() => Linking.openURL('mailto:info@projectropa.org')}>
              <Text className="text-lg underline text-babyblue">
                info@projectropa.org
              </Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      {/* COMMUNITIES HEADER */}
      <View className="flex-row flex-wrap mt-6 mb-2">
        <Text className="font-serif text-3xl text-slate">
          Our Communities 🤝
        </Text>
        <Text className="font-serif text-2xl text-gray-400 ml-2">
          / Partners & Volunteers
        </Text>
      </View>

      {/* (You can drop in a FlatList of logos here, each in a card with bg-pink rounded-lg shadow) */}
    </ScrollView>
  );
}
