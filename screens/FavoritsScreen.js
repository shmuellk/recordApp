import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  I18nManager,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import cartModel from "../model/cartModel";
import favoritsModel from "../model/favoritsModel";
import SuccessPopup from "../components/SuccessPopup";
import Icon from "react-native-vector-icons/AntDesign";

const { width, height } = Dimensions.get("window");

// Base dimensions from your design (adjust these values as needed)
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

// Scaling helper functions
const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const FavoritsScreen = ({ navigation, route }) => {
  const [quantities, setQuantities] = useState([]);
  const [isEmpty, SetIsEmpty] = useState(false);
  const { userData } = route.params;
  const [favoritsItems, setFavoritsItems] = useState([]);
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

  // Show a popup and add it to the queue
  const showPopup = (text, color = "#28A745") => {
    const popupId = Date.now();
    setPopupsQueue((prevQueue) => [...prevQueue, { id: popupId, text, color }]);
  };

  // Remove the current popup from the queue
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
          const data = await favoritsModel.getFavoritsList({
            userName: userData.U_USER_NAME,
            cardCode: userData.U_CARD_CODE,
          });

          if (!data || data.length === 0) {
            setFavoritsItems([]);
            setQuantities([]);
            SetIsEmpty(true);
            return; // Skip further processing
          }

          // 2) Transform each item to match the shape you want:
          const transformedData = data.map((item) => ({
            id: item.ID,
            name: item.CHILD_GROUP + " " + (item.DESCRIPTION_NOTE || ""),
            net_price: item.NET_PRICE,
            gross_price: item.GROSS_PRICE,
            image: item.IMAGE,
            SKU: item.ITEMCODE,
            quantity: item.QUANTITY,
            brand: item.BRAND,
            amount: 1,
            sku_code: item.SKU_CODE,
          }));

          console.log("transformedData: " + JSON.stringify(transformedData));
          setFavoritsItems(transformedData);
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
          const item = favoritsItems.find((item) => item.id === id);
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

  const decrement = (id) => {
    setQuantities((prevAmount) =>
      prevAmount.map((q) => {
        if (q.id === id) {
          return { ...q, amount: q.amount - 1 > 0 ? q.amount - 1 : 1 };
        }
        return q;
      })
    );
  };

  const handleRemovFromFavorits = async (itemId, itemSKU) => {
    setRemovingItem((prev) => ({ ...prev, [itemId]: true }));
    try {
      // Remove the item from favorites via your API
      await favoritsModel.addItemToFavorits({
        userName: userData.U_USER_NAME,
        cardCode: userData.U_CARD_CODE,
        item_code: itemSKU,
        status: "DEL",
      });

      showPopup("הפריט הוסר בהצלחה!");

      setFavoritsItems((prevFavoritsItems) => {
        const newFavoritsItems = prevFavoritsItems.filter(
          (favoritsItem) => favoritsItem.id !== itemId
        );
        if (newFavoritsItems.length === 0) {
          SetIsEmpty(true);
        }
        return newFavoritsItems;
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

      showPopup("הפריט נוסף לעגלה!");

      setFavoritsItems((prevFavoritsItems) =>
        prevFavoritsItems.map((item) =>
          item.id === itemId ? { ...item, amount: 1 } : item
        )
      );

      setQuantities((prevQuantities) =>
        prevQuantities.map((q) => (q.id === itemId ? { ...q, amount: 1 } : q))
      );
    } catch (e) {
      console.log("Failed to update item:", e);
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
      // שמירת ערכים נומריים בלבד
      const numericValue = text.replace(/[^0-9]/g, "");

      setQuantities((prevQuantities) =>
        prevQuantities.map((q) => {
          if (q.id === id) {
            const item = favoritsItems.find((item) => item.id === id);
            const maxQuantity = item ? item.quantity : 1;

            // המרת טקסט למספר ובדיקת הגבול
            const newQuantity = parseInt(numericValue, 10) || 1;

            if (newQuantity > maxQuantity) {
              showPopup(`הגעת לכמות המקסימלית של ${maxQuantity} יחידות.`);
              return { ...q, amount: maxQuantity };
            }

            return { ...q, amount: newQuantity };
          }
          return q;
        })
      );
    };

    const foundQuantity = quantities.find((q) => q.id === item.id);
    const amount = foundQuantity ? foundQuantity.amount : item.amount;

    const handleRemoveItemClick = () => {
      handleRemovFromFavorits(item.id, item.SKU);
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
                <Text style={Cardstyles.infoTitle}>מק"ט : </Text>
                <Text style={Cardstyles.infoText}>{item.sku_code}</Text>
              </View>
              <View
                style={{
                  flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
                }}
              >
                <Text style={Cardstyles.infoTitle}>מחיר : </Text>
                <Text style={Cardstyles.infoText}>₪ {finalNet.toFixed(2)}</Text>
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
          <View style={Cardstyles.orderQuantity}>
            <TouchableOpacity
              onPress={() => decrement(item.id)}
              style={Cardstyles.quantityBtnContainer}
            >
              <Text style={Cardstyles.quantityBtnIconMinus}>—</Text>
            </TouchableOpacity>
            <View style={Cardstyles.quantityInputContainer}>
              <TextInput
                style={Cardstyles.quantityInput}
                value={amount.toString()}
                onChangeText={(text) => handleQuantityChange(text, item.id)}
                keyboardType="numeric"
                selectTextOnFocus={true}
              />
            </View>

            <TouchableOpacity
              onPress={() => increment(item.id)}
              style={Cardstyles.quantityBtnContainer}
            >
              <Text style={Cardstyles.quantityBtnIconPlus}>+</Text>
            </TouchableOpacity>
          </View>
          {item.quantity > 0 && (
            <View
              style={{
                paddingLeft: I18nManager.isRTL ? scale(10) : null,
                paddingRight: I18nManager.isRTL ? null : scale(10),
                // justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#1A2540",
                  width: scale(100), // Increase the overall width if needed
                  height: 40,
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
            <Text style={styles.headerText}>מועדפים</Text>
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
                  bottom: verticalScale(50),
                  flex: 9,
                }}
              >
                <View style={styles.emptyCartView}>
                  <Icon
                    name="staro"
                    size={moderateScale(70)}
                    color="#1A2540"
                    style={styles.serchItemIcon}
                  />
                </View>
                <View style={styles.massegeView}>
                  <Text style={styles.mainHader}>אין מועדפים</Text>
                  <Text style={styles.SubHader}>המועדפים שלך יופיעו כאן</Text>
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
                  data={favoritsItems}
                  renderItem={({ item }) => renderItem({ item })}
                  keyExtractor={(item) => item.id.toString()}
                  ItemSeparatorComponent={() => (
                    <View style={styles.ItemsSeparator} />
                  )}
                  showsVerticalScrollIndicator={false}
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

export default FavoritsScreen;

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
    flexDirection: "row",
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
    height: height * 0.12,
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
    width: width,
    minHeight: verticalScale(160),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
  },
  quantityInputContainer: {
    flex: 1, // The input also takes an equal share
    justifyContent: "center",
    alignItems: "center",
  },
  quantityBtnContainer: {
    flex: 1, // Each button takes up an equal share of the container
    justifyContent: "center",
    alignItems: "center",
  },
  quantityBtnIconPlus: {
    color: "#d01117",
    fontWeight: "bold",
    fontSize: 25,
  },
  quantityBtnIconMinus: {
    color: "#d01117",
    fontWeight: "bold",
    fontSize: 25,
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
    alignItems: "flex-start",
    marginRight: I18nManager.isRTL ? scale(10) : null,
    marginLeft: I18nManager.isRTL ? null : scale(10),
  },
  imageData: {
    flex: 3,
    alignItems: "center",
    justifyContent: I18nManager.isRTL ? "flex-start" : "flex-end",
    bottom: verticalScale(10),
    paddingHorizontal: scale(20),
  },
  image: {
    width: scale(130),
    height: scale(130),
    resizeMode: "contain",
  },
  orderQuantity: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse", // Ensures the children are in a row
    width: scale(100), // Increase the overall width if needed
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    marginBottom: 10,
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
    // justifyContent: "center",
  },
  removeButton: {
    width: scale(100), // Increase the overall width if needed
    height: 40,
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
