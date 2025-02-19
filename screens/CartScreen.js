import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  I18nManager,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import cartModel from "../model/cartModel"; // adjust the path
import Icon from "react-native-vector-icons/MaterialIcons";
import Button from "../components/Button";
import SuccessPopup from "../components/SuccessPopup";

const { width, height } = Dimensions.get("window");
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

// Scale horizontally based on screen width
const scale = (size) => (width / guidelineBaseWidth) * size;
// Scale vertically based on screen height
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
// Optionally, use a moderate scale if you want less aggressive scaling
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const CartScreen = ({ navigation, route }) => {
  const [quantities, setQuantities] = useState({}); // Manage quantities for each item in the cart
  const [isEmpty, SetIsEmpty] = useState(false);
  const { userData } = route.params;
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingItem, setRemovingItem] = useState({});
  const [updatingItem, setUpdatingItem] = useState({});
  const [popupsQueue, setPopupsQueue] = useState([]);
  const [currentPopup, setCurrentPopup] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [timestamp] = useState(Date.now());

  useEffect(() => {
    if (!currentPopup && popupsQueue.length > 0) {
      // קח את הראשון בתור והצג אותו
      setCurrentPopup(popupsQueue[0]);
    }
  }, [popupsQueue, currentPopup]);

  // פונקציה שמציגה פופאפ חדש ומוסיפה אותו לתור
  const showPopup = (text, color = "#28A745") => {
    const popupId = Date.now();
    setPopupsQueue((prevQueue) => [...prevQueue, { id: popupId, text, color }]);
  };

  // כשהפופאפ הנוכחי מסיים, מסירים אותו מהתור ומאפסים, כדי לאפשר לפופאפ הבא לעלות
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
          const data = await cartModel.getCartList({
            userName: userData.U_USER_NAME,
            cardCode: userData.U_CARD_CODE,
          });

          if (!data || data.length === 0) {
            setCartItems([]);
            setQuantities([]);
            SetIsEmpty(true);
            return; // Skip further processing
          }

          // 2) Transform each item to match the shape you want:
          const transformedData = data.map((item) => ({
            id: item.ID,
            name: item.CHILD_GROUP + " " + (item.DESCRIPTION_NOTE || ""), // guard against empty
            carName: item.MODEL,
            net_price: item.NET_PRICE,
            gross_price: item.GROSS_PRICE,
            message: item.CAR_NOTE,
            brand: item.BRAND,
            image: item.IMAGE,
            SKU: item.ITEMCODE,
            quantity: item.QUANTITY,
          }));
          setCartItems(transformedData);
          const updatedQuantities = transformedData.map((item) => ({
            id: item.id,
            quantity: item.quantity,
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
    setQuantities((prevQuantities) =>
      prevQuantities.map((q) => {
        if (q.id === id) {
          return { ...q, quantity: q.quantity + 1 };
        }
        return q;
      })
    );
  };

  const decrement = (id) => {
    setQuantities((prevQuantities) =>
      prevQuantities.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            quantity: q.quantity - 1 > 0 ? q.quantity - 1 : 1,
          };
        }
        return q;
      })
    );
  };

  const calculateTotalPrice = () => {
    let total = 0;

    // Loop through each cart item:
    cartItems.forEach((item) => {
      // Find this item's quantity from state
      const foundQuantity = quantities.find((q) => q.id === item.id);
      const quantity = foundQuantity ? foundQuantity.quantity : item.quantity;

      // Parse net_price (remove any '₪' or commas), fallback to 0 if invalid
      let netPrice =
        parseFloat(String(item.net_price).replace(/[^\d.]/g, "")) || 0;

      // If net_price is 0 or missing, use gross_price / 2
      if (!netPrice || netPrice === 0) {
        const grossPrice =
          parseFloat(String(item.gross_price).replace(/[^\d.]/g, "")) || 0;
        netPrice = grossPrice / 2;
      }

      // Sum up: netPrice * quantity
      total += netPrice * quantity;
    });

    // Return formatted string
    return "₪ " + total.toFixed(2);
  };
  const hendelOnClick = () => {
    const totalPrice = calculateTotalPrice();
    navigation.navigate("PaymentScreen", { userData, totalPrice });
  };

  const handleRemovFromCart = async (itemId, itemSKU) => {
    setRemovingItem((prev) => ({ ...prev, [itemId]: true }));
    try {
      // Call your API to remove the item from the backend:
      const response = await cartModel.addItemToCart({
        userName: userData.U_USER_NAME,
        cardCode: userData.U_CARD_CODE,
        item_code: itemSKU,
        amountToBy: 0,
        status: "UPDATE",
      });

      showPopup("הפריט הוסר בהצלחה!");

      setCartItems((prevCartItems) => {
        const newCartItems = prevCartItems.filter(
          (cartItem) => cartItem.id !== itemId
        );
        // If there are no items left, mark cart as empty
        if (newCartItems.length === 0) {
          SetIsEmpty(true);
        }
        return newCartItems;
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

  const handleUpdateFromCart = async (itemId, itemSKU, newQuantity) => {
    setUpdatingItem((prev) => ({ ...prev, [itemId]: true }));
    try {
      // Call your API to remove the item from the backend:
      const response = await cartModel.addItemToCart({
        userName: userData.U_USER_NAME,
        cardCode: userData.U_CARD_CODE,
        item_code: itemSKU,
        amountToBy: newQuantity,
        status: "UPDATE",
      });

      showPopup("הפריט עודכן בהצלחה!");

      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (e) {
      console.log("Failed to Update item:", e);
    } finally {
      setUpdatingItem((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const renderItem = ({ item }) => {
    const netPriceNumber =
      parseFloat(String(item.net_price).replace(/[^\d.]/g, "")) || 0;
    const grossPriceNumber =
      parseFloat(String(item.gross_price).replace(/[^\d.]/g, "")) || 0;
    const displayPrice =
      netPriceNumber !== 0 ? netPriceNumber : grossPriceNumber / 2;

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
              quantity: newQuantity,
            };
          }
          return q;
        })
      );
    };
    const foundQuantity = quantities.find((q) => q.id === item.id);
    const quantity = foundQuantity ? foundQuantity.quantity : item.quantity;

    const handleRemoveItemClick = () => {
      handleRemovFromCart(item.id, item.SKU);
    };

    const handleUpdateItemClick = () => {
      handleUpdateFromCart(item.id, item.SKU, quantity);
    };

    return (
      <View style={Cardstyles.card}>
        <View style={Cardstyles.itemDataView}>
          <View style={Cardstyles.textData}>
            <Text style={Cardstyles.haderText}>{item.name}</Text>
            <View style={Cardstyles.infoView}>
              <View style={Cardstyles.leftText}>
                <Text style={Cardstyles.infoText}>{item.carName}</Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
                }}
              >
                <Text style={Cardstyles.infoTitle}>מק"ט : </Text>
                <Text style={Cardstyles.infoText}>{item.SKU}</Text>
              </View>
              <View
                style={{
                  flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
                }}
              >
                <Text style={Cardstyles.infoTitle}>מותג : </Text>
                <Text style={Cardstyles.infoText}>{item.brand}</Text>
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
            <View style={Cardstyles.priceView}>
              <View style={Cardstyles.priceView}>
                <Text style={Cardstyles.priceText}>X {quantity}</Text>
                {/* show '₪ ...' plus the decided price */}
                <Text style={Cardstyles.priceText}>
                  ₪ {displayPrice.toFixed(2)}
                </Text>
              </View>
            </View>
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
              value={quantity.toString()}
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
          {quantity == item.quantity ? (
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
          ) : (
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
                onPress={handleUpdateItemClick}
                disabled={!!updatingItem[item.id]} // הטעינה רק לפריט הזה
              >
                {updatingItem[item.id] ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={Cardstyles.removeButtonText}>עדכן</Text>
                )}
              </TouchableOpacity>
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
          )}
        </View>
      </View>
    );
  };
  console.log("====================================");
  console.log("isEmpty: " + isEmpty);
  console.log("====================================");

  return (
    <>
      <SuccessPopup
        text={currentPopup?.text || ""}
        visible={!!currentPopup} // אם currentPopup קיים, נציג
        onDismiss={handlePopupDismiss}
        color={currentPopup?.color || "#28A745"}
      />
      {isEmpty ? (
        <View style={styles.container2}>
          <View style={styles.emptyCartView}>
            <Icon
              name="add-shopping-cart"
              size={80}
              color="#1A2540"
              style={styles.serchItemIcon}
            />
          </View>
          <View style={styles.massegeView}>
            <Text style={styles.mainHader}>עגלה ריקה</Text>
            <Text style={styles.SubHader}>הפריטים שלך יופיעו כאן</Text>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <View
            style={{
              flex: 1.5,
              alignItems: "center",
              justifyContent: "flex-end",
              bottom: 30,
            }}
          >
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>עגלת קניות</Text>
          </View>

          <View style={styles.ItemsSeparator} />

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
            <>
              <View style={{ flex: 6.8 }}>
                <FlatList
                  data={cartItems}
                  renderItem={({ item }) => renderItem({ item })}
                  keyExtractor={(item) => item.id}
                  ItemSeparatorComponent={() => (
                    <View style={styles.ItemsSeparator} />
                  )}
                  showsVerticalScrollIndicator={false}
                />
              </View>

              <View style={styles.Separator} />
              <View style={{ flex: 1.7 }}>
                <View style={styles.totalPriceView}>
                  <Text style={styles.totalPriceLabel}>שווי ההזמנה :</Text>
                  <Text style={styles.totalPriceValue}>
                    {calculateTotalPrice()}
                  </Text>
                </View>
                <View
                  style={{
                    width: "90%",
                    alignContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    top: 20,
                  }}
                >
                  <Button
                    title="המשך לקופה"
                    onPress={hendelOnClick}
                    enable={!isEmpty}
                  />
                </View>
              </View>
            </>
          )}
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
      )}
    </>
  );
};

export default CartScreen;

const Cardstyles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    width: width * 0.95, // 95% of the screen width
    height: verticalScale(200), // scales with screen height
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
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
    marginRight: I18nManager.isRTL ? scale(10) : null,
    marginLeft: I18nManager.isRTL ? null : scale(10),
  },
  imageData: {
    flex: 3,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    bottom: verticalScale(10),
  },
  image: {
    width: scale(100),
    height: verticalScale(100),
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
    marginLeft: scale(10),

    justifyContent: "center",
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center",
  },
  removeButton: {
    width: scale(80),
    height: verticalScale(30),
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
    right: I18nManager.isRTL ? scale(10) : null,
    left: I18nManager.isRTL ? null : scale(10),
    borderRadius: scale(15),
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  container2: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: verticalScale(10),
    color: "#1A2540",
  },
  SubHader: {
    fontSize: moderateScale(20),
    color: "#7E7D83",
  },
  ItemsSeparator: {
    height: verticalScale(1.5),
    width: width * 0.9,
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
  },
  Separator: {
    height: verticalScale(2),
    width: width,
    alignSelf: "center",
    backgroundColor: "#00000029",
  },
  totalPriceView: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(25),
    top: verticalScale(5),
  },
  totalPriceLabel: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#1A2540",
  },
  totalPriceValue: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#1A2540",
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
