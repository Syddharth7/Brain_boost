import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../assets/logo.png';
import ictImage from '../assets/computer.png';

const ICTTopics = ({ navigation }) => {
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    checkLessons();
  }, []);

  const checkLessons = async () => {
    let completed = [];
    for (let i = 1; i <= 5; i++) {
      const status = await AsyncStorage.getItem(`ICT_Lesson${i}`);
      if (status === 'true') completed.push(i);
    }
    setCompletedLessons(completed);

    if (completed.length === 5) {
      await AsyncStorage.setItem('ICTCompleted', 'true');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>{'\u2190'}</Text>
      </TouchableOpacity>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.header}>INFORMATION, COMMUNICATION AND TECHNOLOGY (ICT)</Text>
      { [1, 2, 3, 4, 5].map(num => (
        <TouchableOpacity 
          key={num} 
          style={styles.lessonButton} 
          onPress={() => navigation.navigate('Lesson', { subject: 'ICT', lesson: num })}
        >
          <Text style={styles.lessonText}>LESSON {num}</Text>
        </TouchableOpacity>
      )) }
      <Image source={ictImage} style={styles.footerImage} />
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
  },
  backText: {
    fontSize: 24,
    color: '#006BF8',
  },
  logo: {
    width: 200,
    height: 100,
    
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#006BF8',
    marginBottom: 20,
  },
  lessonButton: {
    width: 250,
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 25,
    backgroundColor: '#006BF8',
    alignItems: 'center',
  },
  lessonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  footerImage: {
    width: 350,
    height: 120,
 
  }
});

export default ICTTopics;
