import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import SvgLogo from '../../../assets/img/svg/SvgLogo';
import ScreensContext from '../ScreenContext';

let soundObject;

const HomeScreen = ({ navigation }) => {
  const { isMuted, setIsMuted } = useContext(ScreensContext);

  // Function to play the sound
  const playSound = async (mute) => {
    console.log("mute: " + mute);

    if (!mute) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../../assets/sound/GameSong.mp3')
        );
        soundObject = sound;
        await soundObject.playAsync();
      } catch (error) {
        console.log('Error playing sound: ', error);
      }
    }
  };

  // Function to stop the sound
  const stopSound = async () => {
    try {
      if (soundObject) {
        await soundObject.stopAsync();
        await soundObject.unloadAsync();
      }
    } catch (error) {
      console.log('Error stopping sound: ', error);
    }
  };

  // Effect hook to handle sound playback based on mute state
  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      console.log("useEffect;" + isMuted)
      if (!isMuted)
        playSound(isMuted);

    }, [isMuted]);

    return focusListener;
  }, [isMuted]);

  return (
    <ImageBackground source={require('../../../assets/img/backgrounds/inicio.png')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.firstContainer}>
          {/* Button to navigate to Configuration screen */}
          <TouchableOpacity onPress={() => { stopSound(); navigation.navigate('Configuration') }}>
            <Image source={require('../../../assets/img/logos/screw.png')} style={{ width: 45, height: 50 }} />
          </TouchableOpacity>
        </View>
        <View style={styles.secondContainer}>
          {/* Logo */}
          <SvgLogo />
        </View>
        <View style={styles.thirdContainer}>
          {/* Text to prompt user to tap */}
          <TouchableOpacity onPress={() => {stopSound(); navigation.navigate('Account')}} style={styles.tapSection}>
            <Text style={styles.tapTxt}>Tap to continue...</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapSection: {
    flex: 1,
    flexDirection: "column-reverse"
  },
  firstContainer: {
    flexDirection: "row-reverse",
    flex: 0.75,
    width: '80%',
    marginTop: 50,
  },
  secondContainer: {
    flex: 1,
    width: '80%',
    alignItems: "center",
  },
  thirdContainer: {
    flex: 4,
    width: '80%',
    marginBottom: 20,
  },
  tapTxt: {
    color: "white",
    fontSize: 23,
    alignSelf: "center",
    fontWeight: 'bold',
    marginBottom: 70,
  }
});

export default HomeScreen;
