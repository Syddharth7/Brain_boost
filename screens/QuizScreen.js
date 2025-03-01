import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image, Animated, Easing } from 'react-native';
import { getQuestions, submitScores } from '../services/quizService';
import { getUser } from '../services/authService';
import { Audio } from 'expo-av';
import logo from '../assets/logo.png';
import quizCharacter from '../assets/boy.png';
import { Feather } from '@expo/vector-icons'; // Import icons from Expo

const QuizScreen = ({ route, navigation }) => {
  const { quizId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [sound, setSound] = useState();
  const [isMuted, setIsMuted] = useState(false); // Add state for sound muting

  // Animation values
  const characterAnim = useRef(new Animated.Value(0)).current;
  const characterScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await getQuestions(quizId);
      if (error) Alert.alert('Error', error.message);
      else {
        // Randomize questions using Fisher-Yates shuffle algorithm
        const randomizedQuestions = [...data];
        for (let i = randomizedQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [randomizedQuestions[i], randomizedQuestions[j]] = [randomizedQuestions[j], randomizedQuestions[i]];
        }
        setQuestions(randomizedQuestions);
      }
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
    
    // Start floating animation for character
    startCharacterAnimation();

    // Clean up sounds when component unmounts
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [quizId]);

  // Randomize options whenever the current question changes
  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      const randomizedOptions = getRandomizedOptions();
      setCurrentOptions(randomizedOptions);
    }
  }, [questions, currentIndex]);

  // Character animation
  const startCharacterAnimation = () => {
    // Create a continuous floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(characterAnim, {
          toValue: -15,
          duration: 1500,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(characterAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.sin,
          useNativeDriver: true,
        })
      ])
    ).start();
  };

  // Toggle sound mute state
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // Update any current sound's volume immediately
    if (sound) {
      sound.setVolumeAsync(isMuted ? 1.0 : 0.0);
    }
  };

  // Sound effects for correct/incorrect answers with volume control
  const playSound = async (isCorrect) => {
    try {
      // Unload previous sound if exists
      if (sound) {
        await sound.unloadAsync();
      }
      
      // Load the appropriate sound file
      const soundFile = isCorrect 
        ? require('../assets/sounds/correctSound.mp3') 
        : require('../assets/sounds/wrongSound.mp3');
        
      const { sound: newSound } = await Audio.Sound.createAsync(
        soundFile,
        // Set volume based on mute state
        { volume: isMuted ? 0.0 : 1.0 }
      );
      
      // Set sound object to state
      setSound(newSound);
      
      // Configure audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      
      // Only play if not muted
      if (!isMuted) {
        await newSound.playAsync();
      }
      
      // Animate character based on answer
      if (isCorrect) {
        // Happy bounce animation for correct answer
        Animated.sequence([
          Animated.timing(characterScale, {
            toValue: 1.2,
            duration: 300,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(characterScale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
      } else {
        // Shake animation for wrong answer
        Animated.sequence([
          Animated.timing(characterScale, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(characterScale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(characterScale, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(characterScale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          })
        ]).start();
      }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  // Function to randomize answer options for the current question
  const getRandomizedOptions = () => {
    if (questions.length === 0 || !questions[currentIndex]?.options) return [];
    
    const options = [...questions[currentIndex].options];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  };

  const handleOptionSelect = (index, isCorrectAnswer) => {
    setSelectedOptionIndex(index);
    setIsCorrect(isCorrectAnswer);
    setShowFeedback(true);
    
    // Play the appropriate sound based on mute state
    playSound(isCorrectAnswer);
    
    // After showing feedback for 1 second, move to the next question
    setTimeout(() => {
      const newScore = isCorrectAnswer ? score + 1 : score;
      
      if (currentIndex + 1 < questions.length) {
        setScore(newScore);
        setCurrentIndex(currentIndex + 1);
        setSelectedOptionIndex(null);
        setShowFeedback(false);
      } else {
        handleQuizCompletion(newScore);
      }
    }, 1000);
  };

  const handleQuizCompletion = async (finalScore) => {
    if (!user?.id) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    const { error } = await submitScores(user.id, quizId, finalScore);
    if (error) {
      Alert.alert('Error', 'Failed to save score');
    } else {
      // Play a final completion sound if not muted
      if (!isMuted) {
        try {
          const { sound: completionSound } = await Audio.Sound.createAsync(
            require('../assets/complete.mp3'),
            { volume: 1.0 }
          );
          await completionSound.playAsync();
          // Unload after playing
          setTimeout(() => {
            completionSound.unloadAsync();
          }, 2000);
        } catch (error) {
          console.log('Error playing completion sound:', error);
        }
      }
      
      Alert.alert('Quiz Completed!', `Your score: ${finalScore}/${questions.length}`);
      navigation.navigate('Quizzes', { subjectId: route.params.subjectId });
    }
  };

  // Helper function to determine button style based on selection and correctness
  const getOptionButtonStyle = (index) => {
    if (!showFeedback || selectedOptionIndex !== index) {
      return styles.optionButton;
    }
    
    return isCorrect ? styles.correctOptionButton : styles.incorrectOptionButton;
  };

  if (questions.length === 0) return <Text style={styles.loadingText}>Loading questions...</Text>;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>{'\u2190'}</Text>
      </TouchableOpacity>
      
      {/* New Mute Button */}
      <TouchableOpacity onPress={toggleMute} style={styles.muteButton}>
        <Feather 
          name={isMuted ? "volume-x" : "volume-2"} 
          size={24} 
          color="#006BF8" 
        />
      </TouchableOpacity>
      
      <Image source={logo} style={styles.logo} />
      <Text style={styles.progressText}>Question {currentIndex + 1} of {questions.length}</Text>
      <Text style={styles.questionText}>{questions[currentIndex].question}</Text>
      
      {/* Animated character */}
      <Animated.Image 
        source={quizCharacter} 
        style={[
          styles.character,
          { 
            transform: [
              { translateY: characterAnim },
              { scale: characterScale }
            ] 
          }
        ]} 
      />
      
      {currentOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={getOptionButtonStyle(index)}
          onPress={() => handleOptionSelect(index, option.isCorrect)}
          disabled={showFeedback}
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
  // New style for mute button
  muteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  logo: {
    width: 200,
    height: 100,
  },
  progressText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 10,
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
  correctOptionButton: {
    width: 300,
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 25,
    backgroundColor: '#4CAF50', // Green for correct answers
    alignItems: 'center',
  },
  incorrectOptionButton: {
    width: 300,
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 25,
    backgroundColor: '#F44336', // Red for incorrect answers
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});

export default QuizScreen;