import React from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  I18nManager, // Import I18nManager to handle RTL/LTR
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

const PrevLog = ({ navigation }) => {
  const handelOnPress = () => {
    navigation.navigate("LogInScreen");
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/PrevLog/background.jpg")}
        style={styles.image}
        imageStyle={{ resizeMode: "stretch" }}
      >
        <View style={styles.bottom}>
          <View style={styles.textContainer}>
            <Text style={styles.hader}>חלקי חילוף לרכב שלך!</Text>
            <Text style={styles.subText}>חיפוש יעיל ונוח לרכב שלך</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.button} onPress={handelOnPress}>
              <View style={styles.buttonContent}>
                <Icon
                  name={I18nManager.isRTL ? "arrow-left" : "arrow-left"}
                  size={20}
                  color="#FFFFFF"
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>קדימה, מתחילים</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: "#1A2540", // Dark background color
    borderBottomColor: "#FFFFFF", // White border for the top half
    borderBottomWidth: height / 2, // Half screen border
  },
  image: {
    width: width,
    height: height * 1,
  },
  textContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end", // Align text based on RTL/LTR
  },
  hader: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1A2540", // Dark blue color
  },
  subText: {
    fontSize: 18,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#ED2027",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row", // Set row direction
    width: width * 0.8,
    position: "absolute",
    alignSelf: "center", // Horizontally center the button
  },
  buttonContent: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row", // Adjust content direction for RTL/LTR
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10, // Space between the icon and the text
  },
  icon: {
    position: "absolute",
    [I18nManager.isRTL ? "left" : "left"]: width * -0.2, // Dynamically set icon position
  },
  bottom: {
    position: "absolute",
    bottom: 80, // Adjust button position relative to screen height
    width: "100%",
    // alignItems: "center",
  },
});

export default PrevLog;
