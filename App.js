import React, { useState, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PrevLog from "./screens/PrevLog";
import LogInScreen from "./screens/LogInScreen";
import TabNavigator from "./TabNavigator";
import MenuScreen from "./screens/MenuScreen";
import FavoritsScreen from "./screens/FavoritsScreen";
import ArmorScreen from "./screens/ArmorScreen"; // Adjust the path as necessary
import ContactScreen from "./screens/ContactScreen";
import { I18nManager } from "react-native"; // Import I18nManager

// Keep the splash screen visible while the app is loading
SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Check and set the RTL based on device language if necessary
        if (I18nManager.isRTL !== true) {
          I18nManager.forceRTL(false); // Change to true if you want to force RTL for testing
        }

        // Simulate loading tasks
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        // Hide the splash screen after loading
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PrevLog" component={PrevLog} />
        <Stack.Screen name="LogInScreen" component={LogInScreen} />
        <Stack.Screen name="App" component={TabNavigator} />
        <Stack.Screen name="FavoritsScreen" component={FavoritsScreen} />
        <Stack.Screen name="ArmorScreen" component={ArmorScreen} />
        <Stack.Screen name="ContactScreen" component={ContactScreen} />
        <Stack.Screen name="MenuScreen" component={MenuScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
