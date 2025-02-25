import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts, HoltwoodOneSC_400Regular } from '@expo-google-fonts/holtwood-one-sc';
import AppLoading from 'expo-app-loading';
import logo from '../assets/logo.png';
import boy from '../assets/boy.png';

const SelecScreen = () => {
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    HoltwoodOneSC_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Image source={logo} style={styles.logo} />

      <Text style={styles.title}>LET'S START!</Text>

      <Image source={boy} style={styles.boyImage} />

      <TouchableOpacity onPress={() => navigation.navigate("LessonScreen")} style={styles.button}>
        <Text style={styles.buttonText}>LESSONS</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Subjects")} style={styles.button}>
        <Text style={styles.buttonText}>QUIZ</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Rank")} style={styles.button}>
        <Text style={styles.buttonText}>LEADERBOARD</Text>
      </TouchableOpacity>
    </View>
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
  },
  backText: {
    fontSize: 24,
    color: "#007AFF",
  },
  logo: {
    width: 200, // Increased size for better visibility
    height: 100, // Adjusted height proportionally
    
    
  },
  title: {
    fontSize: 28, // Slightly larger for emphasis
    fontFamily: "HoltwoodOneSC_400Regular",
    color: "#006BF8",
    marginBottom: 10, // Adjusted spacing
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  boyImage: {
    width: 350,
    height: 250,
    marginBottom:20,
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
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "HoltwoodOneSC_400Regular",
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },
});

export default SelecScreen;
