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
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

// Helper scaling functions
const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const formatCarNumber = (carNumber) => {
  if (!carNumber) return "--------------"; // Default value if undefined/null

  let carStr = carNumber.toString();
  if (carStr.length === 7) {
    return `${carStr.slice(0, 2)}-${carStr.slice(2, 5)}-${carStr.slice(5)}`;
  } else if (carStr.length === 8) {
    return `${carStr.slice(0, 3)}-${carStr.slice(3, 5)}-${carStr.slice(5)}`;
  }
  return carNumber; // Return as is if format doesn't match
};

const PopUp = ({ onClose, data, carNumber }) => {
  console.log("====================================");
  console.log("data = " + JSON.stringify(data));
  console.log("====================================");
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
        <View style={styles.license_platel}>
          <Image
            style={styles.license_icon}
            source={require("../assets/license_platel.png")}
          />
          <Text style={styles.license_plate_number}>
            {formatCarNumber(carNumber)}
          </Text>
        </View>

        <Text style={styles.carInfoHader}>
          {data.MANUFACTURER} {data.MODEL}
        </Text>

        <View style={styles.carInfoView}>
          {data.MANUFACTURE_YEAR && (
            <Text style={styles.carInfoText}>שנת {data.MANUFACTURE_YEAR} </Text>
          )}
          {data.CAPACITY && (
            <Text style={styles.carInfoText}>נפח {data.CAPACITY} </Text>
          )}
        </View>

        <View style={styles.carInfoView}>
          {data.ENGINE_MODEL && (
            <Text style={styles.carInfoText}>
              דגם מנוע: {data.ENGINE_MODEL}{" "}
            </Text>
          )}
        </View>

        <View style={styles.carInfoView}>
          {data.GEAR && (
            <Text style={styles.carInfoText}>גיר {data.GEAR} </Text>
          )}
          {data.PROPULSION && (
            <Text style={styles.carInfoText}>{data.PROPULSION}</Text>
          )}
        </View>

        <View style={styles.carInfoView}>
          {data.DOORS && (
            <Text style={styles.carInfoText}>{data.DOORS} דלתות </Text>
          )}
          {data.BODY && <Text style={styles.carInfoText}>{data.BODY}</Text>}
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
  license_platel: {
    width: scale(230),
    height: verticalScale(52),
    backgroundColor: "#ffcc33",
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 3,
    marginBottom: scale(10),
    alignSelf: "center",
    flexDirection: "row-reverse",
  },
  license_plate_number: {
    fontSize: scale(30),
    color: "black",
    fontWeight: "bold",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  license_icon: {
    height: verticalScale(48),
    width: scale(32),
    borderRadius: 2,
    resizeMode: "contain",
    alignSelf: "center",
    marginLeft: verticalScale(15),
    backgroundColor: "transparent",
  },
  carInfoHader: {
    textAlign: "center",
    fontSize: scale(25),
    fontWeight: "bold",
    color: "#1A2540",
    marginBottom: 10,
  },
  carInfoText: {
    fontSize: 20,
    color: "#1A2540",
    marginHorizontal: 15,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    textAlign: "center",
    marginBottom: 10,
  },
  carInfoView: {
    flexDirection: "row",
    alignSelf: "center",
  },
});
