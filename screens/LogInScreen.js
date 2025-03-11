import React, { useState, useRef, useEffect } from "react";
import {
  Keyboard,
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  I18nManager,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

import COLORS from "../components/colors";
import Button from "../components/Button";
import Input from "../components/lnputs";
import usersModel from "../model/usersModel";
import armorModel from "../model/armorModel";

const { width, height } = Dimensions.get("window");

const LogInScreen = ({ navigation }) => {
  const [inputs, setInputs] = useState({
    userName: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // state and ref to track which input is focused
  const [focusedInput, setFocusedInput] = useState(null);
  const focusedInputRef = useRef(null);

  const passwordRef = useRef(null);
  const scrollViewRef = useRef(null);

  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // פונקציה לעדכון שדה המוקד
  const handleSetFocus = (field) => {
    setFocusedInput(field);
    focusedInputRef.current = field;
  };

  const logIn = async () => {
    try {
      const response = await usersModel.login({
        userName: inputs.userName,
        Password: inputs.password,
      });

      if (response.length > 0) {
        const userData = response[0]; // Extract user data
        const inArmor = await armorModel.getArmorsInStock({
          userName: userData.U_USER_NAME,
          cardCode: userData.U_CARD_CODE,
        });

        // Correctly add `inArmor` to the userData object
        userData.inArmor = Boolean(inArmor); // Ensure it's a boolean (true/false)

        // Navigate with the modified userData
        navigation.navigate("App", { userData });
      } else {
        handleError("שם משתמש או סיסמא שגויים", "password");
      }
    } catch (err) {
      console.log("====================================");
      console.log("error = " + err);
      console.log("====================================");
    }
  };

  // מאזינים לאירועי המקלדת ומגלים למרכז את התוכן,
  // אך לא כאשר המוקד הוא על שדה ה-userName או על שדה ה-password
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        if (
          focusedInputRef.current !== "password" &&
          focusedInputRef.current !== "userName"
        ) {
          const keyboardHeight = event.endCoordinates.height;
          // מחשבים את מיקום הגלילה כך שהתוכן יהיה במרכז בין המקלדת לחלק העליון
          const scrollOffset = (height - keyboardHeight) / 2;
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: scrollOffset, animated: true });
          }
        }
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
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
                  handleSetFocus("userName");
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
                  handleSetFocus("password");
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
      </ScrollView>
    </KeyboardAvoidingView>
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
    alignSelf: "center",
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
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
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
