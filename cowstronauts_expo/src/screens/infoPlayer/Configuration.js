import React, { useContext } from 'react';
import { View, ScrollView, Image, Text, StyleSheet, Alert } from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import ScreensContext from '../ScreenContext';
import { Audio } from 'expo-av';

const Configuration = ({ navigation }) => {

  // Context variables
  const { areConstellationsVisible, setAreConstellationsVisible } = useContext(ScreensContext);
  const { userInfo, setUserInfo } = useContext(ScreensContext);
  const { isMoonMoving, setIsMoonMoving } = useContext(ScreensContext);
  const { cantClicks, setCantClicks } = useContext(ScreensContext);
  const { coin, dispatch } = useContext(ScreensContext);
  const { pointsPerClick, setPointsPerClick } = useContext(ScreensContext);
  const { upgradesUnlocked, setUpgradesUnlocked } = useContext(ScreensContext);
  const { pointsPerSecond, setPointsPerSecond } = useContext(ScreensContext);
  const { isMuted, setIsMuted } = useContext(ScreensContext);
  const { isLoggedOut, setIsLoggedOut } = useContext(ScreensContext);

  const playSound = async (isChecked) => {
    try {
      let soundFile = '';

      // Determine the sound file based on the checkbox state
      if (isChecked) {
        soundFile = require('../../../assets/sound/checkTrue.mp3');
      } else {
        soundFile = require('../../../assets/sound/checkFalse.mp3');
      }

      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.setStatusAsync({ volume: 1.0 });
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };
  // Toggle functions
  const toggleMute = () => {
    setIsMuted(!isMuted);
    playSound(!isMuted);
  };

  const toggleConstellationsVisible = () => {
    setAreConstellationsVisible(!areConstellationsVisible);
    if (!isMuted) {
      setAreConstellationsVisible(!areConstellationsVisible);
      playSound(!areConstellationsVisible);
    }
  };

  const toggleMoonMoving = () => {
    setIsMoonMoving(!isMoonMoving);
    if (!isMuted) {
      setIsMoonMoving(!isMoonMoving);
      playSound(!isMoonMoving);
    }
  };

  // Function to save progress
  const saveProgress = () => {
    // Checking if user info is available
    if (userInfo === undefined) return;

    // Creating JSON object for save data
    const jsonSave = [
      {
        upgrades: upgradesUnlocked,
        cantClicks: cantClicks,
        cantPoints: coin,
        cps: pointsPerSecond,
        pointsPerClick: pointsPerClick
      }
    ];
    // Calling save API function
    saveApi(jsonSave);
  };

  // Function to call save API
  const saveApi = async (jsonSave) => {
    try {
      const response = await fetch('http://18.213.13.32:8080/load?id=' + userInfo.data.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonSave)
      });

      if (response.ok) console.log("Progress Saved!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    // Alert for logout confirmation
    Alert.alert(
      'Logout',
      'Are you sure? Your unsaved progress will be erased.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            setIsLoggedOut(true);
            navigation.navigate('Login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Configuration Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/img/logos/config.png')}
          style={styles.image}
        />
      </View>
      {/* Configuration Settings */}
      <ScrollView style={styles.settingsContainer}>
        {/* Title */}
        <Text style={styles.title}>COWFIGURATION</Text>
        {/* Mute Switch */}
        <View style={styles.volumeContainer}>
          <Text style={styles.volumeLabelText}>Moote:</Text>
          <CheckBox
            checked={isMuted}
            onPress={toggleMute}
            checkedIcon='check-circle'
            checkedColor='#8C81A7'
            uncheckedColor='#8C81A7'
            containerStyle={styles.checkBox}
          />
        </View>
        {/* Visible Constellations Switch */}
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Visible Cowstellations</Text>
          <CheckBox
            checked={areConstellationsVisible}
            onPress={toggleConstellationsVisible}
            checkedIcon='check-circle'
            checkedColor='#8C81A7'
            uncheckedColor='#8C81A7'
            containerStyle={styles.checkBox}
          />
        </View>
        {/* Moving Moon Switch */}
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Moving Moon</Text>
          <CheckBox
            checked={isMoonMoving}
            onPress={toggleMoonMoving}
            checkedIcon='check-circle'
            checkedColor='#8C81A7'
            uncheckedColor='#8C81A7'
            containerStyle={styles.checkBox}
          />
        </View>
        {/* Buttons Container */}
        <View style={styles.buttonContainer}>
          {/* Displaying account name if available */}
          <View style={{ marginBottom: 10 }}>
            <Text style={{ color: 'white' }}>
              Account{userInfo && userInfo.data ? <Text>: {userInfo.data.name}</Text> : ''}
            </Text>
          </View>
          {/* Save Progress Button */}
          <View style={styles.leftButtons}>
            <View style={{ marginBottom: 20 }}>
              <Button
                title="Save progress"
                onPress={() => saveProgress()}
                buttonStyle={styles.button}
                textStyle={styles.buttonText}
              />
            </View>
            {/* Logout Button */}
            <Button
              title="Logout"
              onPress={handleLogout}
              buttonStyle={styles.button}
              textStyle={styles.buttonText}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2B2930',
    paddingVertical: 20,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  settingsContainer: {
    backgroundColor: '#49464F',
    borderRadius: 20,
    padding: 20,
    width: '93%',
    marginBottom: 10,
  },
  checkBox: {
    marginTop: 5,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  settingText: {
    flex: 1,
    marginRight: 10,
    color: '#FFFF',
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  leftButtons: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 800,
    marginRight: 5,
  },
  button: {
    width: 250,
    maxWidth: 250,
    borderRadius: 20,
    backgroundColor: '#777777',
  },
  buttonText: {
    textAlign: 'center',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  volumeLabelText: {
    color: '#FFFF',
    marginRight: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#8C81A7',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default Configuration;
