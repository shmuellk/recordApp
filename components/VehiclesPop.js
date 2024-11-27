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
      <Text style={styles.tableCell1}>{item.manufacturer}</Text>
      <Text style={styles.tableCell2}>{item.years}</Text>
      <Text style={styles.tableCell3}>{item.comments}</Text>
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

          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell1}>יצרן</Text>
            <Text style={styles.tableHeaderCell2}>שנים</Text>
            <Text style={styles.tableHeaderCell3}>הערות</Text>
          </View>
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
    maxHeight: height * 0.6,
  },
  closeButton: {
    alignSelf: I18nManager.isRTL ? "flex-start" : "flex-end", // Aligns close button to the top-left corner
    marginBottom: 10,
  },
  header: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 5,
    bottom: 30,
    color: "#1A2540",
  },
  searchInput: {
    height: 40,
    width: "100%",
    fontSize: 16,
  },
  optionText: {
    fontWeight: "bold",
    fontSize: 18,
    paddingVertical: 15,
    left: 10,
    color: "#333",
    textAlign: "left", // Center text
  },
  separator: {
    height: 1, // Thickness of the underline
    width: "100%", // Full width underline
    backgroundColor: "#E0E0E0", // Light gray underline
  },
  noResultsText: {
    textAlign: "center",
    color: "#7E7D83",
    padding: 10,
    fontSize: 16,
  },
  serch: {
    backgroundColor: "white",
    height: 50,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row", // Reverse the row so the icon is on the right
    alignItems: "center", // Vertically center the contents
    justifyContent: "space-between", // Ensures that the text stays on the left and the icon on the right
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: width,
    alignContent: "center",
    alignSelf: "center",
  },
  placeSerch: {
    flex: 1,
    textAlign: "right", // Align the text to the left
    color: "black", // Set a color for the text
    fontSize: 18,
    marginHorizontal: 20,
  },
  icon: {
    right: 10,
  },
  tableHeader: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    backgroundColor: "#EBEDF5",
    width: width,
    alignSelf: "center",
    alignItems: "center",
    height: 50,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
    color: "#1A2540",
  },
  tableRow: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
  },
  tableCell1: {
    flex: 3.5,
    textAlign: I18nManager.isRTL ? "left" : "right",
    left: 5,
    fontSize: 16,
  },
  tableCell2: {
    flex: 2.5,
    textAlign: I18nManager.isRTL ? "left" : "right",
    left: 5,
    fontSize: 16,
  },
  tableCell3: {
    flex: 4,
    textAlign: I18nManager.isRTL ? "left" : "right",
    left: 5,
    fontSize: 16,
  },
  tableHeaderCell1: {
    flex: 3.5,
    fontWeight: "bold",
    textAlign: I18nManager.isRTL ? "left" : "right",
    fontSize: 18,
    color: "#1A2540",
    left: 15,
  },
  tableHeaderCell2: {
    flex: 2.5,
    fontWeight: "bold",
    textAlign: I18nManager.isRTL ? "left" : "right",
    fontSize: 18,
    color: "#1A2540",
    left: 15,
  },
  tableHeaderCell3: {
    flex: 4,
    fontWeight: "bold",
    textAlign: I18nManager.isRTL ? "left" : "right",
    fontSize: 18,
    color: "#1A2540",
    left: 15,
  },
});
