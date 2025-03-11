import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  FlatList,
  ActivityIndicator,
  I18nManager,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import CalendarPop from "../components/calenderPopup";
import InvPopup from "../components/invPopup";
import ordersModel from "../model/ordersModel";
import { TextInput } from "react-native-gesture-handler";
import clientModel from "../model/clientModel";

const { width, height } = Dimensions.get("window");

// Base dimensions from your design (adjust these values as needed)
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

// Scaling helper functions
const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const TrackScreen = ({ navigation, route }) => {
  const today = new Date();
  const { userData } = route.params;
  const defaultStartDate = today.toLocaleDateString("en-GB");
  const defaultEndDate = today.toLocaleDateString("en-GB");
  const [isEmpty, setIsEmpty] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(null);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const [invData, setInvData] = useState([]);
  const [popUploading, setPopUploading] = useState(false);
  const [pageloading, setPageloading] = useState(false);
  const [totalorder, setTotalOrder] = useState(0);
  const [clientName, setClientName] = useState("");
  const [clientList, setClientList] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchClinentList = async () => {
      const data = await clientModel.getAllClient();
      setClientList(data);
      setFilteredClients(data);
    };
    fetchClinentList();
  }, []);

  const handleClientSearch = (text) => {
    setClientName(text);
    if (text.length > 1) {
      const filtered = clientList.filter((client) =>
        client.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredClients(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = async () => {
    setPageloading(true);
    try {
      const response = await ordersModel.getAllOrdersList({
        STARTDATE: startDate,
        ENDDATE: endDate,
        CARDNAME: clientName,
      });
      setOrderList(response);
      setTotalOrder(response[0].TotalRows);
    } catch (err) {
      console.log("====================================");
      console.log("error = " + err);
      console.log("====================================");
    } finally {
      setPageloading(false);
    }
  };

  const handleSelectClient = (client) => {
    setClientName(client);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  useEffect(() => {
    fatchOrderList = async () => {
      setPageloading(true);
      try {
        const response = await ordersModel.getAllOrdersList({
          STARTDATE: startDate,
          ENDDATE: endDate,
          CARDNAME: clientName,
        });
        setOrderList(response);
        setTotalOrder(response[0] ? response[0].TotalRows : 0);
      } catch (err) {
        console.log("====================================");
        console.log("error = " + err);
        console.log("====================================");
      } finally {
        setPageloading(false);
      }
    };
    fatchOrderList();
  }, [startDate, endDate]);

  useEffect(() => {
    const fatchItemsList = async () => {
      if (!selectedItem) return; // If nothing is selected, skip
      try {
        setPopUploading(true); // <-- Start loading
        const response = await ordersModel.getAppOrderByDocNum({
          DOCNUM: selectedItem,
        });
        setInvData(response);
      } catch (err) {
        console.log("====================================");
        console.log("error = " + err);
        console.log("====================================");
      } finally {
        setPopUploading(false); // <-- End loading
      }
    };
    fatchItemsList();
  }, [selectedItem]);

  const handleItemPress = (item) => {
    setSelectedItem(item); // Set the selected item
  };

  const closeInvPopup = () => {
    setSelectedItem(null); // Close the popup by clearing selectedItem
    togglePopUp();
  };

  const togglePopUp = (type = null) => {
    setOpenPopUp(type);
  };

  const getDayName = (dateString) => {
    const dateParts = dateString.split("/");
    const formattedDate = new Date(
      `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
    );
    const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    return days[formattedDate.getDay()];
  };
  const renderSeparatorItem = () => <View style={styles.ItemsSeparator} />;

  const handleSetDate = (date) => {
    const formattedDate = date.toLocaleDateString("en-GB");
    if (openPopUp === "start") setStartDate(formattedDate);
    else setEndDate(formattedDate);
    setOpenPopUp(null); // Close popup
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={{
        flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
        height: height * 0.09,
      }}
      onPress={() => handleItemPress(item.DOCNUM)}
    >
      <View
        style={{
          flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
          flex: 5.5,
        }}
      >
        <View style={{ padding: 10 }}>
          <View
            style={{
              flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
            }}
          >
            <Text style={styles.itemHader}>מס' חשבונית : </Text>
            <Text
              style={[
                styles.itemHader,
                { textAlign: I18nManager.isRTL ? "left" : "right" },
              ]}
            >
              {item.DOCNUM}
            </Text>
          </View>
          <Text style={styles.itemSubText}>{item.CARDNAME}</Text>
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
        <Text style={styles.date}>{item.DOCDATE}</Text>
        <Text style={styles.date}>{item.DOCHOUR}</Text>
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
              height: height * 0.13,
              flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
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
              <Text style={{ color: "#6F6F6F", fontSize: 16 }}>
                יום {getDayName(startDate)}
              </Text>
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
              <Text style={{ color: "#6F6F6F", fontSize: 16 }}>
                יום {getDayName(endDate)}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
              width: width,
              height: height * 0.06,
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                height: scale(30),
                width: verticalScale(130),
                alignSelf: "center",
                borderRadius: 10,
                borderColor: "#EBEDF8",
                borderWidth: 2,
              }}
            >
              <TextInput
                placeholder="חפש שם לקוח"
                style={styles.input}
                value={clientName}
                onChangeText={handleClientSearch}
              />
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#d01117",
                height: scale(28),
                width: verticalScale(50),
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
              onPress={handleSearch}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
              >
                חפש
              </Text>
            </TouchableOpacity>

            <View
              style={{
                height: scale(30),
                width: verticalScale(100),
                alignSelf: "center",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                borderColor: "#EBEDF8",
                borderWidth: 2,
              }}
            >
              <Text adjustsFontSizeToFit>סכ"ה הזמנות : {totalorder}</Text>
            </View>
          </View>
          {showSuggestions && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={filteredClients}
                keyExtractor={(item, index) => index.toString()}
                keyboardShouldPersistTaps={"handled"}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectClient(item)}>
                    <Text style={styles.suggestionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
          <View style={styles.ItemsSeparator} />
          <View style={{ flex: 7.4 }}>
            {pageloading ? (
              /* Loader appears here if "loading" is true */
              <View style={styles.loaderContainer}>
                <ActivityIndicator
                  size="large"
                  color="#d01117"
                  style={styles.bigSpinner}
                />
              </View>
            ) : (
              <FlatList
                data={orderList}
                renderItem={renderItem}
                keyExtractor={(item, index) => index}
                ItemSeparatorComponent={renderSeparatorItem}
                showsVerticalScrollIndicator={false}
              />
            )}
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
                data={invData}
                loading={popUploading}
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
  suggestionsContainer: {
    position: "absolute",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    width: verticalScale(130),

    maxHeight: height * 0.3,
    zIndex: 10, // Ensures it appears above everything else
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    right: I18nManager.isRTL ? null : 20,
    left: I18nManager.isRTL ? 20 : null,
    top: height * 0.225,
  },
  suggestionText: {
    padding: 12,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  input: {
    borderRadius: 15,
    padding: height * 0.01,
    textAlign: "right",
    width: "100%",
    alignSelf: "center",
    backgroundColor: "white",
    fontSize: 14,
    color: "#BDC3C7",
  },
  container2: {
    flex: 1,
    backgroundColor: "white",
  },
  itemSubText: {
    fontSize: 14,
    color: "#666", // צבע פחות דומיננטי לשם החברה
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
    width: width * 0.28,
  },
  selectedButton: {
    backgroundColor: "#d01117", // Red color when selected
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
    fontSize: 15,
    fontWeight: "bold",
    color: "#d01117",
  },
  date: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1A2540",
  },
  itemInfo: { fontSize: 14, color: "#1A2540" },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bigSpinner: {
    transform: [{ scaleX: 3 }, { scaleY: 3 }], // Scales the spinner up
  },
});
