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
  const Items = [
    {
      id: "1",
      name: "חיישן קרנק",
      carName: "פרואייס סיטי ורסו",
      volume: "1.5HDI",
      year: "2006-2009",
      price: "₪ 16.99",
      massege: "משמש כאחורי",
      SKU: "Dx 36393464",
      brand: "optimal",
      amount: 2,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2R1lcqAv6bIbhM8Rz7EFaRvc7LGn7324TPQ&s",
    },
    {
      amount: 1500,
      id: "2",
      name: "חיישן קמשפט",
      carName: "פרואייס סיטי ורסו",
      volume: "1.5HDI",
      year: "2006-2009",
      massege: "משמש כקידמי",
      SKU: "Da 3367895",
      brand: "ironman",
      price: "₪ 15.99",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHuEm-A8VhRFQLApRaDRm9UqDddo_kB-Ykeg&s",
    },
    {
      amount: 300,
      id: "3",
      name: "מיסב ציריה",
      carName: "פרואייס סיטי ורסו",
      volume: "1.5HDI",
      price: "₪ 2500.99",
      year: "2006-2009",
      SKU: "cc 87956774",
      brand: "skf",
      massege: "4 יחידות ברכב",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL45GnDnLrfO_Ahwv_-grNGBLB0wnY6LVjSw&s",
    },
    {
      amount: 0,
      id: "4",
      name: "תרמוסטט",
      carName: "פרואייס סיטי ורסו",
      volume: "1.5HDI",
      year: "2006-2009",
      price: "₪ 88.99",
      SKU: "fd 000688994",
      brand: "MAD",
      massege: "2 יחידות ברכב",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpwcFdsQdS1VxdZ8YMKYhU1TQtzSqKexlDxg&s",
    },
    {
      amount: 300,
      id: "5",
      name: "מיסב ציריה",
      carName: "פרואייס סיטי ורסו",
      volume: "1.5HDI",
      price: "₪ 2500.99",
      year: "2006-2009",
      SKU: "cc 87956774",
      brand: "skf",
      massege: "4 יחידות ברכב",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL45GnDnLrfO_Ahwv_-grNGBLB0wnY6LVjSw&s",
    },
    {
      amount: 0,
      id: "6",
      name: "תרמוסטט",
      carName: "פרואייס סיטי ורסו",
      volume: "1.5HDI",
      year: "2006-2009",
      price: "₪ 88.99",
      SKU: "fd 000688994",
      brand: "MAD",
      massege: "2 יחידות ברכב",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpwcFdsQdS1VxdZ8YMKYhU1TQtzSqKexlDxg&s",
    },
  ];

  // useEffect(() => {
  //   if (!currentPopup && popupsQueue.length > 0) {
  //     // קח את הראשון בתור והצג אותו
  //     setCurrentPopup(popupsQueue[0]);
  //   }
  // }, [popupsQueue, currentPopup]);

  // const showPopup = (text, color = "#28A745") => {
  //   const popupId = Date.now();
  //   setPopupsQueue((prevQueue) => [...prevQueue, { id: popupId, text, color }]);
  // };

  // const handlePopupDismiss = () => {
  //   setPopupsQueue((prevQueue) => prevQueue.slice(1));
  //   setCurrentPopup(null);
  // };

  const increment = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 1) + 1,
    }));
  };

  const decrement = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: prevQuantities[id] > 1 ? prevQuantities[id] - 1 : 1,
    }));
  };

  const handleQuantityChange = (text, id) => {
    // אם רוצים לוודא רק מספר > 0
    const num = parseInt(text, 10);
    if (!isNaN(num) && num >= 1) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: num,
      }));
    } else {
      setQuantities(1);
    }
  };

  const renderItem = ({ item }) => {
    const quantity = quantities[item.id] || 1;

    return (
      <View style={Cardstyles.cardContainer}>
        {/* אם יש "מתנה" או "מבצע" שרוצים להציג, אפשר להוסיף כאן תגית פינתית */}
        {/* לדוגמה */}
        <View style={Cardstyles.promotionBadge}>
          <Text style={Cardstyles.promotionBadgeText}>1 + 10{"\n"}מתנה</Text>
        </View>

        <Image
          style={Cardstyles.cardImage}
          source={{ uri: item.image }}
          resizeMode="contain"
        />
        <Text style={Cardstyles.cardTitle}>{item.SKU}</Text>
        <Text style={Cardstyles.cardSubTitle}>{item.name}</Text>
        <Text style={Cardstyles.cardSubTitle}>{item.carName}</Text>
        <Text style={Cardstyles.cardSubTitle}>{item.year}</Text>
        <Text style={Cardstyles.cardPrice}>{item.price}</Text>

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
                value={quantity.toString()}
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
            <TouchableOpacity style={Cardstyles.addButton}>
              <Text style={Cardstyles.addButtonText}>הוסף לעגלה</Text>
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
      {/* <SuccessPopup
        text={currentPopup?.text || ""}
        visible={!!currentPopup} // אם currentPopup קיים, נציג
        onDismiss={handlePopupDismiss}
        color={currentPopup?.color || "#28A745"}
      /> */}

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
                    name="book"
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
                    <ActivityIndicator size="large" color="#ED2027" />
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
    left: 8,
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
    flexDirection: "row", // Ensures the children are in a row
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
