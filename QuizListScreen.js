import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const QuizListScreen = ({ route, navigation }) => {
  const { topic } = route.params;
  const [unlockedQuizzes, setUnlockedQuizzes] = useState(["Quiz 1"]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const storedProgress = await AsyncStorage.getItem(`${topic}_progress`);
      if (storedProgress) {
        setUnlockedQuizzes(JSON.parse(storedProgress));
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const handleStartQuiz = (quiz) => {
    if (unlockedQuizzes.includes(quiz)) {
      navigation.navigate("QuizScreen", { topic, quiz });
    }
  };

  const quizzes = ["Quiz 1", "Quiz 2", "Quiz 3", "Quiz 4", "Quiz 5"];

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        {topic} Quizzes
      </Text>
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleStartQuiz(item)}
            disabled={!unlockedQuizzes.includes(item)}
            style={{
              padding: 15,
              backgroundColor: unlockedQuizzes.includes(item) ? "green" : "gray",
              marginVertical: 5,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default QuizListScreen;
