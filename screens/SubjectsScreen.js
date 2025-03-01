import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ScrollView, 
  Image,
  Animated
} from 'react-native';
import { Audio } from 'expo-av';
import { getSubjects, isSubjectUnlocked } from '../services/quizService';
import { getUser } from '../services/authService';
import quiz from '../assets/quiz.png';
import logo from '../assets/logo.png';

const SubjectsScreen = ({ navigation }) => {
  const [subjects, setSubjects] = useState([]);
  const [unlockedSubjects, setUnlockedSubjects] = useState([1]); // ICT unlocked by default
  const [user, setUser] = useState(null);
  const [sound, setSound] = useState();
  
  // Animation values
  const quizImageAnim = useRef(new Animated.Value(0)).current;
  const subjectHeaderAnim = useRef(new Animated.Value(-100)).current;

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
    
    // Start animations
    startFloatingAnimation();
    startHeaderAnimation();
    
    return () => {
      // Clean up sound
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);
  
  // Separate animation functions for better readability and error handling
  const startFloatingAnimation = () => {
    // Simple floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(quizImageAnim, {
          toValue: -10,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing(quizImageAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  const startHeaderAnimation = () => {
    // Simple slide-in animation
    Animated.timing(subjectHeaderAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true
    }).start();
  };
  
  // Play button sound
  const playButtonSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/ClickSound.mp3')
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleSubjectPress = (subjectId) => {
    playButtonSound();
    navigation.navigate('Quizzes', { subjectId });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={logo} style={styles.logo} />
      
      <Animated.Image 
        source={quiz} 
        style={[
          styles.quizImage, 
          { transform: [{ translateY: quizImageAnim }] }
        ]} 
      />
      
      <Animated.Text 
        style={[
          styles.subHeader, 
          { transform: [{ translateX: subjectHeaderAnim }] }
        ]}
      >
        CHOOSE SUBJECT:
      </Animated.Text>
      
      {subjects.map((subject) => (
        <TouchableOpacity
          key={subject.id}
          style={[
            styles.subjectButton,
            !unlockedSubjects.includes(subject.id) && styles.disabledButton,
          ]}
          onPress={() => handleSubjectPress(subject.id)}
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