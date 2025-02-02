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
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import cartModel from "../model/cartModel"; // adjust the path
import Icon from "react-native-vector-icons/MaterialIcons";
import Button from "../components/Button";
import SuccessPopup from "../components/SuccessPopup";

const { width, height } = Dimensions.get("window");

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
  const hendelOnClick = () => {};

  const handleRemovFromCart = async (itemId, itemSKU) => {
    setRemovingItem((prev) => ({ ...prev, [itemId]: true }));
    try {
      // Call your API to remove the item from the backend:
      const response = await cartModel.addItemToCart({
        userName: userData.U_USER_NAME,
        cardCode: userData.U_CARD_CODE,
        item_code: itemSKU,
        amountToBy: 0,
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
              <View style={{ flexDirection: "row" }}>
                <Text style={Cardstyles.infoTitle}>מק"ט : </Text>
                <Text style={Cardstyles.infoText}>{item.SKU}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={Cardstyles.infoTitle}>מותג : </Text>
                <Text style={Cardstyles.infoText}>{item.brand}</Text>
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
                  { backgroundColor: "#45f248", marginRight: 10 },
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
              <View style={{ flex: 7.1 }}>
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
              <View style={{ flex: 1.4 }}>
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
                  <Button title="המשך לקופה" onPress={hendelOnClick} />
                </View>
              </View>
            </>
          )}
        </View>
      )}
    </>
  );
};

export default CartScreen;

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
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  removeButton: {
    width: 80,
    height: 30, // Same height as the orderQuantity container
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  container2: {
    flex: 1,
    backgroundColor: "white",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCartViewContainer: {
    alignItems: "center",
    justifyContent: "center",
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
  cartContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  ItemsSeparator: {
    height: 1.5,
    width: width * 0.9,
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
  },
  Separator: {
    height: 2,
    width: width,
    alignSelf: "center",
    backgroundColor: "#00000029",
  },
  totalPriceView: {
    flexDirection: "row", // Align items in RTL (Right-to-Left)
    justifyContent: "space-between", // Space between the label and the price
    alignItems: "center", // Vertically center the items
    paddingHorizontal: 25, // Padding on left and right
    top: 5,
  },
  totalPriceLabel: {
    fontSize: 18, // Larger font size for the price
    fontWeight: "bold", // Bold for the price
    color: "#1A2540", // Dark color for the price
  },
  totalPriceValue: {
    fontSize: 18, // Larger font size for the price
    fontWeight: "bold", // Bold for the price
    color: "#1A2540", // Dark color for the price
  },
});
