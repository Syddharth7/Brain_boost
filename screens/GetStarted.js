import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts, HoltwoodOneSC_400Regular } from "@expo-google-fonts/holtwood-one-sc";
import AppLoading from "expo-app-loading";
import girl from "../assets/girl.png";

const AdventureScreen = () => {
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    HoltwoodOneSC_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}></TouchableOpacity>
      <Image source={girl} style={styles.logo} />
      <Text style={styles.title}>GEAR UP FOR AN</Text>
      <Text style={styles.title}>EXCITING TLE</Text>
      <Text style={styles.title}>ADVENTURE!</Text>
      <TouchableOpacity onPress={() => navigation.navigate("SelectScreen")} style={styles.button}>
        <Text style={styles.buttonText}>GET STARTED</Text>
      </TouchableOpacity>
    </View>
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
    width: 400, // Increased size
    height: 400, // Increased size
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "HoltwoodOneSC_400Regular",
    color: "#006BF8",
    textAlign: "center",
    marginBottom: 5,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
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
