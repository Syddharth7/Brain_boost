import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const questionData = {
  ICT: [
    { question: "What is HTML?", answer: "A" },
    { question: "What does CSS stand for?", answer: "B" },
  ],
  Agriculture: [
    { question: "What is the process of planting crops?", answer: "A" },
    { question: "Which tool is used for plowing?", answer: "B" },
  ],
  // Add more topics & questions
};

const QuizScreen = ({ route, navigation }) => {
  const { topic, quiz } = route.params;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const questions = questionData[topic] || [];

  const handleNextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      handleCompleteQuiz();
    }
  };

  const handleCompleteQuiz = async () => {
    try {
      let quizNumber = parseInt(quiz.split(" ")[1]);
      let nextQuiz = `Quiz ${quizNumber + 1}`;

      const storedQuizzes = await AsyncStorage.getItem(`${topic}_progress`);
      let updatedQuizzes = storedQuizzes ? JSON.parse(storedQuizzes) : [];
      if (!updatedQuizzes.includes(nextQuiz) && quizNumber < 5) {
        updatedQuizzes.push(nextQuiz);
      }
      await AsyncStorage.setItem(`${topic}_progress`, JSON.stringify(updatedQuizzes));

      // Unlock next topic
      if (quizNumber === 5) {
        let topics = ["ICT", "Agriculture", "Industrial Arts", "Tourism"];
        let currentIndex = topics.indexOf(topic);
        let nextTopic = topics[currentIndex + 1];

        if (nextTopic) {
          const storedTopics = await AsyncStorage.getItem("topicProgress");
          let updatedTopics = storedTopics ? JSON.parse(storedTopics) : [];
          if (!updatedTopics.includes(nextTopic)) {
            updatedTopics.push(nextTopic);
            await AsyncStorage.setItem("topicProgress", JSON.stringify(updatedTopics));
          }
        }
      }

      setCompleted(true);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {!completed ? (
        <>
          <Text style={{ fontSize: 22, marginBottom: 20 }}>
            {questions[questionIndex]?.question || "No questions available"}
          </Text>
          <TouchableOpacity
            onPress={handleNextQuestion}
            style={{
              backgroundColor: "blue",
              padding: 10,
              borderRadius: 5,
              marginTop: 20,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Next</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={{ fontSize: 22, marginBottom: 20 }}>Quiz Completed!</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: "green", padding: 10, borderRadius: 5 }}>
            <Text style={{ color: "white", textAlign: "center" }}>Back</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default QuizScreen;
