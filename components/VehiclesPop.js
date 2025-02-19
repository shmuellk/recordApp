import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  I18nManager,
} from "react-native";

const { width, height } = Dimensions.get("window");

const PopUp = ({ data, onClose, title, subTitle }) => {
  return (
    <View style={styles.modalOverlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backgroundOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.popupContainer}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Image source={require("../assets/icons/searchIcons/Close.png")} />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.header}>
          {I18nManager.isRTL
            ? `${title} : ${subTitle}`
            : `${subTitle} : ${title}`}
        </Text>

        {/* Table Header */}
        {data.length > 0 && (
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.cellModel]}>
              דגם רכב
            </Text>
            <Text style={[styles.tableHeaderCell, styles.cellYears]}>שנים</Text>
            <Text style={[styles.tableHeaderCell, styles.cellCapacity]}>
              נפח
            </Text>
          </View>
        )}

        {/* Table Data */}
        {data.length > 0 ? (
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.cellModel]}>
                  {item.model}
                </Text>
                <Text style={[styles.tableCell, styles.cellYears]}>
                  {item.from_year} - {item.until_year}
                </Text>
                <Text style={[styles.tableCell, styles.cellCapacity]}>
                  {item.capacity || "-"}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noDataText}>לא קיים מידע במערכת</Text>
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
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  popupContainer: {
    width: width,
    backgroundColor: "white",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    maxHeight: height * 0.6,
    zIndex: 2,
  },
  closeButton: {
    alignSelf: I18nManager.isRTL ? "flex-start" : "flex-end",
    marginBottom: 10,
    zIndex: 3,
  },
  header: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1A2540",
  },
  noDataText: {
    fontSize: 18,
    textAlign: "center",
    padding: 50,
    color: "#7E7D83",
  },
  tableHeader: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    backgroundColor: "#EBEDF5",
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
    color: "#1A2540",
  },
  tableRow: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableCell: {
    textAlign: "center",
    fontSize: 16,
  },

  /* Column-Specific Styles */
  cellModel: {
    flex: 3,
    textAlign: I18nManager.isRTL ? "left" : "right",
    paddingHorizontal: 10,
  },
  cellYears: {
    flex: 4,
    textAlign: "center",
  },
  cellCapacity: {
    flex: 3,
    textAlign: "center",
  },
});
