import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  I18nManager,
  Dimensions,
  ActivityIndicator,
} from "react-native";
const { width, height } = Dimensions.get("window");

const Button = ({ title, onPress = () => {}, loading, enable }) => {
  return (
    <TouchableOpacity
      // activeOpacity={1} // Prevent visual feedback when disabled
      onPress={enable && !loading ? onPress : null} // Disable clicks when not enabled or loading
      style={[
        styles.Btn,
        !enable && styles.DisabledBtn, // Apply disabled style if enable is false
        loading && styles.LoadingBtn, // Adjust style for loading
      ]}
      disabled={!enable || loading} // Explicitly disable the button when needed
    >
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text
          style={[
            styles.Text,
            !enable && styles.DisabledText, // Apply text style for disabled button
            { textAlign: I18nManager.isRTL ? "right" : "left" },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  Btn: {
    width: "100%",
    borderRadius: 10,
    height: height * 0.07,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ED2027",
  },
  DisabledBtn: {
    backgroundColor: "#A9A9A9", // Grey background for disabled state
  },
  LoadingBtn: {
    opacity: 0.8, // Slightly transparent when loading
  },
  Text: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center", // Ensure the text is centered regardless of RTL/LTR
  },
  DisabledText: {
    color: "#E0E0E0", // Lighter color for text when disabled
  },
});
