import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  I18nManager,
} from "react-native";

const { width, height } = Dimensions.get("window");

const PopUp = ({ data, onClose, title }) => {
  const renderRow = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.infoLine}>
        <Text style={styles.infoHeader}>קוד פריט: </Text>
        <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
          {item.id}
        </Text>
      </View>

      <View style={styles.infoLine}>
        <Text style={styles.infoHeader}>תיאור פריט: </Text>
        <Text style={styles.tableCell}>{item.name}</Text>
      </View>

      <View style={styles.infoLine}>
        <Text style={styles.infoHeader}>כמות: </Text>
        <Text style={styles.tableCell}>{item.quantity}</Text>
      </View>

      <View style={styles.infoLine}>
        <Text style={styles.infoHeader}>מחיר: </Text>
        <Text style={styles.tableCell}>{item.price} ₪</Text>
      </View>
    </View>
  );
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.modalOverlay}>
        {/* Close the modal when touching outside the popup */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backgroundOverlay} />
        </TouchableWithoutFeedback>

        {/* Popup content */}
        <View style={styles.popupContainer}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Image source={require("../assets/icons/searchIcons/Close.png")} />
          </TouchableOpacity>
          <Text style={styles.header}>{title}</Text>
          <View style={styles.separator} />
          <FlatList
            data={data} // Filtered data passed as props
            keyExtractor={(item, index) => index.toString()} // Assume data is a list of strings
            showsVerticalScrollIndicator={false}
            renderItem={renderRow}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PopUp;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end", // Aligns popup to bottom of the screen
    alignItems: "center", // Centers popup horizontally
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent", // Transparent so only the modal background is tappable
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
    maxHeight: height * 0.8,
  },
  closeButton: {
    alignSelf: I18nManager.isRTL ? "flex-start" : "flex-end", // Aligns close button to the top-left corner
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    bottom: 20,
    color: "#1A2540",
  },
  tableRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EBEDF5",
    minHeight: 140,
  },
  infoLine: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    marginBottom: 5,
  },
  infoHeader: {
    fontWeight: "bold",
    color: "#7E7D83",
    textAlign: I18nManager.isRTL ? "left" : "right",
    flex: 1,
    fontSize: 16,
  },
  tableCell: {
    flex: 2,
    fontSize: 16,
    color: "#1A2540",
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  separator: {
    height: 1, // Thickness of the underline
    width: "100%", // Full width underline
    backgroundColor: "#E0E0E0", // Light gray underline
  },
});