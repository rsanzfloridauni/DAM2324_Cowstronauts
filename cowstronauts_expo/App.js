import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { ScreensProvider } from './src/screens/ScreenContext';
import 'react-native-gesture-handler';
import { LogBox } from 'react-native';

import Account from './src/screens/infoPlayer/Account';
import Login from './src/screens/home/Login';
import SignUp from './src/screens/home/SignUp';
import Home from './src/screens/home/HomeScreen';
import TabsGame from './src/screens/game/TabsGame';
import Configuration from './src/screens/infoPlayer/Configuration';
import ShopCPS from './src/screens/shops/ShopCPS';
import ShopClick from './src/screens/shops/ShopClick';
import Introduction from './src/screens/game/Introduction';

const Stack = createStackNavigator();

export default function App() {
  LogBox.ignoreLogs(["Require cycle:"])
  LogBox.ignoreAllLogs();
  console.disableYellowBox = true;

  return (
    <ScreensProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Account" component={Account} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="TabsGame" component={TabsGame} />
          <Stack.Screen name="Configuration" component={Configuration} />
          <Stack.Screen name="ShopCPS" component={ShopCPS} />
          <Stack.Screen name="ShopClick" component={ShopClick} />
          <Stack.Screen name="Introduction" component={Introduction} />
        </Stack.Navigator>
      </NavigationContainer>
    </ScreensProvider>
  );
}
