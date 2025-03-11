import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Using Ionicons for the left arrow
const { width } = Dimensions.get("window");

const months = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

const MonthYearSelector = ({
  selectedYear,
  setSelectedYear,
  onSelectMonth,
}) => {
  const [currentYear, setCurrentYear] = useState(selectedYear);

  const handleYearChange = (direction) => {
    setCurrentYear((prevYear) => prevYear + direction);
  };

  return (
    <View style={styles.container}>
      {/* Year Selector */}
      <View style={styles.yearRow}>
        <TouchableOpacity
          onPress={() => handleYearChange(-1)}
          style={{ right: 15 }}
        >
          <Icon
            name="keyboard-arrow-right"
            size={30}
            color="black"
            style={styles.icon}
          />
        </TouchableOpacity>

        <Text style={styles.yearText}>{currentYear}</Text>

        <TouchableOpacity
          onPress={() => handleYearChange(1)}
          style={{ left: 15 }}
        >
          <Icon
            name="keyboard-arrow-left"
            size={30}
            color="black"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Month Grid */}
      <View style={styles.monthGrid}>
        {months.map((month, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.monthButton,
              {
                backgroundColor:
                  index === new Date().getMonth() &&
                  currentYear === new Date().getFullYear()
                    ? "#d01117"
                    : "transparent",
              },
            ]}
            onPress={() => onSelectMonth(currentYear, index + 1)}
          >
            <Text
              style={[
                styles.monthText,
                {
                  color:
                    index === new Date().getMonth() &&
                    currentYear === new Date().getFullYear()
                      ? "white"
                      : "black",
                },
              ]}
            >
              {month}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  arrow: {
    fontSize: 24,
    color: "#007AFF",
    marginHorizontal: 20,
  },
  yearText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  monthGrid: {
    width: width * 0.8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  monthButton: {
    width: "30%",
    padding: 10,
    marginVertical: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  monthText: {
    fontSize: 16,
  },
});

export default MonthYearSelector;
