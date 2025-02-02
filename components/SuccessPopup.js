import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";

const SuccessPopup = ({ text, visible, onDismiss, color }) => {
  const popupOpacity = useRef(new Animated.Value(0)).current; // Opacity animation
  const popupScale = useRef(new Animated.Value(0)).current; // Scale animation

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(popupOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(popupScale, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(popupOpacity, {
            toValue: 0,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(popupScale, {
            toValue: 0,
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(() => {
          onDismiss();
        });
      }, 2000);
    }
  }, [visible]);

  return (
    visible && (
      <Animated.View
        style={[
          styles.popupContainer,
          {
            opacity: popupOpacity,
            transform: [{ scale: popupScale }],
            backgroundColor: color, // Apply dynamic background color
          },
        ]}
      >
        <Text style={styles.popupText}>{text}</Text>
      </Animated.View>
    )
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    position: "absolute",
    top: 80,
    width: "80%",
    alignSelf: "center",
    zIndex: 999999,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  popupText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SuccessPopup;
