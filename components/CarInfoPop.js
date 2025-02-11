import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  I18nManager,
} from "react-native";

const { width, height } = Dimensions.get("window");

const PopUp = ({ onClose, data }) => {
  return (
    <View style={styles.modalOverlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backgroundOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.popupContainer}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Image source={require("../assets/icons/searchIcons/Close.png")} />
        </TouchableOpacity>
        <Text style={styles.header}>
          {data.MODEL} {data.MANUFACTURE_YEAR}
        </Text>
        <View style={styles.tableContainer}>
          {/* Row 1 */}
          <View style={styles.tableRow}>
            <Text style={styles.tableHeaderCell}>יצרן</Text>
            <Text style={styles.tableDataCell}>{data.MANUFACTURER}</Text>
            <Text style={styles.tableHeaderCell}>מודל</Text>
            <Text style={styles.tableDataCell}>{data.MODEL}</Text>
          </View>

          {/* Row 2 */}
          <View style={styles.tableRow}>
            <Text style={styles.tableHeaderCell}>שנה</Text>
            <Text style={styles.tableDataCell}>{data.MANUFACTURE_YEAR}</Text>
            <Text style={styles.tableHeaderCell}>דגם מנוע</Text>
            <Text style={styles.tableDataCell}>{data.ENGINE_MODEL}</Text>
          </View>

          {/* Row 3 */}
          <View style={styles.tableRow}>
            <Text style={styles.tableHeaderCell}>נפח</Text>
            <Text style={styles.tableDataCell}>{data.CAPACITY}</Text>
            <Text style={styles.tableHeaderCell}>בנזין/דיזל</Text>
            <Text style={styles.tableDataCell}>{data.GAS}</Text>
          </View>

          {/* Row 4 */}
          <View style={styles.tableRow}>
            <Text style={styles.tableHeaderCell}>גיר</Text>
            <Text style={styles.tableDataCell}>{data.GEAR}</Text>
            <Text style={styles.tableHeaderCell}>הנעה</Text>
            <Text style={styles.tableDataCell}>{data.PROPULSION}</Text>
          </View>

          {/* Row 5 */}
          <View style={styles.tableRow}>
            <Text style={styles.tableHeaderCell}>מספר דלתות</Text>
            <Text style={styles.tableDataCell}>{data.DOORS}</Text>
            <Text style={styles.tableHeaderCell}>מרכב</Text>
            <Text style={styles.tableDataCell}>{data.BODY}</Text>
          </View>
        </View>
      </View>
    </View>
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

  tableContainer: {
    flexDirection: "column", // The container holds rows in a column
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
    zIndex: 2,
    maxHeight: height * 0.6,
  },
  closeButton: {
    alignSelf: I18nManager.isRTL ? "flex-start" : "flex-end", // Aligns close button to the top-left corner
    zIndex: 3,
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

  icon: {
    right: 10,
  },

  tableRow: {
    flexDirection: "row", // Each row holds cells in a row
    marginVertical: 0,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    color: "white",
    borderWidth: 0.2, // Border thickness
    borderColor: "#000", // Border color
    padding: 8, // Spacing inside cells
    backgroundColor: "#1A2540", // Example background for header cells
  },
  // Style for data (value) cells
  tableDataCell: {
    flex: 1,
    fontSize: 16,
    textAlign: "left",
    color: "#1A2540",
    borderWidth: 0.2,
    borderColor: "#000",
    padding: 8,
    backgroundColor: "#EBEDF5", // Example background for data cells
    // For proper RTL direction (if needed):
    // writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
  },
});
