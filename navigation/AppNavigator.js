import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// Import Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import SubjectsScreen from '../screens/SubjectsScreen';
import QuizzesScreen from '../screens/QuizzesScreen';
import QuizScreen from '../screens/QuizScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import LessonScreen from '../LessonScreen/LessonScreen';
import ICTTopics from '../LessonScreen/ICTTopics';
import AgricultureTopics from '../LessonScreen/TourismTopics';
import TourismTopics from '../LessonScreen/LessonScreen'
import IndustrialArtsTopics from '../LessonScreen/IndustrialArtsTopics'
import Lesson from '../LessonScreen/Lesson';
import GetStarted from '../screens/GetStarted'
import SelectScreen from '../screens/SelectScreen'

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Subjects" component={SubjectsScreen} options={{headerShown: false }} />
        <Stack.Screen name="Quizzes" component={QuizzesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ headerShown: false}} />
        <Stack.Screen name="LessonScreen" component={LessonScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ICTTopics" component={ICTTopics} options={{ headerShown: false }} />
        <Stack.Screen name="AgricultureTopics" component={AgricultureTopics} options={{ headerShown: false }} />
        <Stack.Screen name="TourismTopics" component={TourismTopics} options={{ headerShown: false }} />
        <Stack.Screen name="IndustrialArtsTopics" component={IndustrialArtsTopics} options={{ headerShown: false }} />
        <Stack.Screen name="Lesson" component={Lesson} options={{ headerShown: false }} />
        <Stack.Screen name="GetStarted" component={GetStarted} options={{ headerShown: false }} />
        <Stack.Screen name="SelectScreen" component={SelectScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
