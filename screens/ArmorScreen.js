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
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import cartModel from "../model/cartModel"; // adjust the pathimport Icon from "react-native-vector-icons/AntDesign"; // Using Ionicons for the left arrow
import armorModle from "../model/armorModel";
import SuccessPopup from "../components/SuccessPopup";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Using Ionicons for the left arrow

const { width, height } = Dimensions.get("window");

const ArmorScreen = ({ navigation, route }) => {
  const [quantities, setQuantities] = useState([]);
  const [isEmpty, SetIsEmpty] = useState(false);
  const { userData } = route.params;
  const [armorsItems, setArmorsItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingItem, setRemovingItem] = useState({});
  const [addItemToCart, setAddItemToCart] = useState({});
  const [popupsQueue, setPopupsQueue] = useState([]);
  const [currentPopup, setCurrentPopup] = useState(null);
  const [timestamp] = useState(Date.now());

  useEffect(() => {
    if (!currentPopup && popupsQueue.length > 0) {
      // קח את הראשון בתור והצג אותו
      setCurrentPopup(popupsQueue[0]);
    }
  }, [popupsQueue, currentPopup]);

  const showPopup = (text, color = "#28A745") => {
    const popupId = Date.now();
    setPopupsQueue((prevQueue) => [...prevQueue, { id: popupId, text, color }]);
  };

  const handlePopupDismiss = () => {
    setPopupsQueue((prevQueue) => prevQueue.slice(1));
    setCurrentPopup(null);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          // 1) Fetch data from your model:
          const data = await armorModle.getArmorsList({
            userName: userData.U_USER_NAME,
            cardCode: userData.U_CARD_CODE,
          });

          if (!data || data.length === 0) {
            setArmorsItems([]);
            setQuantities([]);
            SetIsEmpty(true);
            return; // Skip further processing
          }

          // 2) Transform each item to match the shape you want:
          const transformedData = data.map((item) => ({
            id: item.ID,
            name: item.CHILD_GROUP + " " + (item.DESCRIPTION_NOTE || ""), // guard against empty
            net_price: item.NET_PRICE,
            gross_price: item.GROSS_PRICE,
            image: item.IMAGE,
            SKU: item.ITEMCODE,
            quantity: item.QUANTITY,
            brand: item.BRAND,
            amount: item.AMOUNT,
          }));

          setArmorsItems(transformedData);
          const updatedQuantities = transformedData.map((item) => ({
            id: item.id,
            amount: item.amount,
          }));
          setQuantities(updatedQuantities);
          SetIsEmpty(false);
        } catch (error) {
          console.error("Failed to load cart items:", error);
          SetIsEmpty(true);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [userData])
  );

  const increment = (id) => {
    setQuantities((prevAmount) =>
      prevAmount.map((q) => {
        if (q.id === id) {
          return { ...q, amount: q.amount + 1 };
        }
        return q;
      })
    );
  };
  const decrement = (id) => {
    setQuantities((prevAmount) =>
      prevAmount.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            amount: q.amount - 1 > 0 ? q.amount - 1 : 1,
          };
        }
        return q;
      })
    );
  };

  const handleRemovFromArmors = async (itemId, itemSKU) => {
    setRemovingItem((prev) => ({ ...prev, [itemId]: true }));
    try {
      // Call your API to remove the item from the backend:
      const response = await armorModle.addItemToArmors({
        userName: userData.U_USER_NAME,
        cardCode: userData.U_CARD_CODE,
        item_code: itemSKU,
        status: "DEL",
      });

      showPopup("הפריט הוסר בהצלחה!");

      setArmorsItems((prevarmorsItems) => {
        const newArmorssItems = prevarmorsItems.filter(
          (armorsItems) => armorsItems.id !== itemId
        );
        // If there are no items left, mark cart as empty
        if (newArmorssItems.length === 0) {
          SetIsEmpty(true);
        }
        return newArmorssItems;
      });

      setQuantities((prevQuantities) =>
        prevQuantities.filter((q) => q.id !== itemId)
      );
    } catch (e) {
      console.log("Failed to remove item:", e);
    } finally {
      setRemovingItem((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleAddItemToCart = async (itemId, itemSKU, newQuantity) => {
    setAddItemToCart((prev) => ({ ...prev, [itemId]: true }));
    try {
      // Call your API to remove the item from the backend:
      const response = await cartModel.addItemToCart({
        userName: userData.U_USER_NAME,
        cardCode: userData.U_CARD_CODE,
        item_code: itemSKU,
        amountToBy: newQuantity,
        status: "ADD",
      });

      showPopup("הפריט נוסף לעגלה!");

      setArmorsItems((prevarmorsItems) =>
        prevarmorsItems.map((item) =>
          item.id === itemId ? { ...item, amount: 1 } : item
        )
      );

      setQuantities((prevQuantities) =>
        prevQuantities.map((q) => (q.id === itemId ? { ...q, amount: 1 } : q))
      );
    } catch (e) {
      console.log("Failed to Update item:", e);
    } finally {
      setAddItemToCart((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const renderItem = ({ item }) => {
    const numericNetPrice =
      parseFloat(String(item.net_price).replace(/[^\d.]/g, "")) || 0;
    const numericGrossPrice =
      parseFloat(String(item.gross_price).replace(/[^\d.]/g, "")) || 0;

    let finalNet = numericNetPrice;
    if (finalNet === 0) {
      finalNet = numericGrossPrice / 2;
    }

    const handleQuantityChange = (text, id) => {
      // השארת ספרות בלבד
      const numericValue = text.replace(/[^0-9]/g, "");

      setQuantities((prevQuantities) =>
        prevQuantities.map((q) => {
          if (q.id === id) {
            // בדיקה אם הערך ריק או שווה ל-0
            const newQuantity =
              !numericValue || parseInt(numericValue, 10) === 0
                ? 1
                : parseInt(numericValue, 10);

            return {
              ...q,
              amount: newQuantity,
            };
          }
          return q;
        })
      );
    };

    const foundQuantity = quantities.find((q) => q.id === item.id);
    const amount = foundQuantity ? foundQuantity.amount : item.amount;

    const handleRemoveItemClick = () => {
      handleRemovFromArmors(item.id, item.SKU);
    };

    const handleUpdateItemClick = () => {
      handleAddItemToCart(item.id, item.SKU, amount);
    };

    return (
      <View style={Cardstyles.card}>
        <View style={Cardstyles.itemDataView}>
          <View style={Cardstyles.textData}>
            <Text style={Cardstyles.haderText}>{item.name}</Text>
            <View>
              <View style={{ flexDirection: "row" }}>
                <Text style={Cardstyles.infoTitle}>מק"ט : </Text>
                <Text style={Cardstyles.infoText}>{item.SKU}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={Cardstyles.infoTitle}>מותג : </Text>
                <Text style={Cardstyles.infoText}>{item.brand}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={Cardstyles.infoTitle}>מחיר : </Text>
                <Text style={Cardstyles.infoText}>₪ {finalNet.toFixed(2)}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={Cardstyles.infoTitle}>במלאי : </Text>
                {item.amount > 0 ? (
                  <Image
                    style={{
                      alignSelf: "center",
                    }}
                    source={require("../assets/icons/armorIcons/Green_v.png")}
                  />
                ) : (
                  <Image
                    style={{
                      alignSelf: "center",
                    }}
                    source={require("../assets/icons/armorIcons/Red_x.png")}
                  />
                )}
              </View>
            </View>
          </View>
          <View style={Cardstyles.imageData}>
            <Image
              style={Cardstyles.image}
              source={{
                uri: `http://app.record.a-zuzit.co.il:8085/media/${item.image}.jpg?timestamp=${timestamp}`,
              }}
            />
          </View>
        </View>

        <View style={Cardstyles.amoutAndPriceView}>
          <View style={Cardstyles.orderQuantity}>
            <TouchableOpacity
              onPress={() => decrement(item.id)}
              style={Cardstyles.button}
            >
              <Image source={require("../assets/icons/itemCard/Minus.png")} />
            </TouchableOpacity>

            <TextInput
              style={Cardstyles.quantityInput}
              value={amount.toString()}
              onChangeText={(text) => handleQuantityChange(text, item.id)}
              keyboardType="numeric"
              selectTextOnFocus={true}
            />

            <TouchableOpacity
              onPress={() => increment(item.id)}
              style={Cardstyles.button}
            >
              <Image source={require("../assets/icons/itemCard/Plus.png")} />
            </TouchableOpacity>
          </View>
          {item.amount > 0 && (
            <View
              style={{
                paddingLeft: 10,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#1A2540",
                  width: 100, // Same width as the remove button
                  height: 40, // Same height as the remove button
                  borderRadius: 15, // Same border radius as the remove button
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={handleUpdateItemClick}
                disabled={!!addItemToCart[item.id]} // הטעינה רק לפריט הזה
              >
                {addItemToCart[item.id] ? (
                  <ActivityIndicator color="red" />
                ) : (
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                  >
                    הוסף לעגלה
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          <View style={Cardstyles.removeButtonContainer}>
            <TouchableOpacity
              style={Cardstyles.removeButton}
              onPress={handleRemoveItemClick}
              disabled={!!removingItem[item.id]}
            >
              {removingItem[item.id] ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={Cardstyles.removeButtonText}>הסר</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  return (
    <>
      <SuccessPopup
        text={currentPopup?.text || ""}
        visible={!!currentPopup} // אם currentPopup קיים, נציג
        onDismiss={handlePopupDismiss}
        color={currentPopup?.color || "#28A745"}
      />

      <View style={styles.container}>
        <View style={styles.hader}>
          <TouchableOpacity
            style={styles.rightButton}
            onPress={() => navigation.goBack()}
          >
            <Image source={require("../assets/Back.png")} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.headerText}>שריונים</Text>
          </View>
        </View>
        <View style={styles.ItemsSeparator} />
        <>
          {isEmpty ? (
            <View style={styles.Data}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  bottom: 50,
                  flex: 9,
                }}
              >
                <View style={styles.emptyCartView}>
                  <Icon
                    name="book"
                    size={70}
                    color="#1A2540"
                    style={styles.serchItemIcon}
                  />
                </View>
                <View style={styles.massegeView}>
                  <Text style={styles.mainHader}>אין שריונים</Text>
                  <Text style={styles.SubHader}>השריונים שלך יופיעו כאן</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.Data}>
              {loading ? (
                <View
                  style={{
                    height: height * 0.78,
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <View style={{ transform: [{ scale: 2 }] }}>
                    <ActivityIndicator size="large" color="#ED2027" />
                  </View>
                </View>
              ) : (
                <FlatList
                  data={armorsItems}
                  renderItem={({ item }) => renderItem({ item })}
                  keyExtractor={(item) => item.id}
                  ItemSeparatorComponent={() => (
                    <View style={styles.ItemsSeparator} />
                  )}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          )}
        </>
      </View>
    </>
  );
};

export default ArmorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  ItemsSeparator: {
    height: 1.5,
    width: width * 0.9,
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
  },
  ItemsSeparatorFirst: {
    height: 1.5,
    width: width,
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
  },
  emptyCartView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EBEDF5", // 80 is the hex code for 50% transparency
    height: 150,
    width: 150,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    elevation: 15,
    alignItems: "center",
  },

  massegeView: {
    justifyContent: "center",
    alignItems: "center",
  },
  mainHader: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: "bold",
    color: "#1A2540",
    marginBottom: 10,
  },
  SubHader: {
    fontSize: 20,
    color: "#7E7D83",
  },

  rightButton: {
    position: "absolute",
    right: 20,
    top: 55, // Adjusted to be within the header
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
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1A2540",
    bottom: 15,
  },
  Data: {
    flex: 8.7,
  },
});
const Cardstyles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    width: width,
    height: 200,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemDataView: {
    flex: 7.5,
    flexDirection: "row",
  },
  amoutAndPriceView: {
    flex: 2.5,
    flexDirection: "row",
  },
  textData: {
    flex: 7,
    alignItems: "flex-start",
    top: 5,
    paddingHorizontal: 10,
  },
  haderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoView: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 15,
    color: "#7E7D83",
  },
  infoTitle: {
    fontSize: 16,
    color: "#1A2540",
    fontWeight: "bold",
  },
  leftText: {
    alignItems: "flex-start",
    marginRight: 10,
  },
  imageData: {
    flex: 3,
    alignItems: "center", // Centering the image
    justifyContent: "flex-start",
    bottom: 10,
  },
  image: {
    width: 130, // Set appropriate width
    height: 130, // Set appropriate height
    resizeMode: "contain", // Adjust image aspect ratio
  },
  orderQuantity: {
    flexDirection: "row", // Ensure all elements are in a row, adjust RTL manually
    alignItems: "center", // Vertically align the items
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
    // justifyContent: "space-between", // Equal spacing between items
    width: 100, // Increased width to accommodate buttons and input
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
  },

  button: {
    // paddingHorizontal: 3, // Adjust to reduce excessive padding
    paddingVertical: 8, // Match vertical padding for better button size
    justifyContent: "center", // Center align the content
    alignItems: "center",
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  removeButtonContainer: {
    marginLeft: 10, // Adds spacing between the remove button and quantity selector
    justifyContent: "center", //
  },
  removeButton: {
    width: 100,
    height: 40, // Same height as the orderQuantity container
    backgroundColor: "#EBEDF5",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  priceView: {
    position: "absolute",
    bottom: 15,
    right: 10,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignContent: "center",
    alignItems: "flex-start",
  },
  priceText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "black",
    color: "#1A2540",
  },
  quantityInput: {
    width: 50, // Adjust width to balance between buttons
    height: 30, // Reduce height for better fit within the container
    textAlign: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    backgroundColor: "#fff",
    marginHorizontal: 5, // Space between the input and buttons
  },
});
