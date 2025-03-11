import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  I18nManager,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import MonthYearSelector from "./MonthYearSelector"; // Import the custom selector component
import Icon from "react-native-vector-icons/MaterialIcons"; // Using Ionicons for the left arrow

LocaleConfig.locales["he"] = {
  monthNames: [
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
  ],
  monthNamesShort: [
    "ינו",
    "פבר",
    "מרץ",
    "אפר",
    "מאי",
    "יונ",
    "יול",
    "אוג",
    "ספט",
    "אוק",
    "נוב",
    "דצמ",
  ],
  dayNames: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
  dayNamesShort: ["א", "ב", "ג", "ד", "ה", "ו", "ש"],
  today: "היום",
};
LocaleConfig.defaultLocale = "he";
const { width, height } = Dimensions.get("window");

const CalendarPop = ({ onClose, onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showMonthYearSelector, setShowMonthYearSelector] = useState(false);
  useEffect(() => {
    if (I18nManager.isRTL) {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
  }, []);

  const handleMonthYearSelect = (year, month) => {
    // Set the selected date to the first day of the selected month and year as a string
    const newDate = `${year}-${String(month).padStart(2, "0")}-01`;
    setSelectedDate(newDate);
    setShowMonthYearSelector(false); // Hide the month-year selector
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    onSelectDate(new Date(day.dateString)); // Send date to TrackScreen
    onClose(); // Close modal
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backgroundOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.popupContainer}>
          {/* Month-Year Selector */}
          {showMonthYearSelector ? (
            <MonthYearSelector
              selectedYear={parseInt(selectedDate.split("-")[0], 10)}
              onSelectMonth={handleMonthYearSelect}
            />
          ) : (
            // Calendar with selected date set to the updated year and
            <>
              <TouchableOpacity
                onPress={() => setShowMonthYearSelector((prev) => !prev)}
                style={styles.monthOverlay}
              ></TouchableOpacity>

              <Calendar
                current={selectedDate} // Pass as a formatted string
                onDayPress={handleDayPress}
                renderArrow={(direction) => (
                  <Icon
                    name={
                      direction === "left"
                        ? "keyboard-arrow-right"
                        : "keyboard-arrow-left"
                    }
                    size={30}
                    color="black"
                    style={styles.icon}
                  />
                )}
                markedDates={{
                  [selectedDate]: { selected: true, selectedColor: "#d01117" },
                }}
                monthFormat={"MMMM yyyy"}
                theme={{
                  textDayHeaderFontWeight: "bold",
                  textMonthFontWeight: "bold",
                  textDayHeaderFontSize: 16,
                  textMonthFontSize: 20,
                  arrowColor: "#d01117",
                  todayTextColor: "#d01117",
                }}
                locale="he"
              />
            </>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CalendarPop;

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
    maxHeight: height * 0.8,
    minHeight: height * 0.55,
  },
  selectorToggle: {
    alignItems: "center",
    padding: 15,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    position: "absolute",
    bottom: 10,
    width: width * 0.9,
    alignSelf: "center",
    justifyContent: "center",
  },
  toggleText: {
    color: "white",
    fontWeight: "bold",
  },
  monthOverlay: {
    zIndex: 1,
    backgroundColor: "transparent",
    height: 30,
    width: 140,
    top: height * 0.06,

    alignSelf: "center",
  },
});
