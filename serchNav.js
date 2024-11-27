import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchScreen from "./screens/SearchScreen"; // Adjust the path as necessary
import ItemScreen from "./screens/ItemScreen"; // Adjust the path as necessary
import ItemCardScreen from "./screens/ItemCardScreen"; // Adjust the path as necessary
const Stack = createNativeStackNavigator();

export default function SearchNav({ route }) {
  const { userName } = route.params;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        initialParams={{ userName: userName }}
      />
      <Stack.Screen name="ItemScreen" component={ItemScreen} />
      <Stack.Screen name="ItemCardScreen" component={ItemCardScreen} />
    </Stack.Navigator>
  );
}
