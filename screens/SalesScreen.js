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
import salesModel from "../model/salesModel";
import SuccessPopup from "../components/SuccessPopup";
import Icon from "react-native-vector-icons/Fontisto"; // Using Ionicons for the left arrow
import carModel from "../model/carsModel";
import itemCardModel from "../model/itemCardModel";

const { width, height } = Dimensions.get("window");
// Base dimensions from your design (adjust these values as needed)
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

// Scaling helper functions
const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const ArmorScreen = ({ navigation, route }) => {
  const [quantities, setQuantities] = useState([]);
  const [isEmpty, SetIsEmpty] = useState(false);
  const [Items, setItems] = useState([]);
  const { userData } = route.params;
  const [loading, setLoading] = useState(false);
  const [addItemToCart, setAddItemToCart] = useState({});
  const [popupsQueue, setPopupsQueue] = useState([]);
  const [currentPopup, setCurrentPopup] = useState(null);
  const [timestamp] = useState(Date.now());

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
          const data = await salesModel.getAllSalesProdact();

          if (!data || data.length === 0) {
            setItems([]);
            setQuantities([]);
            SetIsEmpty(true);
            return; // Skip further processing
          }

          // 2) Transform each item to match the shape you want:
          const transformedData = data.map((item) => {
            // Split the name field by comma
            const nameParts = item.NAME ? item.NAME.split(",") : ["", "", ""];

            return {
              id: item.ID,
              SKU: item.CODE,
              itemName: nameParts[0]?.trim() || "", // First part - Item Name
              carName: nameParts[1]?.trim() || "", // Second part - Car Name
              years: nameParts[2]?.trim() || "", // Third part - Years
              net_price: item.U_XIS_NetPrice,
              image: item.U_BSYIMAGE4,
              sale_quantity: item.U_QUANTITY,
              amount: 1,
            };
          });

          console.log("transformedData: " + JSON.stringify(transformedData));
          setItems(transformedData);
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
          return { ...q, amount: q.amount - 1 > 0 ? q.amount - 1 : 1 };
        }
        return q;
      })
    );
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

      setItems((prevFavoritsItems) =>
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

  const handleSelect = async (data) => {
    try {
      const product = await carModel.getProdactsById({
        CATALOG_NUMBER: data,
      });

      console.log("====================================");
      console.log("product = " + JSON.stringify(product));
      console.log("====================================");

      try {
        const Brand = await itemCardModel.getItemBrand({
          CATALOG_NUMBER: product[0].CATALOG_NUMBER,
          CHILD_GROUP: product[0].CHILD_GROUP,
          DESCRIPTION_NOTE: product[0].DESCRIPTION_NOTE,
        });

        console.log("====================================");
        console.log("Brand = " + JSON.stringify(Brand));
        console.log("====================================");
        navigation.navigate("ItemCardScreen", {
          item: product[0],
          Brand,
        });
      } catch (error) {
        console.log("====================================");
        console.log("Error: " + error);
        console.log("====================================");
      }
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
    }
  };

  const renderItem = ({ item }) => {
    const handleQuantityChange = (text, id) => {
      // Keep only numbers
      const numericValue = text.replace(/[^0-9]/g, "");

      setQuantities((prevQuantities) =>
        prevQuantities.map((q) => {
          if (q.id === id) {
            const newQuantity =
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

    const handleUpdateItemClick = () => {
      handleAddItemToCart(item.id, item.SKU, amount);
    };

    return (
      <View style={Cardstyles.cardContainer}>
        {item.sale_quantity && (
          <View style={Cardstyles.promotionBadge}>
            <Text style={Cardstyles.promotionBadgeText}>
              1 + {item.sale_quantity}
              {"\n"}מתנה
            </Text>
          </View>
        )}
        <TouchableOpacity onPress={() => handleSelect(item.SKU)}>
          <Image
            style={Cardstyles.cardImage}
            source={{
              uri: `http://app.record.a-zuzit.co.il:8085/media/${item.image}.jpg?timestamp=${timestamp}`,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={Cardstyles.cardTitle}>{item.SKU}</Text>
        <Text style={Cardstyles.cardSubTitle}>{item.itemName}</Text>
        <Text style={Cardstyles.cardSubTitle}>{item.carName}</Text>
        <Text style={Cardstyles.cardSubTitle}>{item.years}</Text>
        <Text style={Cardstyles.cardPrice}>{item.net_price}</Text>

        <View style={Cardstyles.quantityAndButtonContainer}>
          <View style={Cardstyles.orderQuantity}>
            <TouchableOpacity
              style={Cardstyles.quantityBtnContainer}
              onPress={() => decrement(item.id)}
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
              style={Cardstyles.quantityBtnContainer}
              onPress={() => increment(item.id)}
            >
              <Text style={Cardstyles.quantityBtnIconPlus}>+</Text>
            </TouchableOpacity>
          </View>
          {/* כפתור הוסף לעגלה */}
          {item.amount > 0 ? (
            <TouchableOpacity
              style={Cardstyles.addButton}
              onPress={handleUpdateItemClick}
              disabled={!!addItemToCart[item.id]}
            >
              {addItemToCart[item.id] ? (
                <ActivityIndicator color="d01117" />
              ) : (
                <Text style={Cardstyles.addButtonText}>הוסף לעגלה</Text>
              )}
            </TouchableOpacity>
          ) : (
            <Text style={Cardstyles.outOfStockText}>אזל מהמלאי</Text>
          )}
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
          <View style={styles.titleWrapper}>
            <Text style={styles.headerText}>מבצעים</Text>
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
                    name="shopping-sale"
                    size={70}
                    color="#1A2540"
                    style={styles.serchItemIcon}
                  />
                </View>
                <View style={styles.massegeView}>
                  <Text style={styles.mainHader}>אין מבצעים</Text>
                  <Text style={styles.SubHader}>
                    המבצעים שלנו יופים כאן בקרוב
                  </Text>
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
                  data={Items}
                  renderItem={({ item }) => renderItem({ item })}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  columnWrapperStyle={styles.columnWrapper}
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
  columnWrapper: {
    // מרווח אופקי בין הכרטיסים באותו טור
    justifyContent: "space-around",
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
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
  cardContainer: {
    backgroundColor: "#fff",
    width: width * 0.45, // שני טורים, עם קצת מרווח
    borderRadius: 10,
    marginVertical: 3,
    paddingVertical: 10,
    marginHorizontal: 3,
    alignItems: "center",

    // הוספת מסגרת
    borderWidth: 1,
    borderColor: "#ccc",

    // צל
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  promotionBadge: {
    position: "absolute",
    top: 8,
    left: I18nManager.isRTL ? 8 : null,
    right: I18nManager.isRTL ? null : 8,
    backgroundColor: "#d01117",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    zIndex: 2,
  },
  promotionBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardImage: {
    width: 100,
    height: 100,
    marginVertical: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A2540",
  },
  cardSubTitle: {
    fontSize: 14,
    color: "#7E7D83",
  },
  cardPrice: {
    fontSize: 16,
    color: "#d01117",
    marginVertical: 5,
    fontWeight: "bold",
  },
  quantityAndButtonContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
    marginTop: 10,
  },
  orderQuantity: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse", // Ensures the children are in a row
    width: 120, // Increase the overall width if needed
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    marginBottom: 10,
  },
  quantityBtnContainer: {
    flex: 1, // Each button takes up an equal share of the container
    justifyContent: "center",
    alignItems: "center",
  },
  quantityInputContainer: {
    flex: 1, // The input also takes an equal share
    justifyContent: "center",
    alignItems: "center",
  },

  quantityInput: {
    width: "100%", // Fills its container
    height: "100%",
    textAlign: "center",
    fontWeight: "bold",
    color: "#000",
    fontSize: 16,
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

  addButton: {
    backgroundColor: "#d01117",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    width: width * 0.4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  outOfStockText: {
    color: "#d01117",
    fontWeight: "bold",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});
