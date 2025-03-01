import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Animated, Easing } from 'react-native';
import { getQuizzes, isQuizUnlocked } from '../services/quizService';
import { getUser } from '../services/authService';
import { Audio } from 'expo-av';
import logo from '../assets/logo.png';
import quizBanner from '../assets/quiz.png';
import keyboardMouse from '../assets/computer.png';

const QuizzesScreen = ({ route, navigation }) => {
    const { subjectId } = route.params;
    const [quizzes, setQuizzes] = useState([]);
    const [unlockedQuizzes, setUnlockedQuizzes] = useState([1]); // Quiz 1 is always unlocked
    const [user, setUser] = useState(null);
    const [sound, setSound] = useState();
    
    // Animation values
    const quizBannerAnim = useRef(new Animated.Value(0)).current;
    const footerImageAnim = useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      const fetchQuizzes = async () => {
        const { data, error } = await getQuizzes(subjectId);
        if (error) Alert.alert('Error', error.message);
        else setQuizzes(data);
      };
  
      const fetchUser = async () => {
        const { data } = await getUser();
        if (data) {
          setUser(data.user);
          checkUnlockedQuizzes(data.user.id);
        }
      };
  
      const checkUnlockedQuizzes = async (userId) => {
        const unlocked = [1]; // Quiz 1 is always unlocked
        for (let i = 2; i <= 5; i++) {
          const { unlocked: isUnlocked } = await isQuizUnlocked(userId, i);
          if (isUnlocked) unlocked.push(i);
        }
        setUnlockedQuizzes(unlocked);
      };
  
      fetchQuizzes();
      fetchUser();
      
      // Start animations
      startFloatingAnimation();
      
      // Load sound
      return () => {
        if (sound) {
          sound.unloadAsync();
        }
      };
    }, [subjectId]);
    
    // Function to load and play button sound
    const playButtonSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/buttonclick.mp3') // Make sure to add this sound file to your assets
        );
        setSound(sound);
        await sound.playAsync();
      } catch (error) {
        console.log('Error playing sound:', error);
      }
    };
    
    // Function to create floating animation - FIXED
    const startFloatingAnimation = () => {
      // Create animation sequence for quiz banner
      Animated.loop(
        Animated.sequence([
          Animated.timing(quizBannerAnim, {
            toValue: 10,
            duration: 1500,
            easing: Easing.sin, // Fixed: Using Easing.sin instead of Easing.inOut(Easing.sine)
            useNativeDriver: true,
          }),
          Animated.timing(quizBannerAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.sin, // Fixed: Using Easing.sin instead of Easing.inOut(Easing.sine)
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Create animation sequence for footer image with slight delay
      Animated.loop(
        Animated.sequence([
          Animated.timing(footerImageAnim, {
            toValue: 15,
            duration: 2000,
            easing: Easing.sin, // Fixed: Using Easing.sin instead of Easing.inOut(Easing.sine)
            useNativeDriver: true,
          }),
          Animated.timing(footerImageAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.sin, // Fixed: Using Easing.sin instead of Easing.inOut(Easing.sine)
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity 
          onPress={() => {
            playButtonSound();
            navigation.goBack();
          }} 
          style={styles.backButton}
        >
          <Text style={styles.backText}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.header}>QUIZZES</Text>
        <Animated.Image 
          source={quizBanner} 
          style={[
            styles.quizBanner, 
            { transform: [{ translateY: quizBannerAnim }] }
          ]} 
        />
        {quizzes.map((quiz) => (
          <TouchableOpacity 
            key={quiz.id} 
            style={[styles.quizButton, !unlockedQuizzes.includes(quiz.id) && styles.disabledButton]} 
            onPress={() => {
              playButtonSound();
              navigation.navigate('Quiz', { quizId: quiz.id, subjectId });
            }} 
            disabled={!unlockedQuizzes.includes(quiz.id)}
          >
            <Text style={styles.quizText}>{quiz.title}</Text>
          </TouchableOpacity>
        ))}
        <Animated.Image 
          source={keyboardMouse} 
          style={[
            styles.footerImage, 
            { transform: [{ translateY: footerImageAnim }] }
          ]} 
        />
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
    width: 150,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  quizBanner: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  quizButton: {
    width: 250,
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 25,
    backgroundColor: '#006BF8',
    alignItems: 'center',
  },
  quizText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#A0C1F8',
  },
  footerImage: {
    width: 250,
    height: 120,
    resizeMode: 'contain',
    marginTop: 20,
  }
});

export default QuizzesScreen;