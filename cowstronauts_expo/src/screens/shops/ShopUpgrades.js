import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Easing, Text } from 'react-native';
import SvgJupiter from '../../../assets/img/svg/SvgJupiter';
import SvgPluto from '../../../assets/img/svg/SvgPluto';

const ShopUpgrades = ({ navigation }) => {
  // Animation references for Jupiter and Pluto rotation
  const rotateAnimJupiter = useRef(new Animated.Value(0)).current;
  const rotateAnimPluto = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start rotation animations when component mounts
    startRotation(rotateAnimJupiter);
    startRotation(rotateAnimPluto);
  }, []);

  // Function to start rotation animation
  const startRotation = (animatedValue) => {
    Animated.loop(
      Animated.timing(animatedValue, {
        useNativeDriver: false,
        toValue: 1,
        easing: Easing.linear,
        duration: 20000, // Rotation duration in milliseconds
      })
    ).start();
  };

  // Function to render a planet with rotation animation
  const renderPlanet = (rotateAnim, planetSvg, onPress) => {
    return (
      <TouchableOpacity activeOpacity={1} onPress={onPress}>
        <Animated.View style={{
          transform: [{
            rotate: rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'] 
            })
          }]
        }}>
          {planetSvg}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.firstContainer}></View> 
      {/* Second container with Jupiter */}
      <View style={styles.secondContainer}>
        <View style={styles.jupiterContainer}>
          {renderPlanet(rotateAnimJupiter, <SvgJupiter />, () => navigation.navigate('ShopClick'))}
        </View>
        {/* Button for adding click shop */}
        <View style={{ flex: 5, flexWrap: "wrap" }}>
          <TouchableOpacity
            style={[styles.button, { top: 110, left: 150 }]}
            onPress={() => navigation.navigate('ShopClick')}
          >
            <Text style={styles.buttonText}> + </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Third container with Pluto */}
      <View style={styles.secondContainer}>
        <View style={{ flex: 1, flexWrap: "wrap", flexDirection: "row-reverse", zIndex: 10 }}>
          {/* Button for adding CPS shop */}
          <TouchableOpacity
            style={[styles.button, { left: -100, marginTop: 100 }]}
            onPress={() => { navigation.navigate("ShopCPS") }}
          >
            <Text style={styles.buttonText}> + </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.plutoContainer}>
          {renderPlanet(rotateAnimPluto, <SvgPluto />, () => navigation.navigate("ShopCPS"))}
        </View>
      </View>
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#393939',
  },
  firstContainer: {
    flex: 1,
  },
  jupiterContainer: {
    flex: 1,
    flexDirection: "row",
    right: 150,
    bottom: 100,
  },
  plutoContainer: {
    flex: 1,
    flexDirection: "row",
    right: 100,
    bottom: 50,
  },
  secondContainer: {
    flex: 2,
    flexDirection: "row",
  },
  button: {
    backgroundColor: '#3D4039',
    borderRadius: 10,
    padding: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: "center",
    fontSize: 25,
  },
});

export default ShopUpgrades;
