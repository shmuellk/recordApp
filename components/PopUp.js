import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  I18nManager,
} from "react-native";
import Icon from "react-native-vector-icons/Feather"; // Using Ionicons for the left arrow
import Icon2 from "react-native-vector-icons/Ionicons"; // Using Ionicons for the left arrow

const { width, height } = Dimensions.get("window");

const PopUp = ({ data, onSelect, onClose, title }) => {
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query

  // Function to handle search input change
  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  // Filter the data based on search query
  const filteredData = data?.filter((item) =>
    (item?.toString() || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separator component to be used between items
  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

        {/* Search Input */}
        <View style={styles.serch}>
          <TextInput
            style={styles.placeSerch}
            placeholder={`חפש ${title}`}
            placeholderTextColor="#999" // Adjust placeholder color if needed
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <Icon name="search" size={22} color="black" style={styles.icon} />
        </View>

        {/* List of options */}
        {filteredData && (
          <FlatList
            keyboardShouldPersistTaps={"handled"}
            data={filteredData} // Filtered data passed as props
            keyExtractor={(item, Index) => Index} // Assume data is a list of strings
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  onSelect(item); // Set selected item as placeholder
                  onClose(); // Close the popup
                }}
                style={{
                  flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      flex: 1,
                      textAlign: I18nManager.isRTL ? "left" : "right",
                    },
                  ]}
                >
                  {item}
                </Text>
                <Icon2 name="radio-button-off" size={35} color="#DEE2E6" />
              </TouchableOpacity>
            )}
            // Add separator between items
            ItemSeparatorComponent={renderSeparator}
            ListEmptyComponent={
              <Text style={styles.noResultsText}>No results found</Text>
            } // Show when no results are found
          />
        )}
        {!filteredData && (
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
    // </TouchableWithoutFeedback>
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
});
