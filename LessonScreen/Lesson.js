import React, { useEffect } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const lessonContent = {
  "Industrial Arts": {
    1: "Lesson 1: Introduction to Industrial Arts. Learn the basics of woodworking, metalworking, and other hands-on skills.",
    2: "Lesson 2: Woodworking Basics. Understand the different types of wood and essential woodworking tools.",
    3: "Lesson 3: Metalworking Techniques. Explore cutting, welding, and shaping metal.",
    4: "Lesson 4: Safety in Industrial Arts. Learn about safety procedures and protective gear.",
    5: "Lesson 5: Advanced Techniques. Discover modern industrial arts applications."
  },
  "ICT": {
    1: "Lesson 1: Introduction to Computers. Learn about hardware, software, and their roles.",
    2: "Lesson 2: Basic Programming. Understand programming concepts and how to write simple code.",
    3: "Lesson 3: Internet and Networking. Discover how networks and the internet function.",
    4: "Lesson 4: Cybersecurity. Learn how to stay safe online and protect data.",
    5: "Lesson 5: Software Development Basics. Explore software design, development, and deployment."
  },
  "Agriculture": {
    1: "Lesson 1: Basics of Farming. Understand traditional and modern farming methods.",
    2: "Lesson 2: Soil Preparation. Learn about soil types, nutrients, and fertilization.",
    3: "Lesson 3: Planting Techniques. Discover different methods for planting and irrigation.",
    4: "Lesson 4: Pest Control. Study organic and chemical pest control techniques.",
    5: "Lesson 5: Harvesting and Storage. Learn proper harvesting methods and storage techniques."
  },
  "Tourism": {
    1: "Lesson 1: Introduction to Tourism. Learn about the importance of tourism in the economy.",
    2: "Lesson 2: Customer Service. Understand how to provide quality service in the tourism industry.",
    3: "Lesson 3: Tour Guiding. Explore the role of a tour guide and guiding techniques.",
    4: "Lesson 4: Travel Management. Learn how to plan and manage travel arrangements.",
    5: "Lesson 5: Hospitality Industry. Discover the different sectors in hospitality, such as hotels and restaurants."
  }
};

const Lesson = ({ route, navigation }) => {
  const { subject, lesson } = route.params;

  useEffect(() => {
    markLessonComplete();
  }, []);
  

  const markLessonComplete = async () => {
    await AsyncStorage.setItem(`${subject}_Lesson${lesson}`, 'true');
  
    let completed = [];
    for (let i = 1; i <= 5; i++) {
      const status = await AsyncStorage.getItem(`${subject}_Lesson${i}`);
      if (status === 'true') completed.push(i);
    }
  
    if (completed.length === 5) {
      console.log(`✅ All ${subject} lessons completed! Marking ${subject}Completed as true.`);
      await AsyncStorage.setItem(`${subject}Completed`, 'true');
  
      // 🔍 Verify if it's saved properly
      const verify = await AsyncStorage.getItem(`${subject}Completed`);
      console.log(`🔍 VERIFY: ${subject}Completed =`, verify);
    }
  };
  
  

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
        {subject} - Lesson {lesson}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        {lessonContent[subject]?.[lesson] || "Lesson content not available."}
      </Text>
      <Button title="Back to Topics" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

export default Lesson;
