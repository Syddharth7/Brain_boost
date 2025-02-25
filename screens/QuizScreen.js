import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { getQuestions, submitScores} from '../services/quizService';
import { getUser } from '../services/authService';

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
      // Ensure the latest score is saved
      setScore(newScore);
      if (!user?.id) {
        Alert.alert('Error', 'User not found. Please log in again.');
        return;
      }
  
      const { error } = await submitScores(user.id, quizId, newScore);
      if (error) {
        Alert.alert('Error', 'Failed to save score');
      } else {
        // Automatically unlock the next quiz
        Alert.alert('Quiz Completed!', `Your score: ${newScore}/${questions.length}`);
  
        // Navigate to Quizzes screen and unlock next quiz
        navigation.navigate('Quizzes', { subjectId: route.params.subjectId });
      }
    }
  };
  
  

  if (questions.length === 0) return <Text>Loading questions...</Text>;

  return (
    <View>
      <Text>{questions[currentIndex].question}</Text>
      {questions[currentIndex].options.map((option, index) => (
        <Button
          key={index}
          title={option.text}
          onPress={() => handleAnswer(option.isCorrect)}
        />
      ))}
    </View>
  );
};

export default QuizScreen;
