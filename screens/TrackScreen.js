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
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import CalendarPop from "../components/calenderPopup";
import InvPopup from "../components/invPopup";
import ordersModel from "../model/ordersModel";
const { width, height } = Dimensions.get("window");

const TrackScreen = ({ navigation, route }) => {
  const today = new Date();
  const thisYear = today.getFullYear();
  const { userData } = route.params;
  const defaultStartDate = new Date(thisYear, 0, 1).toLocaleDateString("en-GB");
  const defaultEndDate = today.toLocaleDateString("en-GB");
  const [isEmpty, setIsEmpty] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(null);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [selectedtatus, setSelectedtatus] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const [invData, setInvData] = useState([]);
  const [popUploading, setPopUploading] = useState(false);
  const [pageloading, setPageloading] = useState(false);

  useEffect(() => {
    fatchOrderList = async () => {
      setPageloading(true);
      try {
        const response = await ordersModel.getOrdersList({
          CARDCODE: userData.U_CARD_CODE,
          STARTDATE: startDate,
          ENDDATE: endDate,
          DELIVERYSTTS: selectedtatus,
        });
        setOrderList(response);
      } catch (err) {
        console.log("====================================");
        console.log("error = " + err);
        console.log("====================================");
      } finally {
        setPageloading(false);
      }
    };
    fatchOrderList();
  }, [startDate, endDate, selectedtatus]);

  useEffect(() => {
    const fatchItemsList = async () => {
      if (!selectedItem) return; // If nothing is selected, skip
      try {
        setPopUploading(true); // <-- Start loading
        const response = await ordersModel.getItemsByDocNum({
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
        height: height * 0.11,
      }}
      onPress={() => handleItemPress(item.DOCNUM)}
    >
      <View
        style={{
          flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
          flex: 7.5,
        }}
      >
        <View style={{ padding: 10 }}>
          <Text style={styles.itemHader}>מס' חשבונית : </Text>
          <Text style={styles.itemInfo}>אופן שילוח : </Text>
          <Text style={styles.itemInfo}>סטטוס : </Text>
        </View>
        <View style={{ padding: 10 }}>
          <Text
            style={[
              styles.itemHader,
              { textAlign: I18nManager.isRTL ? "left" : "right" },
            ]}
          >
            {item.DOCNUM}
          </Text>
          <Text
            style={[
              styles.itemInfo,
              { textAlign: I18nManager.isRTL ? "left" : "right" },
            ]}
          >
            {item.U_REC_SHIPTYPE}
          </Text>
          <Text
            style={[
              styles.itemInfo,
              { textAlign: I18nManager.isRTL ? "left" : "right" },
            ]}
          >
            {item.DELIVERY_STATUS}
          </Text>
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
              flex: 1.5,
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
              flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
              width: width,
            }}
          >
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedtatus == "" && styles.selectedButton,
              ]}
              onPress={() => setSelectedtatus("")}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedtatus == "" && styles.selectedButtonText,
                ]}
              >
                הכל
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedtatus == "2" && styles.selectedButton,
              ]}
              onPress={() => setSelectedtatus("2")}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedtatus == "2" && styles.selectedButtonText,
                ]}
              >
                חבילה נמסרה
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedtatus == "1" && styles.selectedButton,
              ]}
              onPress={() => setSelectedtatus("1")}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedtatus == "1" && styles.selectedButtonText,
                ]}
              >
                חבילה בטיפול
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ItemsSeparator} />
          <View style={{ flex: 7.4 }}>
            {pageloading ? (
              /* Loader appears here if "loading" is true */
              <View style={styles.loaderContainer}>
                <ActivityIndicator
                  size="large"
                  color="#ED2027"
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
    width: width * 0.28,
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
    fontSize: 15,
    fontWeight: "bold",
    color: "#ED2027",
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
