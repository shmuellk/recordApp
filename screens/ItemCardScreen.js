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
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import Button from "../components/Button";
import InfoButton from "../components/InfoButton";
import cartModel from "../model/cartModel";
import SuccessPopup from "../components/SuccessPopup";
import favoritsModel from "../model/favoritsModel";
import armorModel from "../model/armorModel";

const { width, height } = Dimensions.get("window");
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

// Helper scaling functions
const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const ItemCardScreen = ({ route, navigation }) => {
  const { item, Brand, userData, carInfo } = route.params || {}; // Default to an empty object if item is undefined
  const [star, setStar] = useState(false);
  const [armor, setArmor] = useState(false);
  const [inStock, setInStock] = useState(Brand[0].quantity > 0 ? true : false);
  const [Stock, setStock] = useState(Brand[0].quantity);
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

  console.log("====================================");
  console.log("infoByBrand = " + JSON.stringify(infoByBrand));
  console.log("====================================");

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
        status: "ADD",
      });
      showPopup("הפריט נוסף לעגלה!");
    } catch (e) {
      console.log("Add to cart error:", e);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleQuantityChange = (text) => {
    if (!text || !text.length) {
      setAmountToBy(1);
    } else {
      setAmountToBy(parseInt(text, 10));
    }
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
      showPopup("הפריט נוסף לשריונים!");
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
      setStock(item.quantity);
      setInStock(true);
    } else {
      setStock(0);
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
            height: verticalScale(30),
            backgroundColor: "rgba(235, 237, 245, 0.4)",
            position: "absolute",
            zIndex: 99999,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            alignSelf: "center",
            top: verticalScale(30),
          }}
        >
          {infoByBrand.teeth && (
            <Text
              style={{ padding: 5, fontWeight: "bold", fontSize: scale(16) }}
            >
              {infoByBrand.teeth}
            </Text>
          )}
          {infoByBrand.size && (
            <Text
              style={{ padding: 5, fontWeight: "bold", fontSize: scale(16) }}
            >
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
                    ברוטו:{" "}
                    <Text style={styles.priceValue}>
                      ₪ {finalGross.toFixed(2)}
                    </Text>
                  </Text>
                )}

                {/* Show Net Price if showNet === true */}
                {showNet && (
                  <Text style={styles.priceText}>
                    נטו:{" "}
                    <Text style={styles.priceValue}>
                      ₪ {finalNet.toFixed(2)}
                    </Text>
                  </Text>
                )}
              </View>
              {userData.U_TYPE == "מנהל" && (
                <Text style={styles.brandText}>מלאי: {Stock}</Text>
              )}
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
                  <Text style={styles.quantityBtnIconMinus}>—</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.quantityInput}
                  value={amountToBy.toString()}
                  onChangeText={(text) => handleQuantityChange(text, item.id)}
                  keyboardType="numeric"
                  selectTextOnFocus={true}
                />

                <TouchableOpacity onPress={increment} style={styles.button}>
                  <Text style={styles.quantityBtnIconPlus}>+</Text>
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
              inverted={true}
              showsHorizontalScrollIndicator={false} // Optional: Hide the scroll indicator
            />
          </View>
        </View>

        <View style={styles.verticalSeparator} />

        <View style={styles.buttonsView}>
          <View style={styles.PopUpView}>
            <InfoButton
              placeholder={"קניות אחרונות"}
              type={1}
              car={item}
              catalog_number={infoByBrand.catalog_number}
            />
            <InfoButton
              placeholder={"רכבים"}
              type={2}
              car={item}
              catalog_number={infoByBrand.catalog_number}
            />
            <InfoButton
              placeholder={"מק''ט חלופי"}
              type={3}
              car={item}
              catalog_number={infoByBrand.catalog_number}
            />
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
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  quantityBtnIconPlus: {
    color: "#d01117",
    fontWeight: "bold",
    fontSize: 25,
    right: I18nManager.isRTL ? scale(10) : null,
    left: I18nManager.isRTL ? null : scale(10),
  },
  quantityBtnIconMinus: {
    color: "#d01117",
    fontWeight: "bold",
    left: I18nManager.isRTL ? scale(10) : null,
    right: I18nManager.isRTL ? null : scale(10),
    fontSize: 25,
  },

  successPopupContainer: {
    position: "absolute",
    top: verticalScale(80),
    width: "80%",
    alignSelf: "center",
    zIndex: 999999,
    backgroundColor: "#28A745",
    padding: scale(10),
    borderRadius: scale(8),
    alignItems: "center",
  },
  successPopupText: {
    color: "#fff",
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  imageScrollerView: {
    flex: 4,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "white",
  },
  infoOverlay: {
    height: verticalScale(40),
    backgroundColor: "rgba(235, 237, 245, 0.4)",
    position: "absolute",
    zIndex: 99999,
    borderRadius: scale(10),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    top: height * 0.04,
    paddingHorizontal: scale(5),
  },
  infoOverlayText: {
    padding: scale(5),
    fontWeight: "bold",
    fontSize: moderateScale(18),
  },
  ItemInfoVeiw: {
    flex: 2,
    padding: scale(10),
  },
  ItemBrandVeiw: {
    flex: 1.7,
    flexDirection: "column",
    marginBottom: verticalScale(10),
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  productTitleContainer: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(5),
  },
  productTitle: {
    fontSize: moderateScale(22),
    fontWeight: "bold",
    color: "#3A5683",
    textAlign: I18nManager.isRTL ? "left" : "right",
    flex: 1,
  },
  starIcon: {
    marginRight: scale(10),
  },
  skuText: {
    fontSize: moderateScale(16),
    color: "#1A2540",
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  brandText: {
    fontSize: moderateScale(16),
    color: "#7E7D83",
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  verticalSeparator: {
    height: verticalScale(1),
    width: width * 0.95,
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
  },
  buttonsView: {
    flex: 2.3,
  },
  AddCartButtonView: {
    top: scale(40),
    paddingHorizontal: scale(20),
  },
  priceText: {
    fontSize: moderateScale(16),
    color: "#1A2540",
    textAlign: "right",
    fontWeight: "bold",
    marginRight: I18nManager.isRTL ? scale(20) : null,
    marginLeft: I18nManager.isRTL ? null : scale(20),
  },
  priceValue: {
    fontWeight: "bold",
    color: "#1A2540",
    fontSize: moderateScale(16),
  },
  image: {
    width: scale(300),
    height: scale(300),
    resizeMode: "contain",
    top: verticalScale(50),
  },
  brandView: {
    padding: scale(10),
    flex: 5,
    top: verticalScale(10),
  },
  amountView: {
    flex: 5,
  },
  orderQuantity: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
    width: scale(125),
    height: scale(40),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: scale(15),
  },
  button: {
    // padding: scale(10),
  },
  armor: {
    flex: 1,
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    top: verticalScale(-15),
    paddingHorizontal: scale(10),
  },
  inventoryText: {
    fontSize: moderateScale(22),
    color: "#ED2027",
    fontWeight: "bold",
  },
  armorText: {
    fontSize: moderateScale(18),
    color: "#7E7D83",
    right: scale(10),
  },
  itemContainer: {
    width: scale(100),
    marginRight: I18nManager.isRTL ? scale(10) : null,
    marginLeft: I18nManager.isRTL ? null : scale(10),
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: scale(10),
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  brandImage: {
    width: "80%",
    height: "80%",
    resizeMode: "stretch",
    borderRadius: scale(10),
  },
  PopUpView: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "space-between",
    bottom: height * 0.001,
    paddingHorizontal: scale(15),
  },
  rightButton: {
    position: "absolute",
    top: verticalScale(55),
    left: I18nManager.isRTL ? scale(20) : null,
    right: I18nManager.isRTL ? null : scale(20),
    zIndex: 1,
    width: scale(20),
    height: scale(20),
    justifyContent: "center",
    alignItems: "center",
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
    // marginHorizontal: scale(5),
  },
});
export default ItemCardScreen;
