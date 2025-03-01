import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Animated, Easing } from 'react-native';
import { logIn } from '../services/authService';
import boy from '../assets/boy.png'
import logo from '../assets/logo.png'
import { Audio } from 'expo-av';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sound, setSound] = useState();
  
  // Create animated values for floating effect
  const floatAnim = useRef(new Animated.Value(0)).current;
  
  // Load sound when component mounts
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  
  // Start the floating animation when component mounts
  useEffect(() => {
    startFloatingAnimation();
  }, []);
  
  // Function to create continuous floating animation
  const startFloatingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        // Float up
        Animated.timing(floatAnim, {
          toValue: -15,  // Move up by 15 pixels
          duration: 1500,
          easing: Easing.sine,  // Fixed: Using direct Easing.sine instead of inOut
          useNativeDriver: true
        }),
        // Float down
        Animated.timing(floatAnim, {
          toValue: 0,  // Back to original position
          duration: 1500,
          easing: Easing.sine,  // Fixed: Using direct Easing.sine instead of inOut
          useNativeDriver: true
        })
      ])
    ).start();
  };

  // Function to play button press sound
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/ClickSound.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  }

  const handleLogin = async () => {
    await playSound();
    
    // Short delay to let sound play before proceeding with login
    setTimeout(async () => {
      const { data, error } = await logIn(email, password);
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        navigation.replace('GetStarted');
      }
    }, 150);
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      
      {/* Replace static Image with Animated.Image for the boy character */}
      <Animated.Image 
        source={boy} 
        style={[
          styles.character,
          {
            transform: [{ translateY: floatAnim }]  // Apply vertical translation animation
          }
        ]} 
      />
      
      <Text style={styles.label}>USERNAME:</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter Username" 
        value={email} 
        onChangeText={setEmail} 
      />
      
      <Text style={styles.label}>PASSWORD:</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>LOG IN</Text>
      </TouchableOpacity>
      
      <Text style={styles.signUpText}>
        Don't have an account? <Text style={styles.signUpLink} onPress={() => navigation.navigate('Signup')}>Sign Up</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3ECFA',
  },
  logo: {
    width: 200,
    height: 100,
  
  },
  character: {
    width: 350,
    height: 300,
    marginBottom:20,
    
    
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 40,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#056AEE',
  },
  input: {
    width: 300,
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  loginButton: {
    width: 300,
    height: 45,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
  signUpLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;