import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, Text, TextInput, StyleSheet, I18nManager } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import COLORS from "./colors"; // Ensure this path is correct

const Input = forwardRef(
  (
    {
      label,
      iconName,
      error,
      password,
      onFocus = () => {},
      onSubmit,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hidePassword, setHidePassword] = useState(password);
    const textInputRef = useRef(null);

    useImperativeHandle(ref, () => ({
      focus: () => textInputRef.current?.focus(),
    }));

    return (
      <View style={{ marginBottom: 30 }}>
        <Text
          style={[
            styles.label,
            { textAlign: I18nManager.isRTL ? "left" : "right" }, // Adjust based on RTL/LTR
          ]}
        >
          {label}
        </Text>

        <View
          style={[
            styles.inputView,
            {
              borderColor: error ? "d01117" : isFocused ? "#000000" : "#7E7D83",
              flexDirection: I18nManager.isRTL ? "row-reverse" : "row", // Adjust direction
            },
          ]}
        >
          {password && (
            <Icon
              onPress={() => setHidePassword(!hidePassword)}
              style={[
                styles.icon,
                {
                  marginLeft: I18nManager.isRTL ? 0 : 10,
                  marginRight: I18nManager.isRTL ? 10 : 0,
                }, // Icon position based on RTL/LTR
              ]}
              name={hidePassword ? "eye-outline" : "eye-off-outline"}
            />
          )}

          <TextInput
            ref={textInputRef}
            returnKeyType={onSubmit ? "next" : "done"}
            onSubmitEditing={onSubmit}
            secureTextEntry={hidePassword}
            autoCorrect={false}
            onFocus={() => {
              onFocus();
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            style={[
              styles.input,
              { textAlign: I18nManager.isRTL ? "right" : "right" }, // Adjust text alignment based on RTL/LTR
            ]}
            {...props}
          />
        </View>

        {error && (
          <Text
            style={[
              styles.errorText,
              { textAlign: I18nManager.isRTL ? "left" : "right" }, // Adjust error alignment
            ]}
          >
            {error}
          </Text>
        )}
      </View>
    );
  }
);

export default Input;

const styles = StyleSheet.create({
  label: {
    color: "#7E7D83",
  },
  inputView: {
    flexDirection: "row",
    borderBottomWidth: 0.2,
    borderBottomColor: "#7E7D83",
    marginHorizontal: 3,
    height: 40,
    alignItems: "center",
    borderRadius: 0,
  },
  input: {
    flex: 1,
    color: "#000",
  },
  icon: {
    fontSize: 22,
    color: "#7E7D83",
  },
  errorText: {
    color: "d01117",
    fontSize: 12,
    marginTop: 2,
  },
});
