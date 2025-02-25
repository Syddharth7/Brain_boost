import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { getSubjects, isSubjectUnlocked } from '../services/quizService';
import { getUser } from '../services/authService';

const SubjectsScreen = ({ navigation }) => {
  const [subjects, setSubjects] = useState([]);
  const [unlockedSubjects, setUnlockedSubjects] = useState([1]); // ICT unlocked by default
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data, error } = await getSubjects();
      if (error) Alert.alert('Error', error.message);
      else setSubjects(data);
    };

    const fetchUser = async () => {
      const { data, error } = await getUser();
      if (data) {
        setUser(data.user);
        checkUnlockedSubjects(data.user.id);
      }
    };

    const checkUnlockedSubjects = async (userId) => {
      const unlocked = [1]; // ICT is always unlocked
      for (let i = 2; i <= 4; i++) {
        const { unlocked: isUnlocked } = await isSubjectUnlocked(userId, i);
        if (isUnlocked) unlocked.push(i);
      }
      setUnlockedSubjects(unlocked);
    };

    fetchSubjects();
    fetchUser();
  }, []); // Initial fetch

  return (
    <View>
      <Text>Subjects</Text>
      {subjects.map((subject) => (
        <Button
          key={subject.id}
          title={subject.name}
          onPress={() => navigation.navigate('Quizzes', { subjectId: subject.id })}
          disabled={!unlockedSubjects.includes(subject.id)}
        />
      ))}
    </View>
  );
};
export default SubjectsScreen;
