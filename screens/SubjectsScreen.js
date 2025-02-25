import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Image } from 'react-native';
import { getSubjects, isSubjectUnlocked } from '../services/quizService';
import { getUser } from '../services/authService';
import quiz from '../assets/quiz.png';
import logo from '../assets/logo.png';

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
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Image source={quiz} style={styles.quizImage} />
      <Text style={styles.subHeader}>CHOOSE SUBJECT:</Text>
      {subjects.map((subject) => (
        <TouchableOpacity
          key={subject.id}
          style={[styles.subjectButton, !unlockedSubjects.includes(subject.id) && styles.disabledButton]}
          onPress={() => navigation.navigate('Quizzes', { subjectId: subject.id })}
          disabled={!unlockedSubjects.includes(subject.id)}
        >
          <Text style={styles.subjectText}>{subject.name}</Text>
        </TouchableOpacity>
      ))}
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
    height: 100,
    
  },
  quizImage: {
    width: 250,
    height: 150,
   
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
    borderRadius: 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#006BF8',
    backgroundColor: '#006BF8',
  },
  subjectText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    borderColor: '#aaa',
  },
});

export default SubjectsScreen;
