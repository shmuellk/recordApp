import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Button from "../components/Button";
const { width, height } = Dimensions.get("window");

const CartScreen = ({ navigation }) => {
  const [quantities, setQuantities] = useState({});
  const [isEmpty, SetIsEmpty] = useState(false);

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
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2R1lcqAv6bIbhM8Rz7EFaRvc7LGn7324TPQ&s",
    },
    {
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

  const calculateTotalPrice = () => {
    return (
      "₪ " +
      Items.reduce((total, item) => {
        const quantity = quantities[item.id] || 1;
        const price = parseFloat(item.price.replace("₪", "").replace(",", ""));
        return total + price * quantity;
      }, 0).toFixed(2)
    );
  };
  const hendelOnClick = () => {};

  const renderItem = ({ item }) => {
    const quantity = quantities[item.id] || 1;

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
            <Image style={Cardstyles.image} source={{ uri: item.image }} />
          </View>
        </View>

        <View style={Cardstyles.amoutAndPriceView}>
          <View style={Cardstyles.orderQuantity}>
            <TouchableOpacity
              onPress={() => decrement(item.id)}
              style={Cardstyles.button}
            >
              <Image
                style={Cardstyles.buttonText}
                source={require("../assets/icons/itemCard/Minus.png")}
              />
            </TouchableOpacity>

            <Text style={Cardstyles.quantityText}>{quantity}</Text>

            <TouchableOpacity
              onPress={() => increment(item.id)}
              style={Cardstyles.button}
            >
              <Image
                style={Cardstyles.buttonText}
                source={require("../assets/icons/itemCard/Plus.png")}
              />
            </TouchableOpacity>
          </View>

          <View style={Cardstyles.removeButtonContainer}>
            <TouchableOpacity style={Cardstyles.removeButton}>
              <Text style={Cardstyles.removeButtonText}>הסר</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={Cardstyles.priceView}>
          <Text style={Cardstyles.priceText}>X {quantity}</Text>
          <Text style={Cardstyles.priceText}>{item.price}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
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
          <View style={{ flex: 7.1 }}>
            <FlatList
              data={Items}
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
    fontSize: 22,
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
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center",
    // alignSelf: "center",
    justifyContent: "space-between",
    width: 130,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
  },
  button: {
    padding: 15,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  removeButtonContainer: {
    marginLeft: 10, // Adds spacing between the remove button and quantity selector
  },
  removeButton: {
    width: 100,
    height: 50, // Same height as the orderQuantity container
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
