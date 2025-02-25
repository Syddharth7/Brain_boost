import React from 'react';
import { View, Text, Button } from 'react-native';

const SubjectSelection = ({ route, navigation }) => {
  

  return (
    <View style={{ padding: 20, alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
      </Text>

      <Button
        title="📚 Go to Lessons"
        onPress={() => navigation.navigate('LessonScreen')}
      />

      <View style={{ marginVertical: 10 }} />

      <Button
        title="📝 Go to Quiz"
        onPress={() => navigation.navigate('ChooseTopicScreen')}
      />
    </View>
  );
};

export default SubjectSelection;
