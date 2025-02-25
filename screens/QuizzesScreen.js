import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { getQuizzes, isQuizUnlocked } from '../services/quizService';
import { getUser } from '../services/authService';

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
    }, [subjectId]);  // Refetch when subjectId changes, e.g. after completing a quiz
  
    return (
      <View>
        <Text>Quizzes</Text>
        {quizzes.map((quiz) => (
          <Button
            key={quiz.id}
            title={quiz.title}
            onPress={() => navigation.navigate('Quiz', { quizId: quiz.id, subjectId })}
            disabled={!unlockedQuizzes.includes(quiz.id)}
          />
        ))}
      </View>
    );
  };

export default QuizzesScreen;
