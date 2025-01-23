import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchScreen from "./screens/SearchScreen"; // Adjust the path as necessary
import ItemScreen from "./screens/ItemScreen"; // Adjust the path as necessary
import ItemCardScreen from "./screens/ItemCardScreen"; // Adjust the path as necessary
import SkuScreen from "./screens/SkuScreen"; // Adjust the path as necessary
const Stack = createNativeStackNavigator();

export default function SearchNav({ route }) {
  const { userData } = route.params;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        initialParams={{ userData: userData }}
      />
      <Stack.Screen
        name="ItemScreen"
        component={ItemScreen}
        initialParams={{ userData: userData }}
      />
      <Stack.Screen
        name="SkuScreen"
        component={SkuScreen}
        initialParams={{ userData: userData }}
      />
      <Stack.Screen
        name="ItemCardScreen"
        component={ItemCardScreen}
        initialParams={{ userData: userData }}
      />
    </Stack.Navigator>
  );
}
