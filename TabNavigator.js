import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Dimensions, I18nManager } from "react-native";
import serchNav from "./serchNav";
import CartScreen from "./screens/CartScreen";
import TrackScreen from "./screens/TrackScreen";
import MenuScreen from "./screens/MenuScreen";
import SalesScreen from "./screens/SalesScreen";

import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");

const TabNavigator = ({ route }) => {
  const userData = route.params?.userData;

  // Define tabs in order and reverse if RTL
  const tabScreens = [
    { name: "Search", component: serchNav, label: "חיפוש", icon: "search1" },
    {
      name: "Cart",
      component: CartScreen,
      label: "עגלה",
      icon: "shoppingcart",
    },
    {
      name: "Sales",
      component: SalesScreen,
      label: "מבצעים",
      icon: "brightness-percent",
    },
    {
      name: "Track",
      component: TrackScreen,
      label: "מעקב הזמנות",
      icon: "profile",
    },
    { name: "Menu", component: MenuScreen, label: "תפריט", icon: "bars" },
  ];

  // Reverse order for RTL
  const orderedTabs = I18nManager.isRTL
    ? tabScreens
    : [...tabScreens].reverse();

  return (
    <Tab.Navigator
      initialRouteName="Search" // קביעת המסך הראשי
      screenOptions={({ route }) => ({
        headerShown: false,
        unmountOnBlur: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          height: height * 0.08,
          borderTopWidth: 1,
        },
        tabBarIcon: ({ focused }) => {
          const tab = tabScreens.find((tab) => tab.name === route.name);
          if (!tab) return null;

          let iconElement;
          if (tab.icon === "brightness-percent") {
            iconElement = (
              <Icon2
                name={tab.icon}
                size={22}
                color={focused ? "#ED2027" : "#959595"}
                style={styles.icon}
              />
            );
          } else {
            iconElement = (
              <Icon
                name={tab.icon}
                size={22}
                color={focused ? "#ED2027" : "#959595"}
                style={styles.icon}
              />
            );
          }

          return <View style={styles.iconContainer}>{iconElement}</View>;
        },
        tabBarActiveTintColor: "#ED2027",
        tabBarInactiveTintColor: "#959595",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "bold",
          bottom: 10,
        },
      })}
    >
      {orderedTabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ tabBarLabel: tab.label }}
          initialParams={{ userData: userData }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              if (tab.name === "Search") {
                e.preventDefault();
                navigation.navigate("Search");
              }
            },
          })}
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default TabNavigator;
