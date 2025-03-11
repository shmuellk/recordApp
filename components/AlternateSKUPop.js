import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  I18nManager,
  Animated,
  Easing,
  Image,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons

const { width, height } = Dimensions.get("window");

const PopUp = ({ data, onClose, title, subTitle }) => {
  const [copiedSKU, setCopiedSKU] = useState(null);
  const copyIconOpacity = useRef(new Animated.Value(0)).current;

  const copyLine = async (item) => {
    await Clipboard.setStringAsync(item.SKU);
    setCopiedSKU(item.SKU);

    // Trigger the copy icon animation
    Animated.sequence([
      Animated.timing(copyIconOpacity, {
        toValue: 1, // Fade in
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(copyIconOpacity, {
        toValue: 0, // Fade out after a small delay
        duration: 500,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => setCopiedSKU(null), 2000); // Reset copied SKU after 2 seconds
  };

  return (
    <View style={styles.modalOverlay}>
      {/* Close background */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backgroundOverlay} />
      </TouchableWithoutFeedback>

      {/* Popup content */}
      <View style={styles.popupContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Image source={require("../assets/icons/searchIcons/Close.png")} />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
            alignSelf: "center",
          }}
        >
          <Text style={styles.header}>{subTitle} : </Text>
          <Text style={styles.header}>{title}</Text>
        </View>

        {/* FlatList */}
        {data[0] && (
          <FlatList
            keyboardShouldPersistTaps={"handled"}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text
                  style={[
                    styles.tableCell,
                    copiedSKU === item.SKU && styles.copiedCell,
                  ]}
                  onPress={() => copyLine(item)}
                >
                  {item.SKU}
                </Text>
                {copiedSKU === item.SKU && (
                  <Animated.View style={{ opacity: copyIconOpacity }}>
                    <Icon
                      name="copy"
                      size={20}
                      color="green"
                      style={styles.copyIcon}
                    />
                  </Animated.View>
                )}
              </View>
            )}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true} // Allow nested scrolling
          />
        )}

        {!data[0] && (
          <Text
            style={{
              fontSize: 20,
              alignSelf: "center",
              padding: 50,
            }}
          >
            לא קיים מידע במערכת
          </Text>
        )}
      </View>
    </View>
  );
};

export default PopUp;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  popupContainer: {
    width: width,
    backgroundColor: "white",
    borderTopRightRadius: 30, // Rounded top-right corner
    borderTopLeftRadius: 30, // Rounded top-left corner
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5, // For Android shadow
    zIndex: 2,
    maxHeight: height * 0.6,
  },
  closeButton: {
    alignSelf: I18nManager.isRTL ? "flex-start" : "flex-end",
    zIndex: 3,
    marginBottom: 10,
  },
  header: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 5,
    // bottom: 30,
    color: "#1A2540",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    textAlign: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
  },
  copiedCell: {
    color: "green",
    fontWeight: "bold",
  },
  copyIcon: {
    position: "absolute",
    right: 10,
  },
});
