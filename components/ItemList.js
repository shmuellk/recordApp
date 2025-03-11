import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
const Button = ({ title, onPress = () => {} }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.Btn}>
      <Text style={styles.Text}>{title}</Text>
    </TouchableOpacity>
  );
};
export default Button;
const styles = StyleSheet.create({
  Btn: {
    width: "100%",
    borderRadius: 10, // Rounded corners
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    backgroundColor: "#d01117",
  },
  Text: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
});
