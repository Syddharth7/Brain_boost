import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LessonScreen = ({ navigation }) => {
  const [unlocked, setUnlocked] = useState({
    agriculture: false,
    industrialArts: false,
    tourism: false,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkProgress();  // Refresh the unlock status
    });
  
    return unsubscribe;
  }, [navigation]);
  const debugStorage = async () => {
    console.log("📌 Checking AsyncStorage Keys...");
    const keys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(keys);
    console.log("📌 All AsyncStorage Data:", values);
  };

  useEffect(() => {
    checkProgress();
    debugStorage();
  }, []);
  
  const checkProgress = async () => {
    const ictDone = await AsyncStorage.getItem('ICTCompleted');
    const agricultureDone = await AsyncStorage.getItem('AgricultureCompleted');
    const industrialArtsDone = await AsyncStorage.getItem('Industrial ArtsCompleted'); // ✅ Correct key
  
    console.log("📌 DEBUG: Retrieving completion status:", {
      ictDone,
      agricultureDone,
      industrialArtsDone
    });
  
    setUnlocked({
      agriculture: ictDone === 'true',
      industrialArts: agricultureDone === 'true',
      tourism: industrialArtsDone === 'true', // ✅ Now correctly unlocking Tourism
    });
  };
  

  return (
    <View>
      <Text>Choose a Subject:</Text>
      <Button title="ICT" onPress={() => navigation.navigate('ICTTopics')} />
      <Button 
        title="Agriculture" 
        onPress={() => unlocked.agriculture ? navigation.navigate('AgricultureTopics') : Alert.alert("Locked", "Complete ICT first!")}
        disabled={!unlocked.agriculture}
      />
      <Button 
        title="Industrial Arts" 
        onPress={() => unlocked.industrialArts ? navigation.navigate('IndustrialArtsTopics') : Alert.alert("Locked", "Complete Agriculture first!")}
        disabled={!unlocked.industrialArts}
      />
      <Button 
        title="Tourism" 
        onPress={() => unlocked.tourism ? navigation.navigate('TourismTopics') : Alert.alert("Locked", "Complete Industrial Arts first!")}
        disabled={!unlocked.tourism}
      />

<Button
  title="Reset Progress"
  onPress={async () => {
    await AsyncStorage.clear();
    console.log("AsyncStorage cleared!");
    alert("Progress reset! Restart the app.");
  }}
  color="red"
/>

    </View>
  );
};

export default LessonScreen;
