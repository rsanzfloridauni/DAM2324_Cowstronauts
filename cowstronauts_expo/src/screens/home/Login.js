import React, { useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import SvgLogo from '../../../assets/img/svg/SvgLogo';
import { useContext } from 'react';
import ScreensContext from '../ScreenContext';

const Login = ({ navigation }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { userInfo, setUserInfo } = useContext(ScreensContext);
  const { cantClicks, setCantClicks } = useContext(ScreensContext);
  const { upgradesUnlocked, setUpgradesUnlocked } = useContext(ScreensContext);
  const { poinstPerSecond, setPointsPerSecond } = useContext(ScreensContext);
  const { pointsPerClick, setPointsPerClick } = useContext(ScreensContext);
  const { coin, dispatch } = useContext(ScreensContext);
  const {isLoggedOut,setIsLoggedOut} = useContext(ScreensContext);

  // Reset user info and game state on component mount
  useEffect(() => {
    console.log(isLoggedOut);
    if(isLoggedOut){
      setUserInfo(null);
      setCantClicks(0);
      dispatch({ type: 'InitialValue', value: 0 });
      setPointsPerSecond(0);
      setUpgradesUnlocked([]);
      setPointsPerClick(1);
    }
  }, [isLoggedOut]);

  // Function to fetch user data from server
  const getData = async (url) => {
    try {
      const response = await fetch(url);
      const jsonResponse = await response.json();
      if (response.status === 200) {
        if (jsonResponse.data.validated) {
          setUserInfo(jsonResponse);
          console.log(jsonResponse.data.save[0]);
          (jsonResponse.data.save[0] !== undefined) ? setCantClicks(jsonResponse.data.save[0].cantClicks) : setCantClicks(0);
          (jsonResponse.data.save[0] !== undefined) && dispatch({ type: 'InitialValue', value: jsonResponse.data.save[0].cantPoints });
          (jsonResponse.data.save[0] !== undefined) ? setPointsPerSecond(jsonResponse.data.save[0].cps) : setPointsPerSecond(0);
          (jsonResponse.data.save[0] !== undefined) ? setUpgradesUnlocked(jsonResponse.data.save[0].upgrades) : setUpgradesUnlocked([]);
          (jsonResponse.data.save[0] !== undefined) ? setPointsPerClick(jsonResponse.data.save[0].pointsPerClick) : setPointsPerClick(1);
          (jsonResponse.data.save[0] !== undefined) && console.log(jsonResponse.data.save[0].upgrades);
          (jsonResponse.data.save[0] !== undefined) ? navigation.navigate("TabsGame") : navigation.navigate("Introduction");
          setIsLoggedOut(false);
        } else {
          setUserInfo(null);
          alert("Correct Credentials\nUser is NOT validated, check your e-mail");
        }
      } else if (response.status === 401) {
        setUserInfo(null);
        alert("Login not correct. Please try again");
      }
    } catch (error) {
      Alert.alert(
        'Connection Error',
        "Error connecting with the database",
      );
      console.error(`Error in request: ${error.message}`);
    }
  };

  // Function to handle login button press
  function onPressLogIn(name, pass) {
    getData(`http://18.213.13.32:8080/login?user=${name}&pass=${pass}`);
  }

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
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={() => onPressLogIn(username, password)}>
            <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop: 40}} onPress={() => navigation.navigate('Introduction')}>
            <Text style={{color: '#FFFFFF'}}>Continue without account</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Image source={require('../../../assets/img/planets/planetLogin.png')} style={styles.marteImage} />

      <View style={styles.footerTextContainer}>
        <Text style={styles.footerText} onPress={()=>navigation.navigate('SignUp')}>Don't have an account?</Text>
      </View>
    </View>
  );
}

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
  loginForm: {
    flex: 1,
    width: '65%',
    textAlign: 'center',
    marginBottom: 200,
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
    bottom: 2,
    left: -18,
    width: 150,
    height: 125,
    resizeMode: 'contain',
  },
  footerTextContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 5,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Login;
