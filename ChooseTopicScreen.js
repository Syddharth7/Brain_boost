import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const topics = ["ICT", "Agriculture", "Industrial Arts", "Tourism"];

const ChooseTopicScreen = ({ navigation }) => {
  const [unlockedTopics, setUnlockedTopics] = useState(["ICT"]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const storedProgress = await AsyncStorage.getItem("topicProgress");
      if (storedProgress) {
        setUnlockedTopics(JSON.parse(storedProgress));
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const handleSelectTopic = (topic) => {
    if (unlockedTopics.includes(topic)) {
      navigation.navigate("QuizListScreen", { topic });
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        Choose Quiz Topic
      </Text>
      <FlatList
        data={topics}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectTopic(item)}
            disabled={!unlockedTopics.includes(item)}
            style={{
              padding: 15,
              backgroundColor: unlockedTopics.includes(item) ? "blue" : "gray",
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

export default ChooseTopicScreen;
