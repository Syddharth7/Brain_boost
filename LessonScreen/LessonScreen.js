import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../assets/logo.png';
import brainImage from '../assets/brain.png';

const LessonScreen = ({ navigation }) => {
  const [unlocked, setUnlocked] = useState({
    agriculture: false,
    industrialArts: false,
    tourism: false,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkProgress();  // Refresh the unlock status
    });
  
    return unsubscribe;
  }, [navigation]);

  const debugStorage = async () => {
    console.log("📌 Checking AsyncStorage Keys...");
    const keys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(keys);
    console.log("📌 All AsyncStorage Data:", values);
  };

  useEffect(() => {
    checkProgress();
    debugStorage();
  }, []);
  
  const checkProgress = async () => {
    const ictDone = await AsyncStorage.getItem('ICTCompleted');
    const agricultureDone = await AsyncStorage.getItem('AgricultureCompleted');
    const industrialArtsDone = await AsyncStorage.getItem('Industrial ArtsCompleted'); // ✅ Correct key
  
    console.log("📌 DEBUG: Retrieving completion status:", {
      ictDone,
      agricultureDone,
      industrialArtsDone
    });
  
    setUnlocked({
      agriculture: ictDone === 'true',
      industrialArts: agricultureDone === 'true',
      tourism: industrialArtsDone === 'true', // ✅ Now correctly unlocking Tourism
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Image source={brainImage} style={styles.brainImage} />
      <Text style={styles.subHeader}>CHOOSE SUBJECT:</Text>
      <TouchableOpacity style={styles.subjectButton} onPress={() => navigation.navigate('ICTTopics')}>
        <Text style={styles.subjectTextBlue}>ICT</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.subjectButton, unlocked.agriculture ? styles.subjectButtonGreen : styles.disabledButton]} 
        onPress={() => unlocked.agriculture ? navigation.navigate('AgricultureTopics') : Alert.alert("Locked", "Complete ICT first!")}
        disabled={!unlocked.agriculture}
      >
        <Text style={styles.subjectTextGreen}>AGRICULTURE</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.subjectButton, unlocked.industrialArts ? styles.subjectButtonRed : styles.disabledButton]} 
        onPress={() => unlocked.industrialArts ? navigation.navigate('IndustrialArtsTopics') : Alert.alert("Locked", "Complete Agriculture first!")}
        disabled={!unlocked.industrialArts}
      >
        <Text style={styles.subjectTextRed}>INDUS. ARTS</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.subjectButton, unlocked.tourism ? styles.subjectButtonYellow : styles.disabledButton]} 
        onPress={() => unlocked.tourism ? navigation.navigate('TourismTopics') : Alert.alert("Locked", "Complete Industrial Arts first!")}
        disabled={!unlocked.tourism}
      >
        <Text style={styles.subjectTextYellow}>TOURISM</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#E3ECFA',
  },
  logo: {
    width: 200,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  brainImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  subjectButton: {
    width: 250,
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: '#E3ECFA',
  },
  subjectButtonGreen: {
    borderColor: '#4CAF50',
  },
  subjectButtonRed: {
    borderColor: '#E53935',
  },
  subjectButtonYellow: {
    borderColor: '#FBC02D',
  },
  subjectTextBlue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006BF8',
  },
  subjectTextGreen: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  subjectTextRed: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53935',
  },
  subjectTextYellow: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FBC02D',
  },
  disabledButton: {
    borderColor: '#aaa',
    backgroundColor: '#ccc',
  },
});

export default LessonScreen;