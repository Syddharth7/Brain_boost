import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { getQuestions, submitScores } from '../services/quizService';
import { getUser } from '../services/authService';
import logo from '../assets/logo.png';
import quizCharacter from '../assets/boy.png';

const QuizScreen = ({ route, navigation }) => {
  const { quizId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await getQuestions(quizId);
      if (error) Alert.alert('Error', error.message);
      else setQuestions(data);
    };

    const fetchUser = async () => {
      const { data, error } = await getUser();
      if (error) {
        console.error('❌ Error fetching user:', error);
      } else {
        console.log('✅ Fetched user:', data.user);
        setUser(data.user);
      }
    };

    fetchQuestions();
    fetchUser();
  }, [quizId]);

  const handleAnswer = async (isCorrect) => {
    const newScore = isCorrect ? score + 1 : score;

    if (currentIndex + 1 < questions.length) {
      setScore(newScore);
      setCurrentIndex(currentIndex + 1);
    } else {
      setScore(newScore);
      if (!user?.id) {
        Alert.alert('Error', 'User not found. Please log in again.');
        return;
      }

      const { error } = await submitScores(user.id, quizId, newScore);
      if (error) {
        Alert.alert('Error', 'Failed to save score');
      } else {
        Alert.alert('Quiz Completed!', `Your score: ${newScore}/${questions.length}`);
        navigation.navigate('Quizzes', { subjectId: route.params.subjectId });
      }
    }
  };

  if (questions.length === 0) return <Text>Loading questions...</Text>;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>{'\u2190'}</Text>
      </TouchableOpacity>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.questionText}>{questions[currentIndex].question}</Text>
      <Image source={quizCharacter} style={styles.character} />
      {questions[currentIndex].options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionButton}
          onPress={() => handleAnswer(option.isCorrect)}
        >
          <Text style={styles.optionText}>{option.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  character: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  optionButton: {
    width: 300,
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 25,
    backgroundColor: '#006BF8',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default QuizScreen;
