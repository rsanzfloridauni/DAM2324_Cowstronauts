import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useContext } from 'react';
import ScreensContext from '../ScreenContext';

const Shop2 = () => {
  const [selectedUpgrades, setSelectedUpgrades] = useState([]);
  const [purchasedUpgrades, setPurchasedUpgrades] = useState([]);
  const { allUpgrades, setAllUpgrades } = useContext(ScreensContext);
  const { upgradesUnlocked, setUpgradesUnlocked } = useContext(ScreensContext);
  const { coin, dispatch } = useContext(ScreensContext);
  const { pointsPerSecond, setPointsPerSecond } = useContext(ScreensContext);
  const { isMuted, setIsMuted } = useContext(ScreensContext);
  const totalEndUpgrades = 5;
  
  const buyUpgrade = (data) => {
    const id = data.id;
    const lvlMax = data.lvlMax;
    let upgradeLevel = 0;
    let isupgradeSaved = false;
    upgradesUnlocked.forEach(element => {
      if (element.idUpgrade === id) {
        upgradeLevel = element.cantUpgrade;
        isupgradeSaved = true;
      }
    });
    if (upgradeLevel < lvlMax) {
      buyOne(data, isupgradeSaved);
    }
  };

  const buyOne = (data, isUpgradeSaved) => {
    console.log(data.id);
    if (data.cost <= coin) {
      dispatch({ type: 'reduceByPurchase', value: data.cost });
      if (!isMuted) {
        play();
      }
      if (isUpgradeSaved) {
        let upgradesSave = [...upgradesUnlocked];
        upgradesSave.forEach(element => (element.idUpgrade === data.id) && element.cantUpgrade++);
        console.log(upgradesSave);
        setUpgradesUnlocked(upgradesSave);
      } else {
        let newUpgrade = {
          idUpgrade: data.id,
          cantUpgrade: 1
        };
        setUpgradesUnlocked([...upgradesUnlocked, newUpgrade]);
      }

      setPointsPerSecond(pointsPerSecond + data.effect[0].quantity);
      setPurchasedUpgrades([...purchasedUpgrades, data.id]); // Mark the upgrade as purchased
    } else {
      alert("Not enough Zlotys to buy this upgrade.");
    }
  };

  const toggleSelection = (id) => {
    if (selectedUpgrades.includes(id)) {
      setSelectedUpgrades(selectedUpgrades.filter(item => item !== id));
    } else {
      setSelectedUpgrades([...selectedUpgrades, id]);
    }
  };

  const play = async () => {
    const { sound } = await Audio.Sound.createAsync(require('../../../assets/sound/ClickOvni.mp3'));
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleShip}>SHIP</Text>
        <Text style={styles.titleUp}>UPGRADES</Text>
        <Text style={styles.sectionTitle}>{coin} <Image source={require("../../../assets/img/logos/zloty.png")} style={styles.coinImage} /></Text>
      </View>

      <ImageBackground
        source={require('../../../assets/img/planets/earth.png')}
        resizeMode="cover"
        style={styles.backgroundImage}>
        <View style={styles.scrollViewContent}>
          <ScrollView style={{ height: windowHeight - 200, width: '80%' }}>
            {allUpgrades && allUpgrades.upgrade && Array.isArray(allUpgrades.upgrade) && allUpgrades.upgrade.map((element, i) => {
              if (element.effect[0].type === "end") {
                let cantUpgrade = 0;
                (upgradesUnlocked !== undefined) && upgradesUnlocked.map(e => (e.idUpgrade === element.id) && (cantUpgrade = e.cantUpgrade));
                return (
                  !purchasedUpgrades.includes(element.id) && (
                    <TouchableOpacity
                      onPress={() => { buyUpgrade(element); toggleSelection(element.id); }}
                      key={i.toString()}
                      style={styles.product}>
                      <View style={styles.productImageContainer}>
                        <Image
                          source={{ uri: 'data:image/gif;base64,' + element.img }}
                          style={styles.productImage}
                        />
                      </View>
                      <View style={styles.productInfo}>
                        <Text style={styles.productTitle}>{element.name.toUpperCase()}</Text>
                        <Text style={styles.productDescription}>
                          {element.description}
                        </Text>
                        <View style={styles.coinsUpgrade}>
                          {purchasedUpgrades.includes(element.id) ? (
                            <Icon name="check" size={20} color="green" />
                          ) : (
                            <>
                              <Text style={styles.coinsUpgrade}>
                                {element.cost}&nbsp;
                                <Image
                                  source={require('../../../assets/img/logos/zloty.png')}
                                  style={styles.coinImage}
                                />
                              </Text>
                            </>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                );
              }
            })}
            {purchasedUpgrades.length === totalEndUpgrades && (
              <View style={styles.completedMessageContainer}>
                <Text style={styles.completedMessage}>YOU'VE COMPLETED THE MISSION</Text>
                <Image source={require("../../../assets/img/backgrounds/EndGame.png")} style={styles.endImage} />
              </View>
            )}
          </ScrollView>
        </View>
      </ImageBackground>
      <View style={styles.navigation} />
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2930',
  },
  header: {
    height: 115,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
  },
  titleShip: {
    color: '#8C81A7',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 65,
  },
  titleUp: {
    color: '#8C81A7',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backgroundImage: {
    width: windowWidth,
    height: windowHeight * 0.85,
    justifyContent: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 5,
    maxHeight: 400,
    width: '100%',
  },
  product: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#2B2930',
    borderRadius: 10,
    flexDirection: 'row',
    elevation: 4,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  productImageContainer: {
    width: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  productTitle: {
    fontWeight: 'bold',
    color: '#8C81A7',
  },
  productDescription: {
    flexWrap: 'wrap',
    flexShrink: 1,
    width: '100%',
    color: '#FFFF',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  coinImage: {
    width: 15,
    height: 15,
  },
  coinsUpgrade: {
    color: 'white',
    position: 'absolute',
    bottom: -5,
    right: 0,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  completedMessageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  completedMessage: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  endImage: {
    marginTop: 10,
    width: 200,
    height: 200,
    borderRadius: 50
  },
});

export default Shop2;
