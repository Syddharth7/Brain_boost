import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    <View>
      <Text>ICT Lessons</Text>
      {[1, 2, 3, 4, 5].map(num => (
        <Button key={num} title={`Lesson ${num}`} onPress={() => navigation.navigate('Lesson', { subject: 'ICT', lesson: num })} />
      ))}
    </View>
  );
};

export default ICTTopics;
