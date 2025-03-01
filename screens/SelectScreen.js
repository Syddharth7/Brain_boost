import React, { useRef, useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Easing,
  Dimensions,
  Platform
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useFonts, HoltwoodOneSC_400Regular } from '@expo-google-fonts/holtwood-one-sc';
import AppLoading from 'expo-app-loading';
import { Audio } from 'expo-av';
import logo from '../assets/logo.png';
import boy from '../assets/boy.png';

const SelectScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { width } = Dimensions.get('window');
  
  // Sound references for button sounds only
  const [buttonSound, setButtonSound] = useState();
  const [backSound, setBackSound] = useState();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  
  // Updated: Changed boyAnim from translating X to a Y position for floating
  const boyAnim = useRef(new Animated.Value(0)).current;
  const boyOpacity = useRef(new Animated.Value(0)).current;
  
  const buttonsAnim = useRef([
    new Animated.Value(-300),
    new Animated.Value(-300),
    new Animated.Value(-300)
  ]).current;
  const buttonScale = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1)
  ]).current;
  
  // Button hover state
  const [hoveredButton, setHoveredButton] = useState(null);
  
  // Pulsating animation for title
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  let [fontsLoaded] = useFonts({
    HoltwoodOneSC_400Regular,
  });

  // Configure audio mode first in a separate useEffect
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error("Failed to configure audio mode", error);
      }
    };
    
    setupAudio();
  }, []);

  // Load sound effects only
  useEffect(() => {
    async function loadSounds() {
      try {
        // Pre-load button sound asset
        await Asset.loadAsync([
          require('../assets/sounds/ClickSound.mp3')
        ]);
        
        // Load with a small delay to avoid thread issues
        setTimeout(async () => {
          try {
            // Create and load button sound
            const { sound: buttonSfx } = await Audio.Sound.createAsync(
              require('../assets/sounds/ClickSound.mp3'),
              { shouldPlay: false }
            );
            setButtonSound(buttonSfx);
            
            // Create and load back button sound
            const { sound: backSfx } = await Audio.Sound.createAsync(
              require('../assets/sounds/ClickSound.mp3'),
              { shouldPlay: false }
            );
            setBackSound(backSfx);
          } catch (error) {
            console.error("Error loading sounds within timeout:", error);
          }
        }, 300);
      } catch (error) {
        console.error("Failed to load sounds:", error);
        // Try fallback loading method if the first method fails
        fallbackLoadSounds();
      }
    }
    
    // Fallback method using different approach
    async function fallbackLoadSounds() {
      try {
        // Load button sound with different method
        const buttonSfx = new Audio.Sound();
        await buttonSfx.loadAsync(require('../assets/sounds/ClickSound.mp3'));
        setButtonSound(buttonSfx);
        
        // Load back button sound with different method
        const backSfx = new Audio.Sound();
        await backSfx.loadAsync(require('../assets/sounds/ClickSound.mp3'));
        setBackSound(backSfx);
      } catch (error) {
        console.error("Failed to load sounds with fallback:", error);
      }
    }
    
    // Import Asset from expo-asset
    const Asset = require('expo-asset').Asset;
    loadSounds();
    
    // Cleanup sounds on unmount
    return () => {
      if (buttonSound) {
        buttonSound.unloadAsync().catch(error => 
          console.error("Failed to unload button sound", error)
        );
      }
      if (backSound) {
        backSound.unloadAsync().catch(error => 
          console.error("Failed to unload back sound", error)
        );
      }
    };
  }, []);

  useEffect(() => {
    // Initial animations sequence
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Fade in boy avatar
      Animated.timing(boyOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.stagger(150, [
        Animated.spring(buttonsAnim[0], {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(buttonsAnim[1], {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(buttonsAnim[2], {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        })
      ])
    ]).start();
    
    // Continuous title pulsating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();
    
    // Create continuous floating animation for boy
    Animated.loop(
      Animated.sequence([
        Animated.timing(boyAnim, {
          toValue: -15,  // Float up 15 pixels
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(boyAnim, {
          toValue: 0,    // Return to original position
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);
  
  // Play button sound with error handling
  const playButtonSound = async () => {
    try {
      if (buttonSound) {
        const status = await buttonSound.getStatusAsync();
        await buttonSound.setPositionAsync(0); // Rewind to start
        await buttonSound.playAsync();
      }
    } catch (error) {
      console.error("Failed to play button sound", error);
    }
  };
  
  // Play back button sound with error handling
  const playBackSound = async () => {
    try {
      if (backSound) {
        const status = await backSound.getStatusAsync();
        await backSound.setPositionAsync(0);
        await backSound.playAsync();
      }
    } catch (error) {
      console.error("Failed to play back sound", error);
    }
  };
  
  const handlePressIn = (index) => {
    setHoveredButton(index);
    Animated.spring(buttonScale[index], {
      toValue: 0.95,
      friction: 3,
      useNativeDriver: true,
    }).start();
    
    // Play sound on press
    playButtonSound();
  };
  
  const handlePressOut = (index) => {
    setHoveredButton(null);
    Animated.spring(buttonScale[index], {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };
  
  const handleNavigation = (screen) => {
    // Short delay to let the sound play before navigation
    setTimeout(() => {
      navigation.navigate(screen);
    }, 100);
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TouchableOpacity 
        onPress={() => {
          playBackSound();
          setTimeout(() => navigation.goBack(), 100);
        }} 
        style={styles.backButton}
      >
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Animated.Image 
        source={logo} 
        style={[
          styles.logo, 
          { 
            opacity: logoAnim,
            transform: [
              { scale: logoAnim },
              { translateY: logoAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0]
              })}
            ]
          }
        ]} 
      />

      <Animated.Text 
        style={[
          styles.title, 
          { 
            opacity: titleAnim,
            transform: [
              { scale: pulseAnim }
            ]
          }
        ]}
      >
        LET'S START!
      </Animated.Text>

      <Animated.Image 
        source={boy} 
        style={[
          styles.boyImage, 
          { 
            opacity: boyOpacity,
            transform: [
              { translateY: boyAnim },  // Changed from translateX to translateY for floating effect
              { scale: Animated.add(1, Animated.multiply(boyAnim, -0.002)) } // Subtle scale change during floating
            ]
          }
        ]} 
      />

      {['LESSONS', 'QUIZ', 'LEADERBOARD'].map((text, index) => (
        <Animated.View 
          key={index}
          style={{ 
            transform: [
              { translateX: buttonsAnim[index] },
              { scale: buttonScale[index] }
            ] 
          }}
        >
          <TouchableOpacity 
            onPress={() => {
              const screens = ["LessonScreen", "Subjects", "Rank"];
              handleNavigation(screens[index]);
            }}
            onPressIn={() => handlePressIn(index)}
            onPressOut={() => handlePressOut(index)}
            style={[
              styles.button, 
              hoveredButton === index && styles.buttonHovered
            ]}
          >
            <Text style={styles.buttonText}>{text}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DCEAFF",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backText: {
    fontSize: 24,
    color: "#007AFF",
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontFamily: "HoltwoodOneSC_400Regular",
    color: "#006BF8",
    marginBottom: 10,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  boyImage: {
    width: 350,
    height: 250,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    width: 250,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonHovered: {
    backgroundColor: "#0068E1",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "HoltwoodOneSC_400Regular",
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },
});

export default SelectScreen;