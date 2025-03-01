import React, { useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts, HoltwoodOneSC_400Regular } from "@expo-google-fonts/holtwood-one-sc";
import AppLoading from "expo-app-loading";
import { Audio } from "expo-av";
import girl from "../assets/girl.png";

const AdventureScreen = () => {
  const navigation = useNavigation();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current; // Added fade animation
  const scaleAnim = useRef(new Animated.Value(1)).current; // Added scale animation
  const backgroundSound = useRef(new Audio.Sound());

  let [fontsLoaded] = useFonts({
    HoltwoodOneSC_400Regular,
  });

  useEffect(() => {
    // Start background music
    const playBackgroundMusic = async () => {
      try {
        await backgroundSound.current.loadAsync(require("../assets/sounds/bgSoundd.mp3"), {
          shouldPlay: true,
          isLooping: true,
          volume: 0.5,
        });
        await backgroundSound.current.playAsync();
      } catch (error) {
        console.error("Error playing background music:", error);
      }
    };

    playBackgroundMusic();

    // Cleanup function to stop music when leaving screen
    return () => {
      backgroundSound.current.stopAsync();
      backgroundSound.current.unloadAsync();
    };
  }, []);

  useEffect(() => {
    // Floating animation for the girl
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wave animation for the text
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const playButtonSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sounds/ClickSound.mp3")
    );
    await sound.playAsync();
  };

  const handleGetStarted = async () => {
    await playButtonSound();

    // Start the fade-out and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate("SelectScreen");
    });
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}></TouchableOpacity>

      {/* Floating animation applied */}
      <Animated.Image source={girl} style={[styles.logo, { transform: [{ translateY: floatAnim }] }]} />

      {/* Wave animation applied to each letter of the text */}
      <View style={styles.textContainer}>
        {["G", "E", "A", "R", " ", "U", "P", " ", "F", "O", "R", " ", "A", "N"].map((letter, index) => {
          const animatedStyle = {
            transform: [
              {
                translateY: waveAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, -10 * Math.sin(index), 0],
                }),
              },
            ],
          };
          return (
            <Animated.Text key={index} style={[styles.title, animatedStyle]}>
              {letter}
            </Animated.Text>
          );
        })}
      </View>
      <View style={styles.textContainer}>
        {["E", "X", "C", "I", "T", "I", "N", "G", " ", "T", "L", "E"].map((letter, index) => {
          const animatedStyle = {
            transform: [
              {
                translateY: waveAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, -10 * Math.sin(index), 0],
                }),
              },
            ],
          };
          return (
            <Animated.Text key={index} style={[styles.title, animatedStyle]}>
              {letter}
            </Animated.Text>
          );
        })}
      </View>
      <View style={styles.textContainer}>
        {["A", "D", "V", "E", "N", "T", "U", "R", "E", "!"].map((letter, index) => {
          const animatedStyle = {
            transform: [
              {
                translateY: waveAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, -10 * Math.sin(index), 0],
                }),
              },
            ],
          };
          return (
            <Animated.Text key={index} style={[styles.title, animatedStyle]}>
              {letter}
            </Animated.Text>
          );
        })}
      </View>

      {/* Button with sound effect */}
      <TouchableOpacity onPress={handleGetStarted} style={styles.button}>
        <Text style={styles.buttonText}>GET STARTED</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6F0FF",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  logo: {
    width: 400,
    height: 400,
    resizeMode: "contain",
    marginBottom: 20,
  },
  textContainer: {
    flexDirection: "row",
  },
  title: {
    fontSize: 24,
    fontFamily: "HoltwoodOneSC_400Regular",
    color: "#006BF8",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
    marginHorizontal: 2,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default AdventureScreen;
