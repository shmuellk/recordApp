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
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import cartModel from "../model/cartModel"; // adjust the path
import armorModle from "../model/armorModel";
import SuccessPopup from "../components/SuccessPopup";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

// Base dimensions (adjust these to match your design)
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

// Scaling helper functions
const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const ArmorScreen = ({ navigation, route }) => {
  const [quantities, setQuantities] = useState([]);
  const [quantitieToBy, setQuantitieToBy] = useState([]);
  const [isEmpty, SetIsEmpty] = useState(false);
  const { userData } = route.params;
  const [armorsItems, setArmorsItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingItem, setRemovingItem] = useState({});
  const [addItemToCart, setAddItemToCart] = useState({});
  const [popupsQueue, setPopupsQueue] = useState([]);
  const [currentPopup, setCurrentPopup] = useState(null);
  const [timestamp] = useState(Date.now());
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!currentPopup && popupsQueue.length > 0) {
      // Take the first popup from the queue and show it
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

          // 2) Transform each item to the desired shape:
          const transformedData = data.map((item) => ({
            id: item.ID,
            name: item.CHILD_GROUP + " " + (item.DESCRIPTION_NOTE || ""),
            net_price: item.NET_PRICE,
            gross_price: item.GROSS_PRICE,
            image: item.IMAGE,
            SKU: item.ITEMCODE,
            quantity: item.QUANTITY,
            brand: item.BRAND,
            amount: item.AMOUNT,
            sku_code: item.SKU_CODE,
          }));

          setArmorsItems(transformedData);
          const updatedQuantities = transformedData.map((item) => ({
            id: item.id,
            amount: item.amount,
          }));
          setQuantities(updatedQuantities);

          const resetQuantities = transformedData.map((item) => ({
            id: item.id,
            amount: 1,
          }));
          setQuantitieToBy(resetQuantities);
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
    setQuantitieToBy((prevAmount) =>
      prevAmount.map((q) => {
        if (q.id === id) {
          const item = armorsItems.find((item) => item.id === id);
          const maxQuantity = item ? item.quantity : 1;

          if (q.amount + 1 > maxQuantity) {
            showPopup(`הגעת לכמות המקסימלית של ${maxQuantity} יחידות.`);
            return { ...q, amount: maxQuantity };
          }

          return { ...q, amount: q.amount + 1 };
        }
        return q;
      })
    );
  };

  const incrementAMOUNT = (id) => {
    setQuantities((prevAmount) =>
      prevAmount.map((q) => {
        if (q.id === id) {
          return { ...q, amount: q.amount + 1 };
        }
        return q;
      })
    );
  };

  const decrementAMOUNT = (id) => {
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

  const decrement = (id) => {
    setQuantitieToBy((prevAmount) =>
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
      // Call API to remove the item
      await armorModle.addItemToArmors({
        userName: userData.U_USER_NAME,
        cardCode: userData.U_CARD_CODE,
        item_code: itemSKU,
        status: "DEL",
      });

      showPopup("הפריט הוסר בהצלחה!");

      setArmorsItems((prevArmorsItems) => {
        const newArmorsItems = prevArmorsItems.filter(
          (armorItem) => armorItem.id !== itemId
        );
        if (newArmorsItems.length === 0) {
          SetIsEmpty(true);
        }
        return newArmorsItems;
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
      await cartModel.addItemToCart({
        userName: userData.U_USER_NAME,
        cardCode: userData.U_CARD_CODE,
        item_code: itemSKU,
        amountToBy: newQuantity,
        status: "ADD",
      });

      handleRemovFromArmors(itemId, itemSKU);

      showPopup("הפריט נוסף לעגלה!");

      setArmorsItems((prevArmorsItems) =>
        prevArmorsItems.filter((item) => item.id !== itemId)
      );

      setQuantitieToBy((prevQuantities) =>
        prevQuantities.map((q) => (q.id === itemId ? { ...q, amount: 1 } : q))
      );
    } catch (e) {
      console.log("Failed to update item:", e);
    } finally {
      setAddItemToCart((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleUpdateArmor = async (itemId, itemSKU, newQuantity) => {
    try {
      await armorModle.updateArmorsList({
        userName: userData.U_USER_NAME,
        cardCode: userData.U_CARD_CODE,
        item_code: itemSKU,
        amountToArmor: newQuantity,
      });
    } catch (e) {
      console.log("Failed to update item:", e);
    } finally {
      setArmorsItems((prevArmorItems) =>
        prevArmorItems.map((item) =>
          item.id === itemId ? { ...item, amount: newQuantity } : item
        )
      );
      showPopup("הפריט עודכן בהצלחה!");
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

      setQuantitieToBy((prevQuantities) =>
        prevQuantities.map((q) => {
          if (q.id === id) {
            const item = armorsItems.find((item) => item.id === id);
            const maxQuantity = item ? item.quantity : 1;

            // המרת הערך המספרי ובדיקת גבול המלאי
            let newQuantity =
              !numericValue || parseInt(numericValue, 10) === 0
                ? 1
                : parseInt(numericValue, 10);

            // הגבלת הכמות למקסימום הזמין
            if (newQuantity > maxQuantity) {
              showPopup(`הגעת לכמות המקסימלית של ${maxQuantity} יחידות.`);
              newQuantity = maxQuantity;
            }

            return { ...q, amount: newQuantity };
          }
          return q;
        })
      );
    };

    const handleAMOUNTChange = (text, id) => {
      // השארת ספרות בלבד
      const numericValue = text.replace(/[^0-9]/g, "");

      setQuantities((prevQuantities) =>
        prevQuantities.map((q) => {
          if (q.id === id) {
            let newQuantity =
              !numericValue || parseInt(numericValue, 10) === 0
                ? 1
                : parseInt(numericValue, 10);
            return { ...q, amount: newQuantity };
          }
          return q;
        })
      );
    };

    const foundQuantity = quantities.find((q) => q.id === item.id);
    const amount = foundQuantity ? foundQuantity.amount : item.amount;

    const foundquantitieToBy = quantitieToBy.find((q) => q.id === item.id);
    const amountToBy = foundquantitieToBy
      ? foundquantitieToBy.amount
      : item.amount;

    const handleRemoveItemClick = () => {
      handleRemovFromArmors(item.id, item.SKU);
    };

    const handleUpdateItemClick = () => {
      handleAddItemToCart(item.id, item.SKU, amountToBy);
    };
    const handleUpdateArmorClick = () => {
      handleUpdateArmor(item.id, item.SKU, amount);
    };

    return (
      <View style={Cardstyles.card}>
        <View style={Cardstyles.itemDataView}>
          <View style={Cardstyles.textData}>
            <Text style={Cardstyles.haderText}>{item.name}</Text>
            <View>
              <View
                style={{
                  flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
                }}
              >
                <Text style={Cardstyles.infoTitle}>מק"ט : </Text>
                <Text style={Cardstyles.infoText}>{item.sku_code}</Text>
              </View>
              <View
                style={{
                  flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
                }}
              >
                <Text style={Cardstyles.infoTitle}>מותג : </Text>
                <Text style={Cardstyles.infoText}>{item.brand}</Text>
              </View>
              <View
                style={{
                  flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
                }}
              >
                <Text style={Cardstyles.infoTitle}>מחיר : </Text>
                <Text style={Cardstyles.infoText}>₪ {finalNet.toFixed(2)}</Text>
              </View>
              <View
                style={{
                  flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
                }}
              >
                <Text style={Cardstyles.infoTitle}>במלאי : </Text>
                {item.quantity > 0 ? (
                  <Image
                    style={{
                      alignSelf: "center",
                      marginLeft: I18nManager.isRTL ? null : 20,
                      marginRight: I18nManager.isRTL ? 20 : null,
                    }}
                    source={require("../assets/icons/armorIcons/Green_v.png")}
                  />
                ) : (
                  <Image
                    style={{
                      alignSelf: "center",
                      marginLeft: I18nManager.isRTL ? null : 20,
                      marginRight: I18nManager.isRTL ? 20 : null,
                    }}
                    source={require("../assets/icons/armorIcons/Red_x.png")}
                  />
                )}
                {item.quantity > 0 && (
                  <>
                    <Text style={Cardstyles.infoTitle}>שוריין : </Text>
                    <Text style={Cardstyles.infoText}>{item.amount}</Text>
                  </>
                )}
              </View>
            </View>
          </View>
          <View style={Cardstyles.imageData}>
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(
                  `http://app.record.a-zuzit.co.il:8085/media/${item.image}.jpg?timestamp=${timestamp}`
                );
                setIsModalVisible(true);
              }}
            >
              <Image
                style={Cardstyles.image}
                source={{
                  uri: `http://app.record.a-zuzit.co.il:8085/media/${item.image}.jpg?timestamp=${timestamp}`,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={Cardstyles.amoutAndPriceView}>
          {item.quantity > 0 && (
            <View style={Cardstyles.orderQuantity}>
              <TouchableOpacity
                onPress={() => decrement(item.id)}
                style={Cardstyles.quantityBtnContainer}
              >
                <Text style={Cardstyles.quantityBtnIconMinus}>—</Text>
              </TouchableOpacity>

              <TextInput
                style={Cardstyles.quantityInput}
                value={amountToBy.toString()}
                onChangeText={(text) => handleQuantityChange(text, item.id)}
                keyboardType="numeric"
                selectTextOnFocus={true}
              />

              <TouchableOpacity
                onPress={() => increment(item.id)}
                style={Cardstyles.quantityBtnContainer}
              >
                <Text style={Cardstyles.quantityBtnIconPlus}>+</Text>
              </TouchableOpacity>
            </View>
          )}

          {item.quantity > 0 && (
            <View
              style={{
                paddingLeft: I18nManager.isRTL ? scale(10) : null,
                paddingRight: I18nManager.isRTL ? null : scale(10),
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#1A2540",
                  width: scale(100),
                  height: verticalScale(40),
                  borderRadius: scale(15),
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={handleUpdateItemClick}
                disabled={!!addItemToCart[item.id]}
              >
                {addItemToCart[item.id] ? (
                  <ActivityIndicator color="#d01117" />
                ) : (
                  <Text
                    style={{
                      color: "white",
                      fontSize: moderateScale(16),
                      fontWeight: "bold",
                    }}
                  >
                    הוסף לעגלה
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          {item.quantity <= 0 && (
            <View style={Cardstyles.orderQuantity}>
              <TouchableOpacity
                onPress={() => decrementAMOUNT(item.id)}
                style={Cardstyles.quantityBtnContainer}
              >
                <Text style={Cardstyles.quantityBtnIconMinus}>—</Text>
              </TouchableOpacity>

              <TextInput
                style={Cardstyles.quantityInput}
                value={amount.toString()}
                onChangeText={(text) => handleAMOUNTChange(text, item.id)}
                keyboardType="numeric"
                selectTextOnFocus={true}
              />

              <TouchableOpacity
                onPress={() => incrementAMOUNT(item.id)}
                style={Cardstyles.quantityBtnContainer}
              >
                <Text style={Cardstyles.quantityBtnIconPlus}>+</Text>
              </TouchableOpacity>
            </View>
          )}
          {item.quantity <= 0 && item.amount != amount && (
            <View style={Cardstyles.removeButtonContainer}>
              <TouchableOpacity
                style={[
                  Cardstyles.removeButton,
                  {
                    backgroundColor: "#45f248",
                    marginRight: I18nManager.isRTL ? 10 : null,
                    marginLeft: I18nManager.isRTL ? null : 10,
                  },
                ]}
                onPress={handleUpdateArmorClick}
                disabled={!!removingItem[item.id]}
              >
                {removingItem[item.id] ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={Cardstyles.removeButtonText}>עדכן</Text>
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
        visible={!!currentPopup}
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
                  bottom: scale(50),
                  flex: 9,
                }}
              >
                <View style={styles.emptyCartView}>
                  <Icon
                    name="book"
                    size={moderateScale(70)}
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
                    <ActivityIndicator size="large" color="#d01117" />
                  </View>
                </View>
              ) : (
                <FlatList
                  data={armorsItems}
                  renderItem={({ item }) => renderItem({ item })}
                  keyExtractor={(item) => item.id.toString()}
                  ItemSeparatorComponent={() => (
                    <View style={styles.ItemsSeparator} />
                  )}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: verticalScale(100) }}
                />
              )}
            </View>
          )}
        </>
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={modalStyles.modalBackground}>
            <TouchableOpacity
              style={modalStyles.closeArea}
              onPress={() => setIsModalVisible(false)}
            >
              <Icon name="close" size={30} color="white" />
            </TouchableOpacity>
            <View style={modalStyles.imageContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={modalStyles.fullImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </Modal>
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
    height: verticalScale(1.5),
    width: width * 0.9,
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
  },
  emptyCartView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EBEDF5",
    height: scale(150),
    width: scale(150),
    borderRadius: scale(15),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    elevation: 15,
  },
  massegeView: {
    justifyContent: "center",
    alignItems: "center",
  },
  mainHader: {
    marginTop: verticalScale(20),
    fontSize: moderateScale(30),
    fontWeight: "bold",
    color: "#1A2540",
    marginBottom: verticalScale(10),
  },
  SubHader: {
    fontSize: moderateScale(20),
    color: "#7E7D83",
  },
  rightButton: {
    position: "absolute",
    right: I18nManager.isRTL ? scale(20) : null,
    left: I18nManager.isRTL ? null : scale(20),
    top: verticalScale(35),
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
    fontSize: moderateScale(30),
    fontWeight: "bold",
    textAlign: "center",
    color: "#1A2540",
    bottom: verticalScale(15),
  },
  Data: {
    flex: 8.7,
  },
});

const Cardstyles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    width: width, // full screen width; adjust if needed
    // height: verticalScale(200),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
  },
  quantityBtnContainer: {
    flex: 1, // Each button takes up an equal share of the container
    justifyContent: "center",
    alignItems: "center",
  },
  quantityBtnIconMinus: {
    color: "#d01117",
    fontWeight: "bold",
    fontSize: 25,
    marginHorizontal: 5,
  },
  quantityBtnIconPlus: {
    color: "#d01117",
    fontWeight: "bold",
    fontSize: 25,
    marginHorizontal: 5,
  },
  itemDataView: {
    flex: 7.5,
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
  },
  amoutAndPriceView: {
    flex: 2.5,
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
  },
  textData: {
    flex: 7,
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
    top: verticalScale(5),
    paddingHorizontal: scale(10),
  },
  haderText: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  infoView: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    marginTop: verticalScale(5),
    marginBottom: verticalScale(5),
  },
  infoText: {
    fontSize: moderateScale(15),
    color: "#7E7D83",
  },
  infoTitle: {
    fontSize: moderateScale(16),
    color: "#1A2540",
    fontWeight: "bold",
  },
  leftText: {
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
    marginRight: scale(10),
  },
  imageData: {
    flex: 3,
    alignItems: "center",
    justifyContent: I18nManager.isRTL ? "flex-start" : "flex-end",
    bottom: verticalScale(10),
  },
  image: {
    width: scale(130),
    height: scale(130),
    left: I18nManager.isRTL ? null : 15,
    right: I18nManager.isRTL ? 15 : null,
    resizeMode: "contain",
  },
  orderQuantity: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    width: scale(100),
    height: verticalScale(40),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: scale(15),
  },
  button: {
    paddingVertical: verticalScale(8),
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  removeButtonContainer: {
    marginLeft: I18nManager.isRTL ? scale(10) : null,
    marginRight: I18nManager.isRTL ? null : scale(10),
    justifyContent: "center",
  },
  removeButton: {
    width: scale(100),
    height: verticalScale(40),
    backgroundColor: "#EBEDF5",
    borderRadius: scale(15),
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "black",
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  priceView: {
    position: "absolute",
    bottom: verticalScale(15),
    right: I18nManager.isRTL ? scale(10) : null,
    left: I18nManager.isRTL ? null : scale(10),
    borderRadius: scale(15),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    alignItems: "flex-start",
  },
  priceText: {
    fontSize: moderateScale(17),
    fontWeight: "bold",
    color: "#1A2540",
  },
  quantityInput: {
    width: scale(50),
    height: verticalScale(30),
    textAlign: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: scale(5),
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#000",
    backgroundColor: "#fff",
    marginHorizontal: scale(5),
  },
});

const modalStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeArea: {
    position: "absolute",
    top: 40,
    right: I18nManager.isRTL ? 20 : null,
    left: I18nManager.isRTL ? null : 20,
    padding: 10,
  },
  imageContainer: {
    width: "90%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
});
