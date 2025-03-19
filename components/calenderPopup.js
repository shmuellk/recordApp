import React, { useState } from "react";
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
import MonthYearSelector from "./MonthYearSelector";
import Icon from "react-native-vector-icons/MaterialIcons";

// -- 1. כופים RTL גלובלי --
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// -- 2. הגדרת לוקאל עברי --
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

  // -- 3. הסרנו את ה-useEffect שבודק I18nManager.isRTL --
  //    אין צורך בבדיקה דינמית, כי כיפתנו RTL באופן גלובלי.

  const handleMonthYearSelect = (year, month) => {
    const newDate = `${year}-${String(month).padStart(2, "0")}-01`;
    setSelectedDate(newDate);
    setShowMonthYearSelector(false);
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    onSelectDate(new Date(day.dateString));
    onClose();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backgroundOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.popupContainer}>
          {showMonthYearSelector ? (
            <MonthYearSelector
              selectedYear={parseInt(selectedDate.split("-")[0], 10)}
              onSelectMonth={handleMonthYearSelect}
            />
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setShowMonthYearSelector((prev) => !prev)}
                style={styles.monthOverlay}
              />
              <Calendar
                current={selectedDate}
                onDayPress={handleDayPress}
                // -- 4. אפשר להחליט איך רוצים להפוך את החיצים --
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
                // -- 5. מוודאים שהלוח משתמש בלוקאל העברי --
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
  monthOverlay: {
    zIndex: 1,
    backgroundColor: "transparent",
    height: 30,
    width: 140,
    top: height * 0.06,
    alignSelf: "center",
  },
  icon: {
    // אם רוצים ליישר אייקונים אחרת, אפשר כאן
  },
});
