import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { getQuizzes, isQuizUnlocked } from '../services/quizService';
import { getUser } from '../services/authService';
import logo from '../assets/logo.png';
import quizBanner from '../assets/quiz.png';
import keyboardMouse from '../assets/computer.png';

const QuizzesScreen = ({ route, navigation }) => {
    const { subjectId } = route.params;
    const [quizzes, setQuizzes] = useState([]);
    const [unlockedQuizzes, setUnlockedQuizzes] = useState([1]); // Quiz 1 is always unlocked
    const [user, setUser] = useState(null);
  
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
    }, [subjectId]);
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.header}>QUIZZES</Text>
        <Image source={quizBanner} style={styles.quizBanner} />
        {quizzes.map((quiz) => (
          <TouchableOpacity 
            key={quiz.id} 
            style={[styles.quizButton, !unlockedQuizzes.includes(quiz.id) && styles.disabledButton]} 
            onPress={() => navigation.navigate('Quiz', { quizId: quiz.id, subjectId })} 
            disabled={!unlockedQuizzes.includes(quiz.id)}
          >
            <Text style={styles.quizText}>{quiz.title}</Text>
          </TouchableOpacity>
        ))}
        <Image source={keyboardMouse} style={styles.footerImage} />
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