import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { signUp } from '../services/authService';
import { useNavigation } from '@react-navigation/native';
import boy from '../assets/boy.png';
import logo from '../assets/logo.png';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigation = useNavigation();

  const handleSignup = async () => {
    const { data, error } = await signUp(email, password, name);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      navigation.replace('Subjects');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>{'←'}</Text>
      </TouchableOpacity>
      
      <Image source={logo} style={styles.logo} />
      <Image source={boy} style={styles.avatar} />

      <Text style={styles.title}>CREATE AN ACCOUNT</Text>

      <Text style={styles.label}>FULLNAME</Text>
      <TextInput style={styles.input} placeholder="Enter FullName" value={name} onChangeText={setName} />
      
      <Text style={styles.label}>CREATE USERNAME:</Text>
      <TextInput style={styles.input} placeholder="Enter Username" value={email} onChangeText={setEmail} keyboardType="email-address" />
      
      <Text style={styles.label}>CREATE PASSWORD:</Text>
      <TextInput style={styles.input} placeholder="Enter Password" value={password} onChangeText={setPassword} secureTextEntry />
      
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupText}>SIGN UP</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}> Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#E5F0FF',
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  backText: {
    fontSize: 24,
    color: 'blue',
  },
  logo: {
    width: 200,
    height: 100,
  },
  avatar: {
    width: 200,
    height: 150,
   
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 25,
    marginTop:20,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 40,
    marginBottom: 5,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  input: {
    width: '85%',
    height: 45,
    borderRadius: 20,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  signupButton: {
    width: '60%',
    height: 45,
    backgroundColor: '#007BFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  loginText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default SignupScreen;
