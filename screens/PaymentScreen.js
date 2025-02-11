import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  I18nManager,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import cartModel from "../model/cartModel"; // adjust the pathimport Icon from "react-native-vector-icons/AntDesign"; // Using Ionicons for the left arrow
import armorModle from "../model/armorModel";
import SuccessPopup from "../components/SuccessPopup";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Using Ionicons for the left arrow
import Filter from "../components/Filter2";
import Button from "../components/Button";

const { width, height } = Dimensions.get("window");

const PaymentScreen = ({ navigation, route }) => {
  const { userData, totalPrice } = route.params;
  const [currentPopup, setCurrentPopup] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("אמיר הובלות");
  const [remarks, setRemarks] = useState("");
  const [isEmpty, SetIsEmpty] = useState(false);

  const numericValue = parseFloat(totalPrice.replace(/[^\d.]/g, ""));
  const maam = numericValue * 0.18;
  const formattedMaam = `₪ ${maam.toFixed(2)}`;
  const totalWithMaam = numericValue + maam;
  const formattedTotalWithMaam = `₪ ${totalWithMaam.toFixed(2)}`;

  const hendelOnClick = () => {};
  const handlePopupDismiss = () => {
    setPopupsQueue((prevQueue) => prevQueue.slice(1));
    setCurrentPopup(null);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <>
      <SuccessPopup
        text={currentPopup?.text || ""}
        visible={!!currentPopup} // אם currentPopup קיים, נציג
        onDismiss={handlePopupDismiss}
        color={currentPopup?.color || "#28A745"}
      />
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.hader}>
              <TouchableOpacity
                style={styles.rightButton}
                onPress={() => navigation.goBack()}
              >
                <Image source={require("../assets/Back.png")} />
              </TouchableOpacity>
              <View style={styles.titleWrapper}>
                <Text style={styles.headerText}>קופה</Text>
              </View>
            </View>
            <View style={styles.ItemsSeparator} />
            <View style={styles.priceView}>
              <Text style={styles.priceHeader}>סיכום הזמנה</Text>
              <View style={styles.priceTextView}>
                <View style={styles.priceTextLine}>
                  <Text style={styles.priceText}>שווי ההזמנה :</Text>
                  <Text style={styles.priceText}> {totalPrice}</Text>
                </View>
                <View style={styles.priceTextLine}>
                  <Text style={styles.priceText}>מע"מ 18%:</Text>
                  <Text style={styles.priceText}>{formattedMaam}</Text>
                </View>
                <View
                  style={{
                    height: 1.5,
                    width: "100%",
                    alignSelf: "center",
                    backgroundColor: "#EBEDF5",
                  }}
                />
                <View style={styles.priceTextLine}>
                  <Text style={[styles.priceText, { fontWeight: "bold" }]}>
                    סה"כ לתשלום:
                  </Text>
                  <Text style={[styles.priceText, { fontWeight: "bold" }]}>
                    {formattedTotalWithMaam}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.order}>
              <View style={[styles.userDataView, { marginTop: 15 }]}>
                <Text style={styles.userDataHeader}>שם המזמין</Text>
                <TextInput
                  placeholder="שם המזמין"
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.userDataView}>
                <Text style={styles.userDataHeader}>טלפון</Text>
                <TextInput
                  placeholder="טלפון"
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.userDataView}>
                <Text style={styles.userDataHeader}>אופן השילוח</Text>
                <Filter
                  placeholder="יצרן"
                  currentValue={"אמיר הובלות"}
                  data={["אמיר הובלות", "שמשון הובלות", "נמזי"]} // Pass dynamic data here
                  enable={true}
                  // loading={loadingFilters.MANUFACTURER} // Pass loading state
                  onSelectItem={(value) => {
                    enableFilter("MODEL");
                    saveSelect("MANUFACTURER", value);
                    saveSelect("MODEL", "");
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between", // Added to create space between the texts
                  width: "90%", // Ensure the view has enough width to create the space
                  alignSelf: "center", // Centering the container for better alignment
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: "red", fontWeight: "bold" }}>
                  זמן יציאת משלוח משוער:
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "red" }}>20/08/2024</Text>
                  <Text style={{ color: "red" }}> | </Text>
                  <Text style={{ color: "red" }}>11:30</Text>
                </View>
              </View>
              <View style={styles.userDataView}>
                <Text style={styles.userDataHeader}>הערות</Text>
                <TextInput
                  placeholder="הערות"
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              </View>
              <View style={{ paddingHorizontal: 15 }}>
                <Text style={{ fontSize: 12 }}>
                  * ייתבנו שינויים בזמני יציאת המשלוח אשר לא בהכרח תלויים בנו.
                  אנו ניצור איתכם קשר במידה וישנם שינויים. אם ברצונכם לשנות את
                  זמני המשלוח באופן ידני ציינו זאת בשדה "הערות"
                </Text>
              </View>
              <View style={{ padding: 15 }}>
                <Button
                  title="בצע הזמנה"
                  onPress={hendelOnClick}
                  enable={!isEmpty}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  ItemsSeparator: {
    height: 1.5,
    width: width * 0.9,
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
  },

  priceView: {
    flex: 2.5,
  },
  priceHeader: {
    fontSize: height * 0.028,
    fontWeight: "bold",
    color: "#1A2540",
    padding: height * 0.02,
  },
  priceTextView: {
    width: width * 0.9,
    borderRadius: 15,
    alignSelf: "center",
    borderWidth: 2, // Set the border width
    borderColor: "#EBEDF5", // Set the border color to black
    padding: height * 0.013,
    marginBottom: 10,
  },
  priceTextLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: height * 0.007,
  },
  priceText: {
    fontSize: height * 0.022,
    color: "#1A2540",
  },
  order: {
    flex: 6.1,
    backgroundColor: "#EBEDF5",
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  userDataView: {
    marginBottom: 5,
  },
  userDataHeader: {
    fontSize: height * 0.02,
    color: "#1A2540",
    marginLeft: width * 0.1,
    marginBottom: 5,
  },
  input: {
    borderRadius: 15,
    padding: height * 0.01,
    textAlign: "right",
    width: width * 0.85,
    alignSelf: "center",
    backgroundColor: "white",
  },
  rightButton: {
    position: "absolute",
    right: 20,
    bottom: height * 0.01,
    zIndex: 1,
  },
  hader: {
    flex: 1.3,
    flexDirection: "row-reverse",
    alignContent: "center",
    justifyContent: "center",
  },
  titleWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    height: height * 0.13,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1A2540",
    bottom: height * 0.01,
  },
});
