import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  I18nManager,
} from "react-native";
import Icon from "react-native-vector-icons/Feather"; // Using Ionicons for the left arrow
const { width, height } = Dimensions.get("window");

const SerchInput = forwardRef(
  ({ iconName, error, onFocus = () => {}, onSubmit, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const textInputRef = useRef(null);

    useImperativeHandle(ref, () => ({
      focus: () => textInputRef.current?.focus(),
    }));

    return (
      <View style={styles.container}>
        <Icon name="search" size={22} color="#FFFFFF" style={styles.icon} />
        <TextInput
          ref={textInputRef}
          returnKeyType={onSubmit ? "next" : "done"}
          onSubmitEditing={onSubmit}
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          style={styles.input} // TextInput takes up the remaining space
          {...props}
        />
      </View>
    );
  }
);

export default SerchInput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: width * 0.9,
    height: 61,
    borderRadius: 15,
    top: height * 0.01,
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center", // Centers the icon vertically
    justifyContent: "flex-start",
  },
  input: {
    flex: 1,
    textAlign: "right", // Align the text to the right
    alignItems: "center",
    justifyContent: "center",
    color: "#BDC3C7", // Set a color for the text
    fontSize: 18,
  },
  icon: {
    color: "#1A2540",
    marginHorizontal: 10, // Adds space between the icon and input
  },
});
