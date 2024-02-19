import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import SvgLogo from '../../../assets/img/svg/SvgLogo';

const Home = ({navigation}) => {

  return (
    <View style={styles.container}>
      {/* Logo Container */}
      <View style={styles.logoContainer}>
        <SvgLogo />
      </View>

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        {/* Log In Button */}
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2930',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 50, 
    marginBottom: 20, 
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    width: 150, 
    padding: 15,
    backgroundColor: '#FEAA16',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, 
  },
  signUpButton: {
    width: 150, 
    padding: 15,
    backgroundColor: '#FEAA16',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default Home;
