import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  I18nManager,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Easing,
  Animated,
} from "react-native";

import Button from "../components/Button";
import InfoButton from "../components/InfoButton";
import cartModel from "../model/cartModel";
import SuccessPopup from "../components/SuccessPopup";
import favoritsModel from "../model/favoritsModel";
import armorModel from "../model/armorModel";

const { width, height } = Dimensions.get("window");

const ItemCardScreen = ({ route, navigation }) => {
  const { item, Brand, userData, carInfo } = route.params || {}; // Default to an empty object if item is undefined
  const [star, setStar] = useState(false);
  const [armor, setArmor] = useState(false);
  const [inStock, setInStock] = useState(Brand[0].quantity > 0 ? true : false);
  const [infoByBrand, setInfoByBrand] = useState(Brand[0] || []);
  const [timestamp] = useState(Date.now());
  const [popupsQueue, setPopupsQueue] = useState([]);
  const [currentPopup, setCurrentPopup] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(
    Brand[0].catalog_number || ""
  );
  const [amountToBy, setAmountToBy] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false); // Loader state for search button

  const starAnim = useRef(new Animated.Value(0)).current;
  const armorAnim = useRef(new Animated.Value(0)).current;

  // בכל פעם שהסטייט של star משתנה (true/false), נפעיל אנימציית fade
  useEffect(() => {
    Animated.timing(armorAnim, {
      toValue: armor ? 1 : 0, // 1 = אדום, 0 = אפור
      duration: 400, // משך האנימציה במיליסקונד
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true, // שימוש ב-Native Driver לאנימציות
    }).start();
  }, [armor]);

  useEffect(() => {
    Animated.timing(starAnim, {
      toValue: star ? 1 : 0, // 1 = אדום, 0 = אפור
      duration: 400, // משך האנימציה במיליסקונד
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true, // שימוש ב-Native Driver לאנימציות
    }).start();
  }, [star]);

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

  const numericNetPrice =
    parseFloat(String(infoByBrand.net_price).replace(/[^\d.]/g, "")) || 0;
  const numericGrossPrice =
    parseFloat(String(infoByBrand.gross_price).replace(/[^\d.]/g, "")) || 0;

  // Make copies we can modify
  let finalNet = numericNetPrice;
  let finalGross = numericGrossPrice;

  // Decide what to show
  let showNet = true;
  let showGross = true;

  if (finalGross === 0 && finalNet !== 0) {
    // 1) if gross_price = 0, show only net_price
    showGross = false;
  } else if (finalNet === 0 && finalGross !== 0) {
    // 2) if net_price = 0, set net_price = gross_price / 2 and show both
    finalNet = finalGross / 2;
  } else if (finalNet === 0 && finalGross === 0) {
    // 3) if both are 0, you can choose to show neither
    showNet = false;
    showGross = false;
  }

  const addToCart = async () => {
    setSearchLoading(true);
    try {
      const response = await cartModel.addItemToCart({
        userName: userData.U_USER_NAME,
        cardCode: userData.U_CARD_CODE,
        item_code: infoByBrand.catalog_number,
        amountToBy: amountToBy,
      });
      showPopup("הפריט נוסף לעגלה!");
    } catch (e) {
      console.log("Add to cart error:", e);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleQuantityChange = (text) => {
    setAmountToBy(text);
  };

  const handleArmorToggle = async () => {
    setArmor(true); // כוכב אדום ישר

    try {
      const response = await armorModel.addItemToArmors({
        userName: userData.U_USER_NAME,
        cardCode: userData.U_CARD_CODE,
        item_code: infoByBrand.catalog_number,
        status: "ADD",
      });
      showPopup("הפריט נוסף למועדפים!");
    } catch (error) {
      console.log("Error adding item to armor:", error);
    }

    // החזרה לאפור אחרי 2 שניות
    setTimeout(() => {
      setArmor(false);
    }, 3000);
  };

  const handleStarToggle = async () => {
    setStar(true); // כוכב אדום ישר

    try {
      const response = await favoritsModel.addItemToFavorits({
        userName: userData.U_USER_NAME,
        cardCode: userData.U_CARD_CODE,
        item_code: infoByBrand.catalog_number,
        status: "ADD",
      });
      showPopup("הפריט נוסף למועדפים!");
    } catch (error) {
      console.log("Error adding item to favorits:", error);
    }

    // החזרה לאפור אחרי 2 שניות
    setTimeout(() => {
      setStar(false);
    }, 3000);
  };

  const increment = () => {
    setAmountToBy((prevQuantity) => prevQuantity + 1);
  };

  const decrement = () => {
    setAmountToBy((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleOnPressBrand = async (item) => {
    if (item.quantity > 0) {
      setInStock(true);
    } else {
      setInStock(false);
    }
    setSelectedBrand(item.catalog_number);
    setInfoByBrand(item);
    setAmountToBy(1);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        {
          backgroundColor:
            selectedBrand === item.catalog_number ? "#EBEDF5" : "white",
        }, // Change background color if selected
      ]}
      onPress={() => handleOnPressBrand(item)} // Set selected brand when pressed
    >
      <Image
        style={styles.brandImage}
        source={{
          uri: `http://app.record.a-zuzit.co.il:8085/media/${item.brand}.jpg?timestamp=${timestamp}`,
        }}
        onError={(error) =>
          console.log("Image Load Error in: ", error.nativeEvent.error)
        }
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SuccessPopup
        text={currentPopup?.text || ""}
        visible={!!currentPopup} // אם currentPopup קיים, נציג
        onDismiss={handlePopupDismiss}
        color={currentPopup?.color || "#28A745"}
      />
      <View style={styles.imageScrollerView}>
        <TouchableOpacity
          style={styles.rightButton}
          onPress={() => navigation.goBack()}
        >
          <Image source={require("../assets/Back.png")} />
        </TouchableOpacity>
        <Image
          style={styles.image}
          source={{
            uri: `http://app.record.a-zuzit.co.il:8085/media/${item.IMAGE}.jpg?timestamp=${timestamp}`,
          }}
          onError={(error) =>
            console.log("Image Load Error in: ", error.nativeEvent.error)
          }
        />
      </View>

      <View
        style={{
          height: 40,
          backgroundColor: "rgba(235, 237, 245, 0.4)",
          position: "absolute",
          zIndex: 99999,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          alignSelf: "center",
          top: height * 0.04,
        }}
      >
        {infoByBrand.teeth && (
          <Text style={{ padding: 5, fontWeight: "bold", fontSize: 18 }}>
            {infoByBrand.teeth}
          </Text>
        )}
        {infoByBrand.size && (
          <Text style={{ padding: 5, fontWeight: "bold", fontSize: 18 }}>
            {infoByBrand.size}
          </Text>
        )}
      </View>

      {/* Product Information with Star Icon on the left and Product Title on the right */}
      <View style={styles.ItemInfoVeiw}>
        {item ? (
          <View style={styles.itemDetails}>
            <View style={styles.productTitleContainer}>
              {/* Star Icon (on the far left) */}
              <TouchableOpacity
                onPress={handleStarToggle}
                style={{ position: "relative" }}
              >
                <View style={{ width: 26, height: 26 }}>
                  {/* כוכב אדום - יופיע כשהערך 1 */}
                  <Animated.Image
                    style={[
                      styles.starIcon,
                      {
                        position: "absolute",
                        opacity: starAnim, // 0 -> מוסתר, 1 -> גלוי
                      },
                    ]}
                    source={require("../assets/icons/itemCard/RedStar.png")}
                  />
                  {/* כוכב אפור - הפוך מהערך של starAnim (1-starAnim) */}
                  <Animated.Image
                    style={[
                      styles.starIcon,
                      {
                        position: "absolute",
                        opacity: starAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0],
                        }),
                      },
                    ]}
                    source={require("../assets/icons/itemCard/GreyStar.png")}
                  />
                </View>
              </TouchableOpacity>

              {/* Product Title (right-aligned) */}
              <Text style={styles.productTitle}>
                {item.CHILD_GROUP + " " + item.DESCRIPTION_NOTE}
              </Text>
            </View>

            {/* SKU and Brand Info */}
            <Text style={styles.skuText}>
              מק"ט: {infoByBrand.catalog_number}
            </Text>
            <Text style={styles.brandText}>מותג: {infoByBrand.brand}</Text>
            {/* Price Section */}
            <View
              style={{
                flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
                alignSelf: I18nManager.isRTL ? "flex-start" : "flex-end",
              }}
            >
              {/* Show Gross Price if showGross === true */}
              {showGross && (
                <Text style={styles.priceText}>
                  מחיר ברוטו:{" "}
                  <Text style={styles.priceValue}>
                    ₪ {finalGross.toFixed(2)}
                  </Text>
                </Text>
              )}

              {/* Show Net Price if showNet === true */}
              {showNet && (
                <Text style={styles.priceText}>
                  מחיר נטו:{" "}
                  <Text style={styles.priceValue}>₪ {finalNet.toFixed(2)}</Text>
                </Text>
              )}
            </View>
          </View>
        ) : (
          <Text>No item data available</Text>
        )}
      </View>

      <View style={styles.ItemBrandVeiw}>
        <View style={styles.amountView}>
          {inStock ? (
            <View style={styles.orderQuantity}>
              <TouchableOpacity onPress={decrement} style={styles.button}>
                <Image
                  style={styles.buttonText}
                  source={require("../assets/icons/itemCard/Minus.png")}
                />
              </TouchableOpacity>

              <TextInput
                style={styles.quantityInput}
                value={amountToBy.toString()}
                onChangeText={(text) => handleQuantityChange(text)}
                keyboardType="numeric"
                selectTextOnFocus={true}
              />

              <TouchableOpacity onPress={increment} style={styles.button}>
                <Image
                  style={styles.buttonText}
                  source={require("../assets/icons/itemCard/Plus.png")}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.armor}>
              <Text style={styles.inventoryText}>אזל מהמלאי</Text>
              <TouchableOpacity
                onPress={handleArmorToggle}
                style={{
                  flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
                  alignContent: "center",
                }}
              >
                <Text style={styles.armorText}>שריין פריט זה</Text>
                <Image
                  style={{ top: 3 }}
                  source={
                    armor
                      ? require("../assets/icons/itemCard/RedReserve.png")
                      : require("../assets/icons/itemCard/GreyReserve.png")
                  }
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.brandView}>
          <FlatList
            data={Brand}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true} // Enable horizontal scrolling
            inverted={I18nManager.isRTL ? true : false}
            showsHorizontalScrollIndicator={false} // Optional: Hide the scroll indicator
          />
        </View>
      </View>

      <View style={styles.verticalSeparator} />

      <View style={styles.buttonsView}>
        <View style={styles.PopUpView}>
          <InfoButton placeholder={"קניות אחרונות"} type={1} car={item} />
          <InfoButton placeholder={"רכבים"} type={2} car={item} />
          <InfoButton placeholder={"מק''ט חלופי"} type={3} car={item} />
        </View>

        <View style={styles.AddCartButtonView}>
          <Button
            title={"הוסף לעגלה"}
            onPress={addToCart}
            loading={searchLoading}
            enable={inStock}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  successPopupContainer: {
    position: "absolute",
    top: 80,
    width: "80%",
    alignSelf: "center",
    zIndex: 999999,
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  successPopupText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageScrollerView: {
    flex: 4,
    justifyContent: "flex-end", // Align image to the bottom
    alignItems: "center", // Center horizontally
    backgroundColor: "white",
  },

  ItemInfoVeiw: {
    flex: 2,

    padding: 10, // Add padding for spacing
  },
  ItemBrandVeiw: {
    flex: 1.7,
    flexDirection: "column",
    marginBottom: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center", // Vertically center the content
  },
  productTitleContainer: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row", // Align product title and star icon in a row
    justifyContent: "space-between", // Space the title and star icon at opposite ends
    alignItems: "center", // Vertically align items
    marginBottom: 5, // Space between title and other information
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3A5683",
    textAlign: I18nManager.isRTL ? "left" : "right", // RTL alignment for the title
    flex: 1, // Allow the title to take up the remaining space
  },
  starIcon: {
    marginRight: 10, // Place the star icon on the left side
  },
  skuText: {
    fontSize: 16,
    color: "#1A2540",
    marginBottom: 5,
    textAlign: I18nManager.isRTL ? "left" : "right", // RTL alignment
  },
  brandText: {
    fontSize: 16,
    color: "#7E7D83",
    textAlign: I18nManager.isRTL ? "left" : "right", // RTL alignment
  },
  verticalSeparator: {
    height: 1,
    width: width * 0.95,
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
  },
  buttonsView: { flex: 2.3 },
  AddCartButtonView: {
    top: width * 0.1,
    paddingHorizontal: width * 0.05,
  },
  priceText: {
    fontSize: 16,
    color: "#1A2540",
    textAlign: "right", // RTL alignment for price label
    fontWeight: "bold",
    marginRight: 20,
  },
  priceValue: {
    fontWeight: "bold",
    color: "#1A2540", // Stronger color for price value
    fontSize: 16,
  },
  image: {
    width: 300, // Adjust as per your requirement
    height: 300, // Adjust as per your requirement
    resizeMode: "contain", // Keep the aspect ratio
    top: 50,
  },
  brandView: { padding: 10, flex: 5, top: height * 0.01 },
  amountView: {
    flex: 5,
    paddingHorizontal: 10,
    top: height * 0.01,
  },
  orderQuantity: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
    width: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    // padding: 5,
  },
  button: {
    padding: 15,
  },
  buttonText: {},

  quantityText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  armor: {
    flex: 1,
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "space-between", // Spreads content to the edges
    alignItems: "center",
    top: -15,
    // alignItems: "center", // Vertically centers the content
    paddingHorizontal: 10,
  },
  inventoryText: {
    fontSize: 22,
    color: "#ED2027",
    fontWeight: "bold",
  },
  armorText: {
    fontSize: 18,
    color: "#7E7D83",
    right: 10,
  },
  itemContainer: {
    width: 100, // Constant width for each item
    marginRight: 10,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    borderWidth: 2, // Define the border width
    borderColor: "#ccc", // Define the border color
  },
  brandImage: {
    width: "80%",
    height: "80%",
    resizeMode: "stretch",
    borderRadius: 10,
  },
  PopUpView: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "space-between",
    bottom: height * 0.001,
    paddingHorizontal: 15,
  },
  rightButton: {
    position: "absolute",
    left: I18nManager.isRTL ? 20 : 0,
    right: I18nManager.isRTL ? 0 : 20,
    top: 55, // Adjusted to be within the header
    zIndex: 1,
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

export default ItemCardScreen;
