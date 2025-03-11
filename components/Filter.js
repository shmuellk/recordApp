import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  I18nManager,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Using Ionicons for the left arrow
import PopUp from "./PopUp"; // Ensure this is the correct path

const { width, height } = Dimensions.get("window");

const Filter = ({
  placeholder,
  data,
  enable,
  onSelectItem,
  currentValue,
  loading,
}) => {
  const [openPopUp, setOpenPopUp] = useState(false);
  const [selectedPlaceholder, setSelectedPlaceholder] = useState(placeholder);

  // Toggle pop-up state
  const togglePopUp = () => {
    if (!loading && enable) {
      setOpenPopUp(!openPopUp);
    }
  };

  const handleSelect = (selectedItem) => {
    setSelectedPlaceholder(selectedItem);
    setOpenPopUp(false); // Close the popup after selection
    if (onSelectItem) {
      onSelectItem(selectedItem); // Pass selectedItem to onSelectItem
    }
  };
  useEffect(() => {
    // Update the displayed placeholder if `currentValue` changes
    if (currentValue === "") {
      setSelectedPlaceholder(placeholder); // Reset to placeholder when cleared
    } else {
      setSelectedPlaceholder(currentValue); // Update to currentValue
    }
  }, [currentValue]);

  return (
    <View>
      {enable ? (
        <TouchableOpacity
          style={styles.container}
          onPress={togglePopUp}
          disabled={!enable || loading}
        >
          {loading ? ( // Show loader if loading
            <ActivityIndicator size="small" color="#d01117" />
          ) : (
            <>
              <Text style={styles.input}>{selectedPlaceholder}</Text>
              <Icon name="keyboard-arrow-down" size={22} style={styles.icon} />
            </>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.container, { backgroundColor: "#E0E0E080" }]}
        >
          <Text style={[styles.input, { color: "black" }]}>
            {currentValue || placeholder}
          </Text>
        </TouchableOpacity>
      )}

      {/* Render Modal for the PopUp */}
      <Modal
        visible={openPopUp}
        transparent={true}
        animationType="slide" // Animates the popup from the bottom
        onRequestClose={togglePopUp} // Closes the modal on Android back button
      >
        <PopUp
          data={data}
          onSelect={handleSelect}
          onClose={togglePopUp}
          title={placeholder}
        />
      </Modal>
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: width * 0.4,
    height: height * 0.045,
    borderRadius: 10,
    marginTop: 15,
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center", // Centers the icon vertically
  },
  input: {
    flex: 1,
    textAlign: I18nManager.isRTL ? "left" : "right", // Align the text to the right
    alignItems: "center",
    justifyContent: "center",
    color: "#BDC3C7", // Set a color for the text
    fontSize: 18,
    paddingRight: 10,
  },
  icon: {
    color: "#7C7C7C",
    marginHorizontal: 10, // Adds space between the icon and input
  },
});
