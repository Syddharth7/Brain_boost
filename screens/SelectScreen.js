import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import logo from '../assets/logo.png'
import boy from '../assets/boy.png'

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#E8F0FE" }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: "absolute", top: 40, left: 20 }}>
        <Text style={{ fontSize: 24, color: "blue" }}>←
        </Text>
      </TouchableOpacity>

      <Image source={logo} style={{ width: 200, height: 60, resizeMode: "contain" }} />

      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1E5AFF", marginVertical: 20 }}>
        LET'S START!
      </Text>

      <Image source={boy} style={{ width: 200, height: 200, resizeMode: "contain" }} />

      <TouchableOpacity onPress={() => navigation.navigate("LessonScreen")} style={styles.button}>
        <Text style={styles.buttonText}>📚 LESSONS</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Subjects")} style={styles.button}>
        <Text style={styles.buttonText}>📘️ QUIZ</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Rank")} style={styles.button}>
        <Text style={styles.buttonText}>🏆 RANK</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  button: {
    backgroundColor: "#1E5AFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
};

export default HomeScreen;