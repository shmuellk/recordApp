import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View, StyleSheet, Dimensions } from "react-native";
import serchNav from "./serchNav"; // Adjust the path as necessary
import CartScreen from "./screens/CartScreen"; // Adjust the path as necessary
import TrackScreen from "./screens/TrackScreen"; // Adjust the path as necessary
import MenuScreen from "./screens/MenuScreen"; // Adjust the path as necessary
import SalesScreen from "./screens/SalesScreen"; // Adjust the path as necessary

import Icon from "react-native-vector-icons/AntDesign"; // Using Ionicons for the left arrow
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons"; // Using Ionicons for the left arrow

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");

const TabNavigator = ({ route }) => {
  const userData = route.params.userData; // <-- Expecting the param here

  // Requiring icons once to avoid repeated imports inside the screenOptions function

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hides the header if you don't need it
        unmountOnBlur: false, // Prevent unmounting when switching tabs
        tabBarStyle: {
          backgroundColor: "#fff",
          height: height * 0.08,
          borderTopWidth: 1,
        },
        tabBarIcon: ({ focused }) => {
          let iconElement;
          switch (route.name) {
            case "Search":
              iconElement = (
                <Icon
                  name="search1"
                  size={22}
                  color={focused ? "#ED2027" : "#959595"}
                  style={styles.icon}
                />
              );
              break;
            case "Cart":
              iconElement = (
                <Icon
                  name="shoppingcart"
                  size={22}
                  color={focused ? "#ED2027" : "#959595"}
                  style={styles.icon}
                />
              );
              break;
            case "Sales":
              iconElement = (
                <Icon2
                  name="brightness-percent"
                  size={22}
                  color={focused ? "#ED2027" : "#959595"}
                  style={styles.icon}
                />
              );
              break;
            case "Track":
              iconElement = (
                <Icon
                  name="profile"
                  size={22}
                  color={focused ? "#ED2027" : "#959595"}
                  style={styles.icon}
                />
              );
              break;
            case "Menu":
              iconElement = (
                <Icon
                  name="bars"
                  size={22}
                  color={focused ? "#ED2027" : "#959595"}
                  style={styles.icon}
                />
              );
              break;
            default:
              iconElement = null;
              break;
          }

          return <View style={styles.iconContainer}>{iconElement}</View>;
        },
        tabBarActiveTintColor: "#ED2027", // Color for active tab
        tabBarInactiveTintColor: "#959595", // Color for inactive tab
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "bold",
          bottom: 10, // Adjusts label positioning
        },
      })}
    >
      <Tab.Screen
        name="Search"
        component={serchNav}
        options={{ tabBarLabel: "חיפוש" }}
        initialParams={{ userData: userData }} // Pass userData as initial params
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // Prevent the default action of resetting the stack
            navigation.navigate("Search"); // Ensures staying on the current stack without resetting
          },
        })}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ tabBarLabel: "עגלה" }}
        initialParams={{ userData: userData }}
      />
      <Tab.Screen
        name="Sales"
        component={SalesScreen}
        options={{ tabBarLabel: "מבצעים" }}
        initialParams={{ userData: userData }}
      />
      <Tab.Screen
        name="Track"
        component={TrackScreen}
        options={{ tabBarLabel: "מעקב הזמנות" }}
        initialParams={{ userData: userData }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{ tabBarLabel: "תפריט" }}
        initialParams={{ userData: userData }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 24, // You can adjust size based on your icon size
    height: 24,
  },
});

export default TabNavigator;
