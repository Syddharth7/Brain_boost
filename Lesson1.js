import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Lesson1 = ({ navigation }) => {
  useEffect(() => {
    markLessonComplete();
  }, []);

  const markLessonComplete = async () => {
    await AsyncStorage.setItem('lesson1Completed', 'true');
  };

  return (
    <View>
      <Text>Lesson 1: Introduction to ICT
      Lesson: Introduction to Computers
What is a Computer?
A computer is an electronic device that processes information and performs tasks based on instructions. It helps people with different activities such as writing documents, playing games, browsing the internet, and learning new things.

Basic Parts of a Computer
Monitor – Displays what you are doing on the computer.
Keyboard – Used for typing letters, numbers, and symbols.
Mouse – Helps move the pointer and click on items.
CPU (Central Processing Unit) – The "brain" of the computer that processes information.
Speakers – Play sound from the computer.
Printer – Prints documents and pictures on paper.
Types of Computers
Desktop Computer – A computer that stays in one place, used in schools, offices, and homes.
Laptop – A portable computer that can be carried anywhere.
Tablet – A small, touchscreen computer that is easy to use.
Smartphone – A phone that works like a computer and can browse the internet, play games, and send messages.
Importance of Computers
Computers help students learn by providing educational tools and resources.
They make work easier by allowing people to write documents, send emails, and research information.
They are used for entertainment, such as watching videos, listening to music, and playing games.
Computers help people connect with others through social media and communication apps.

      </Text>
      <Button title="Back to Topics" onPress={() => navigation.navigate('Lessons')} />
    </View>
  );
};

export default Lesson1;
