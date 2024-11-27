import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import CalendarPop from "../components/calenderPopup";
import InvPopup from "../components/invPopup";
const { width, height } = Dimensions.get("window");

const TrackScreen = ({ navigation }) => {
  const today = new Date();
  const thisYear = today.getFullYear();
  const defaultStartDate = new Date(thisYear, 0, 1).toLocaleDateString("en-GB");
  const defaultEndDate = today.toLocaleDateString("en-GB");

  const [isEmpty, setIsEmpty] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(null);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [isProcessingSelected, setIsProcessingSelected] = useState(false);
  const [isDeliveredSelected, setIsDeliveredSelected] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const inv = [
    {
      id: 11725330,
      shipping_method: "נזמי",
      status: "חבילה נשלחה",
      date: "18/08/2024",
      time: "12:30",
    },
    {
      id: 11725331,
      shipping_method: "שחר",
      status: "חבילה נשלחה",
      date: "18/08/2024",
      time: "12:30",
    },
    {
      id: 11725332,
      shipping_method: "נזמי",
      status: "חבילה נשלחה",
      date: "18/08/2024",
      time: "12:30",
    },
    {
      id: 11725333,
      shipping_method: "שחר",
      status: "חבילה נשלחה",
      date: "18/08/2024",
      time: "12:30",
    },
    {
      id: 11725334,
      shipping_method: "נזמי",
      status: "חבילה נשלחה",
      date: "18/08/2024",
      time: "12:30",
    },
    {
      id: 11725335,
      shipping_method: "שחר",
      status: "חבילה נשלחה",
      date: "18/08/2024",
      time: "12:30",
    },
    {
      id: 11725336,
      shipping_method: "נזמי",
      status: "חבילה נשלחה",
      date: "18/08/2024",
      time: "12:30",
    },
    {
      id: 11725337,
      shipping_method: "שחר",
      status: "חבילה נשלחה",
      date: "18/08/2024",
      time: "12:30",
    },
    {
      id: 11725338,
      shipping_method: "נזמי",
      status: "חבילה נשלחה",
      date: "18/08/2024",
      time: "12:30",
    },
    {
      id: 11725339,
      shipping_method: "שחר",
      status: "חבילה נשלחה",
      date: "18/08/2024",
      time: "12:30",
    },
    {
      id: 11725340,
      shipping_method: "נזמי",
      status: "חבילה נשלחה",
      date: "18/08/2024",
      time: "12:30",
    },
    {
      id: 11725341,
      shipping_method: "שחר",
      status: "חבילה נשלחה",
      date: "18/08/2024",
      time: "12:30",
    },
  ];

  const handleItemPress = (item) => {
    setSelectedItem(item); // Set the selected item
  };

  const closeInvPopup = () => {
    setSelectedItem(null); // Close the popup by clearing selectedItem
  };

  const togglePopUp = (type = null) => {
    setOpenPopUp(type);
  };
  const renderSeparatorItem = () => <View style={styles.ItemsSeparator} />;

  const handleSetDate = (date) => {
    const formattedDate = date.toLocaleDateString("en-GB");
    if (openPopUp === "start") setStartDate(formattedDate);
    else setEndDate(formattedDate);
    setOpenPopUp(null); // Close popup
  };

  const renderCategory = ({ item, index }) => (
    <TouchableOpacity
      style={{ flexDirection: "row", height: height * 0.11 }}
      onPress={() => handleItemPress(item.id)}
    >
      <View style={{ flexDirection: "row", flex: 7.5 }}>
        <View style={{ padding: 10 }}>
          <Text style={styles.itemHader}>מ'ס חשבונית : </Text>
          <Text style={styles.itemInfo}>אופן שילוח : </Text>
          <Text style={styles.itemInfo}>סטטוס : </Text>
        </View>
        <View style={{ padding: 10 }}>
          <Text style={[styles.itemHader, { textAlign: "left" }]}>
            {item.id}
          </Text>
          <Text style={{ textAlign: "left" }}>{item.shipping_method}</Text>
          <Text style={{ textAlign: "left" }}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.verticalSeparator} />
      <View
        style={{
          flex: 3.5,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={styles.itemHader}>{item.date}</Text>
        <Text style={styles.itemHader}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      {isEmpty ? (
        <View style={styles.container}>
          <View style={styles.emptyCartView}>
            <Icon
              name="list"
              size={70}
              color="#1A2540"
              style={styles.serchItemIcon}
            />
          </View>
          <View style={styles.massegeView}>
            <Text style={styles.mainHader}>אין הזמנות</Text>
            <Text style={styles.SubHader}>ההזמנות שלך יופיעו כאן</Text>
          </View>
        </View>
      ) : (
        <View style={styles.container2}>
          <View style={{ flex: 0.5 }}></View>
          <View
            style={{
              flex: 1.5,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#E0E0E0",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => togglePopUp("start")}
              style={{
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={{ fontWeight: "bold", color: "#6F6F6F", fontSize: 16 }}
              >
                מתאריך
              </Text>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginVertical: 5 }}
              >
                {startDate}
              </Text>
              <Text style={{ color: "#6F6F6F", fontSize: 16 }}>יום שלישי</Text>
            </TouchableOpacity>

            <View
              style={{
                width: 1,
                height: "100%",
                backgroundColor: "#E0E0E0",
              }}
            />

            <TouchableOpacity
              onPress={() => togglePopUp("end")}
              style={{
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={{ fontWeight: "bold", color: "#6F6F6F", fontSize: 16 }}
              >
                עד תאריך
              </Text>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginVertical: 5 }}
              >
                {endDate}
              </Text>
              <Text style={{ color: "#6F6F6F", fontSize: 16 }}>יום שלישי</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 0.6,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={[
                styles.filterButton,
                isProcessingSelected && styles.selectedButton,
              ]}
              onPress={() => setIsProcessingSelected(!isProcessingSelected)}
            >
              <Text
                style={[
                  styles.buttonText,
                  isProcessingSelected && styles.selectedButtonText,
                ]}
              >
                חבילה בטיפול
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                isDeliveredSelected && styles.selectedButton,
              ]}
              onPress={() => setIsDeliveredSelected(!isDeliveredSelected)}
            >
              <Text
                style={[
                  styles.buttonText,
                  isDeliveredSelected && styles.selectedButtonText,
                ]}
              >
                חבילה נמסרה
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ItemsSeparator} />

          <View style={{ flex: 7.4 }}>
            <FlatList
              data={inv}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={renderSeparatorItem}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <Modal
            visible={!!openPopUp}
            transparent={true}
            animationType="slide"
            onRequestClose={() => togglePopUp(null)}
          >
            <CalendarPop
              onClose={() => togglePopUp(null)}
              onSelectDate={handleSetDate}
            />
          </Modal>
          <Modal
            visible={!!selectedItem}
            transparent={true}
            animationType="slide"
            onRequestClose={closeInvPopup}
          >
            {selectedItem && (
              <InvPopup
                title={selectedItem}
                onClose={closeInvPopup}
                data={[
                  {
                    id: "DAC 42800041 ABS",
                    name: "פלאג אסטרה 1.4 מ-2011 + שברולט טרקס 1.4 טורבו + קרוז 1.4 טוברו=NGK91039N",
                    quantity: 4,
                    price: 93.0,
                  },
                  {
                    id: "DAC 42800042 ABS",
                    name: "פלאג אסטרה 1.4 מ-2011 + שברולט טרקס 1.4 טורבו + קרוז 1.4 טוברו=NGK91039N",
                    quantity: 4,
                    price: 93.0,
                  },
                  {
                    id: "DAC 42800043 ABS",
                    name: "פלאג אסטרה 1.4 מ-2011 + שברולט טרקס 1.4 טורבו + קרוז 1.4 טוברו=NGK91039N",
                    quantity: 4,
                    price: 93.0,
                  },
                  {
                    id: "DAC 42800044 ABS",
                    name: "פלאג אסטרה 1.4 מ-2011 + שברולט טרקס 1.4 טורבו + קרוז 1.4 טוברו=NGK91039N",
                    quantity: 4,
                    price: 93.0,
                  },
                  {
                    id: "DAC 42800045 ABS",
                    name: "פלאג אסטרה 1.4 מ-2011 + שברולט טרקס 1.4 טורבו + קרוז 1.4 טוברו=NGK91039N",
                    quantity: 4,
                    price: 93.0,
                  },
                ]}
              />
            )}
          </Modal>
        </View>
      )}
    </>
  );
};

export default TrackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    flex: 1,
    backgroundColor: "white",
  },
  emptyCartView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EBEDF5",
    height: 150,
    width: 150,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    elevation: 15,
  },
  massegeView: {
    justifyContent: "center",
    alignItems: "center",
  },
  mainHader: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1A2540",
  },
  SubHader: {
    fontSize: 20,
    color: "#7E7D83",
  },
  filterButton: {
    backgroundColor: "#EBEDF5",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    padding: 5,
    borderRadius: 15,
    marginHorizontal: 10,
    width: 120,
  },
  selectedButton: {
    backgroundColor: "#ED2027", // Red color when selected
  },
  buttonText: {
    color: "#000000", // Default text color
  },
  selectedButtonText: {
    color: "#FFFFFF", // Text color when selected
  },
  ItemsSeparator: {
    height: 1.5,
    width: width,
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
  },
  ItemsSeparator: {
    height: 1.5,
    width: width,
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
  },
  verticalSeparator: {
    width: 1.5,
    height: "90%",
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
  },
  itemHader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A2540",
  },
  itemInfo: { fontSize: 18, color: "#1A2540" },
});
