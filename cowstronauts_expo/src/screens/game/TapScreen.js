import React, { useRef, useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity, Animated, Easing, Image } from 'react-native';
import { Audio } from 'expo-av';
import SvgMoon from '../../../assets/img/svg/SvgMoon';
import ScreensContext from '../ScreenContext';


const TapScreen = ({ navigation }) => {
  // Refs for animations and state variables
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [lastTapTime, setLastTapTime] = useState(null);
  const [isMoonClicked, setIsMoonClicked] = useState(false);
  const [isSecondComplete, setIsSecondComplete] = useState(false);
  const { cantClicks, setCantClicks } = useContext(ScreensContext);
  const { tapsPerSecond, setTapsPerSecond } = useContext(ScreensContext);
  const { pointsPerClick, setPointsPerClick } = useContext(ScreensContext);
  const { allUpgrades, setAllUpgrades } = useContext(ScreensContext);
  const { pointsPerSecond, setPointsPerSecond } = useContext(ScreensContext);
  const { isMoonMoving, setIsMoonMoving } = useContext(ScreensContext);
  const { coin, dispatch } = useContext(ScreensContext);
  const { isMuted, setIsMuted } = useContext(ScreensContext);

  // Array of sound paths
  const [path, setPath] = useState([
    require('../../../assets/sound/moonClick1.mp3'),
    require('../../../assets/sound/MoonClick2.mp3'),
    require('../../../assets/sound/MoonClick3.mp3'),
    require('../../../assets/sound/MoonClick4.mp3'),
    require('../../../assets/sound/MoonClick5.mp3'),
  ]);

  const { areConstellationsVisible, setAreConstellationsVisible } = useContext(ScreensContext);
  // State for sound object
  const [sound, setSound] = useState();

  // Ref for sound objects
  const soundObjects = useRef([]);

  // Background image URL
  let url = "../../../assets/img/backgrounds/TapBackground.png";

  // useEffect to start and stop the rotation animation of the moon image based on isMoonMoving state
  useEffect(() => {
    if (isMoonMoving) {
      Animated.loop(
        Animated.timing(rotateAnim, { useNativeDriver: true, toValue: 1, easing: Easing.linear, duration: 20000 })
      ).start();
    } else {
      Animated.loop(
        Animated.timing(rotateAnim, { useNativeDriver: true, toValue: 1, easing: Easing.linear, duration: 20000 })
      ).stop();
    }
  }, [isMoonMoving]);

  // Fetch all upgrades from the database on component mount
  useEffect(() => {
    getAllUpgrades();
  }, []);

  // Update points per second every second
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'cps' });
      setIsSecondComplete(!isSecondComplete);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSecondComplete, pointsPerSecond]);

  // Update points on moon click
  useEffect(() => {
    dispatch({ type: 'click' });
  }, [isMoonClicked]);

  // Unload sound when component unmounts
  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Handle moon click event
  const handlePress = async () => {
    setIsMoonClicked(!isMoonClicked);
    setCantClicks(cantClicks + 1);
    const now = Date.now();

    const randomIndex = Math.floor(Math.random() * path.length);

    if (!isMuted) {
      const { sound } = await Audio.Sound.createAsync(path[randomIndex]);
      setSound(sound);
      await sound.playAsync();
    }

    if (lastTapTime) {
      const timeDiff = now - lastTapTime;
      const tapsPerSecondValue = 1000 / timeDiff;
      setTapsPerSecond(tapsPerSecondValue.toFixed(2));
    }
    setLastTapTime(now);

    // Animation for scaling the moon image on click
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.04,
        duration: 75,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 75,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Fetch all upgrades from the database
  const getAllUpgrades = async () => {
    try {
      const response = await fetch("http://18.213.13.32:8080/upgrades");
      const jsonResponse = await response.json();
      if (response.ok) {
        setAllUpgrades(jsonResponse);
      }
    } catch (error) {
      // Handle error
    }
  }

  return (
    <ImageBackground source={(areConstellationsVisible) ? require("../../../assets/img/backgrounds/TapBackground.png") : require("../../../assets/img/backgrounds/TapBackground-NoConstellations.png")} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.firstContainer}>
          <Text style={styles.txtCoins}>{coin} <Image source={require("../../../assets/img/logos/zloty.png")} style={styles.coinImage} /></Text>
          <Text style={styles.txtCoins}>{pointsPerSecond}  <Image source={require("../../../assets/img/logos/zloty.png")} style={styles.coinImage} />/s</Text>
          <Text style={styles.txtCoins}>{pointsPerClick} <Image source={require("../../../assets/img/logos/zloty.png")} style={styles.coinImage} />/tap</Text>
         </View>
        <View style={styles.secondContainer}>
          <TouchableOpacity activeOpacity={1} onPress={handlePress} style={{ width: "100%", height: "100%", alignSelf: "center" }}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Animated.View style={{
                transform: [{
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })
                }]
              }}>
                <SvgMoon />
              </Animated.View>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: '#393939',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstContainer: {
    flex: 1.25,
    width: '100%',
  },
  secondContainer: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
  txtCoins: {
    color: "white",
    top: 70,
    fontSize: 30,
    textAlign: "center",
  },
  coinImage:{
    width:30,
    height:30,
  }
});

export default TapScreen;
