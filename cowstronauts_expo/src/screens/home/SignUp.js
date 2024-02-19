import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import SvgLogo from '../../../assets/img/svg/SvgLogo';
import React, { useState } from 'react';

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  // Function to handle the sign-up process
  const handleSignUp = async () => {
    try {
      if (!username || !password || !email || !repeatPassword) {
        // If any field is empty, show an alert and return
        Alert.alert(
          'SignUp Error',
          'Please fill in all the fields.',
        );
        return;
      }

      // Check if the passwords match
      if (password !== repeatPassword) {
        // If passwords do not match, show an alert and return
        Alert.alert(
          'SignUp Error',
          'Passwords do not match.',
        );
        return;
      }

      if (!email.includes('@')) {
        // If email doesn't contain '@', show an alert and return
        Alert.alert(
          'SignUp Error',
          'Email must contain @.',
        );
        return;
      }

      // Create a JSON body with user data
      const jsonBody = {
        name: username,
        password: password,
        email: email,
        dateCreated: new Date().toISOString().split("T")[0],
        lastSave: new Date().toISOString().split("T")[0],
        save: [],
      };

      // Send a POST request to the server to register the user
      const response = await fetch('http://18.213.13.32:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonBody),
      });

      // Parse the response as JSON
      const data = await response.json();

      // Check the status code of the response
      if (response.status === 200) {
        // If registration is successful, show an alert and navigate to the login screen
        Alert.alert(
          'SignUp Succes',
          'Succesful registration.\nCheck your E-mail to validate your account',
        ); navigation.navigate('Login');
      } else if (response.status === 400) {
        // If there's an error in the registration process, show an alert with the error message
        alert(`Error in registration: ${data.error}`);
      }
    } catch (error) {
      // Catch any errors that occur during the registration process and log them
      Alert.alert(
        'Connection Error',
        "Error connecting with the database",
      );
      console.log(`Error in request: ${error.message}`);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <SvgLogo />
      </View>

      <View style={styles.loginForm}>
        <TextInput
          style={styles.inputField}
          placeholder="Username"
          placeholderTextColor="#ccc"
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          placeholderTextColor="#ccc"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Repeat Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          onChangeText={(text) => setRepeatPassword(text)}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
            <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Image source={require('../../../assets/img/planets/planetSignUp.png')} style={styles.marteImage} />

      <View style={styles.footerTextContainer}>
        <Text style={styles.footerText} onPress={() => navigation.navigate('Login')}>Have an account?</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C1463F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 50,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  loginForm: {
    flex: 1,
    width: '65%',
    textAlign: 'center',
    marginBottom: 275,
  },
  inputField: {
    width: '100%',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  loginButton: {
    width: '50%',
    padding: 10,
    backgroundColor: '#FEAA16',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  marteImage: {
    position: 'absolute',
    top: 760,
    bottom: 0,
    right: -5,
    width: 150,
    height: 125,
    resizeMode: 'contain',
  },
  footerTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 25,
    margin: 5,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SignUp;
