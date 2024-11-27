import React, { useState, useRef } from "react";
import {
  Keyboard,
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  I18nManager, // Import I18nManager for RTL/LTR handling
} from "react-native";

import COLORS from "../components/colors"; // Ensure this path is correct
import Button from "../components/Button";
import Input from "../components/lnputs";

const { width, height } = Dimensions.get("window");

const LogInScreen = ({ navigation }) => {
  const [inputs, setInputs] = useState({
    userName: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const passwordRef = useRef(null);

  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const logIn = () => {
    navigation.navigate("App", { userName: inputs.userName });
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={responsiveStyles.safeArea}>
        <Image
          style={responsiveStyles.image}
          source={require("../assets/logo.png")}
        />
        <View style={responsiveStyles.textContainer}>
          <Text style={responsiveStyles.header}>כניסת לקוחות</Text>
          <Text style={responsiveStyles.subText}>הכנס שם משתמש וסיסמא</Text>
        </View>
        <View style={responsiveStyles.inputContainer}>
          <Input
            placeholder="שם משתמש"
            label="שם משתמש"
            autoFocus={true}
            error={errors.userName}
            onFocus={() => {
              handleError(null, "userName");
            }}
            onChangeText={(text) => handleOnChange(text, "userName")}
            value={inputs.userName}
            onSubmitEditing={() => passwordRef.current.focus()}
            returnKeyType="next"
          />
          <Input
            placeholder="סיסמא"
            label="סיסמא"
            password
            error={errors.password}
            onFocus={() => {
              handleError(null, "password");
            }}
            onChangeText={(text) => handleOnChange(text, "password")}
            value={inputs.password}
            ref={passwordRef}
            onSubmitEditing={logIn}
            returnKeyType="done"
          />
          <View style={{ top: 20 }}>
            <Button title="התחבר" onPress={logIn} enable={true} />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LogInScreen;

const responsiveStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    width: width,
    height: height,
  },
  image: {
    top: height * 0.15,
    alignSelf: I18nManager.isRTL ? "center" : "center", // Adjust based on RTL/LTR
    resizeMode: "stretch",
  },
  inputContainer: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: COLORS.white,
    top: width * 0.44,
  },
  textContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end", // Adjust text alignment based on RTL/LTR
    top: height * 0.2,
  },
  header: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    color: "#1A2540",
  },
  subText: {
    fontSize: 18,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 5,
  },
});
