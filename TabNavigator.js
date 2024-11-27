import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View, StyleSheet, Dimensions } from "react-native";
import serchNav from "./serchNav"; // Adjust the path as necessary
import CartScreen from "./screens/CartScreen"; // Adjust the path as necessary
import ArmorScreen from "./screens/ArmorScreen"; // Adjust the path as necessary
import TrackScreen from "./screens/TrackScreen"; // Adjust the path as necessary
import MenuScreen from "./screens/MenuScreen"; // Adjust the path as necessary

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");

const TabNavigator = ({ route }) => {
  const { userName } = route.params;

  // Requiring icons once to avoid repeated imports inside the screenOptions function
  const icons = {
    search: {
      focused: require("./assets/icons/searchIcons/Search_focus.png"),
      default: require("./assets/icons/searchIcons/Search.png"),
    },
    cart: {
      focused: require("./assets/icons/cartIcons/Cart_focus.png"),
      default: require("./assets/icons/cartIcons/Cart.png"),
    },
    armor: {
      focused: require("./assets/icons/armorIcons/Armor_focus.png"),
      default: require("./assets/icons/armorIcons/Armor.png"),
    },
    track: {
      focused: require("./assets/icons/trackIcons/Track_focus.png"),
      default: require("./assets/icons/trackIcons/Track.png"),
    },
    menu: {
      focused: require("./assets/icons/menuIcons/Menu_focus.png"),
      default: require("./assets/icons/menuIcons/Menu.png"),
    },
  };

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
          let iconName;
          switch (route.name) {
            case "Search":
              iconName = focused ? icons.search.focused : icons.search.default;
              break;
            case "Cart":
              iconName = focused ? icons.cart.focused : icons.cart.default;
              break;
            case "Armor":
              iconName = focused ? icons.armor.focused : icons.armor.default;
              break;
            case "Track":
              iconName = focused ? icons.track.focused : icons.track.default;
              break;
            case "Menu":
              iconName = focused ? icons.menu.focused : icons.menu.default;
              break;
            default:
              break;
          }

          return (
            <View style={styles.iconContainer}>
              <Image source={iconName} style={styles.icon} />
            </View>
          );
        },
        tabBarActiveTintColor: "#ED2027", // Color for active tab
        tabBarInactiveTintColor: "#959595", // Color for inactive tab
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          bottom: 10, // Adjusts label positioning
        },
      })}
    >
      <Tab.Screen
        name="Search"
        component={serchNav}
        options={{ tabBarLabel: "חיפוש" }}
        initialParams={{ userName: userName }} // Pass userName as initial params
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
      />
      <Tab.Screen
        name="Armor"
        component={ArmorScreen}
        options={{ tabBarLabel: "שריונים" }}
      />
      <Tab.Screen
        name="Track"
        component={TrackScreen}
        options={{ tabBarLabel: "מעקב הזמנות" }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{ tabBarLabel: "תפריט" }}
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
    resizeMode: "contain",
  },
});

export default TabNavigator;
