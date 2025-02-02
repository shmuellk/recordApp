import React, { useState } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign"; // Using Ionicons for the left arrow
const { width, height } = Dimensions.get("window");

const SalesScreen = ({ navigation }) => {
  const [isEmpty, SetIsEmpty] = useState(false);
  const [quantities, setQuantities] = useState({});
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
  ];

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
      // אם מכניסים ערך לא תקין - נשארים עם הערך הישן
    }
  };

  const renderItem = ({ item }) => {
    const quantity = quantities[item.id] || 1;

    return (
      <View style={styles.cardContainer}>
        {/* אם יש "מתנה" או "מבצע" שרוצים להציג, אפשר להוסיף כאן תגית פינתית */}
        {/* לדוגמה */}
        <View style={styles.promotionBadge}>
          <Text style={styles.promotionBadgeText}>1 + 10{"\n"}מתנה</Text>
        </View>

        <Image
          style={styles.cardImage}
          source={{ uri: item.image }}
          resizeMode="contain"
        />
        <Text style={styles.cardTitle}>{item.SKU}</Text>
        <Text style={styles.cardSubTitle}>{item.name}</Text>
        <Text style={styles.cardSubTitle}>{item.carName}</Text>
        <Text style={styles.cardSubTitle}>{item.year}</Text>
        <Text style={styles.cardPrice}>{item.price}</Text>

        <View style={styles.quantityAndButtonContainer}>
          <View style={styles.orderQuantity}>
            <TouchableOpacity onPress={() => decrement(item.id)}>
              <Image
                source={require("../assets/icons/itemCard/Minus.png")}
                style={styles.quantityBtnIcon}
              />
            </TouchableOpacity>

            <TextInput
              style={styles.quantityInput}
              value={quantity.toString()}
              onChangeText={(text) => handleQuantityChange(text, item.id)}
              keyboardType="numeric"
              selectTextOnFocus={true}
              onBlur={() => {
                if (!quantities[item.id]) {
                  setQuantities((prevQuantities) => ({
                    ...prevQuantities,
                    [item.id]: 1,
                  }));
                }
              }}
            />

            <TouchableOpacity onPress={() => increment(item.id)}>
              <Image
                source={require("../assets/icons/itemCard/Plus.png")}
                style={styles.quantityBtnIcon}
              />
            </TouchableOpacity>
          </View>
          {/* כפתור הוסף לעגלה */}
          {item.amount > 0 ? (
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>הוסף לעגלה</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.outOfStockText}>אזל מהמלאי</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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

      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCartView}>
            <Icon name="staro" size={70} color="#1A2540" />
          </View>
          <View style={styles.massegeView}>
            <Text style={styles.mainHader}>אין מועדפים</Text>
            <Text style={styles.SubHader}>המועדפים שלך יופיעו כאן</Text>
          </View>
        </View>
      ) : (
        <View style={styles.listWrapper}>
          <FlatList
            data={Items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            // הגדרה לשני טורים
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            // ItemSeparatorComponent={() => (
            //   <View style={styles.ItemsSeparator} />
            // )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

export default SalesScreen;

// אפשר לשנות את ה־StyleSheets כדי להתאים למבנה רשת, כרטיסים, וכו'.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  listWrapper: {
    flex: 1,
    width: width,
    // אפשר להוסיף מרווח כראות עיניכם
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    height: 80, // גובה כותרת
    width: "100%",
  },
  rightButton: {
    position: "absolute",
    right: 20,
    top: 40, // למקם בתוך ה-Header
    zIndex: 1,
  },
  titleWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#1A2540",
  },
  ItemsSeparator: {
    height: 1.5,
    backgroundColor: "#EBEDF5",
    width: "90%",
    alignSelf: "center",
    marginVertical: 8,
  },
  emptyContainer: {
    flex: 1,
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
    elevation: 5,
    marginBottom: 20,
  },
  massegeView: {
    justifyContent: "center",
    alignItems: "center",
  },
  mainHader: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1A2540",
    marginBottom: 10,
  },
  SubHader: {
    fontSize: 20,
    color: "#7E7D83",
  },
  columnWrapper: {
    // מרווח אופקי בין הכרטיסים באותו טור
    justifyContent: "space-around",
  },

  /********** עיצוב הכרטיסים **********/
  cardContainer: {
    backgroundColor: "#fff",
    width: width * 0.45, // שני טורים, עם קצת מרווח
    borderRadius: 10,
    marginVertical: 8,
    paddingVertical: 10,
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
    color: "red",
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
    marginBottom: 10,
  },
  quantityBtnIcon: {
    justifyContent: "center", // Center align the content
    alignItems: "center",
  },
  quantityInput: {
    width: 35,
    height: 30,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "#fff",
    marginHorizontal: 5,
    fontWeight: "bold",
    color: "#000",
  },
  addButton: {
    backgroundColor: "#ED2027",
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
    color: "#FF0000",
    fontWeight: "bold",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },

  /******* תגית "1+10 מתנה" וכדומה *******/
  promotionBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "red",
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
});
