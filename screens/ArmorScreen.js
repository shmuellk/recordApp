import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  I18nManager,
  Image,
  TouchableOpacity,
} from "react-native";
import Button from "../components/Button";

import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Using Ionicons for the left arrow
const { width, height } = Dimensions.get("window");

const ArmorScreen = ({ navigation }) => {
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

  const renderItem = ({ item }) => {
    const quantity = quantities[item.id] || 1;

    return (
      <View style={Cardstyles.card}>
        <View style={Cardstyles.itemDataView}>
          <View style={Cardstyles.textData}>
            <Text style={Cardstyles.haderText}>{item.name}</Text>
            <View>
              <View style={{ flexDirection: "row" }}>
                <Text style={Cardstyles.infoTitle}>מק"ט : </Text>
                <Text style={Cardstyles.infoText}>{item.SKU}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={Cardstyles.infoTitle}>מותג : </Text>
                <Text style={Cardstyles.infoText}>{item.brand}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={Cardstyles.infoTitle}>מחיר : </Text>
                <Text style={Cardstyles.infoText}>{item.price}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={Cardstyles.infoTitle}>במלאי : </Text>
                {item.amount > 0 ? (
                  <Image
                    style={{
                      alignSelf: "center",
                    }}
                    source={require("../assets/icons/armorIcons/Green_v.png")}
                  />
                ) : (
                  <Image
                    style={{
                      alignSelf: "center",
                    }}
                    source={require("../assets/icons/armorIcons/Red_x.png")}
                  />
                )}
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
          {item.amount > 0 && (
            <View
              style={{
                paddingLeft: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#1A2540",
                  width: 100, // Same width as the remove button
                  height: 50, // Same height as the remove button
                  borderRadius: 15, // Same border radius as the remove button
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  הוסף לעגלה
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={Cardstyles.removeButtonContainer}>
            <TouchableOpacity style={Cardstyles.removeButton}>
              <Text style={Cardstyles.removeButtonText}>הסר</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={Cardstyles.priceView}></View>
      </View>
    );
  };
  return (
    <>
      {isEmpty ? (
        <View style={styles.container}>
          <View style={styles.emptyCartView}>
            <Icon
              name="bookmark-multiple-outline"
              size={70}
              color="#1A2540"
              style={styles.serchItemIcon}
            />
          </View>
          <View style={styles.massegeView}>
            <Text style={styles.mainHader}>אין שריונים</Text>
            <Text style={styles.SubHader}>השריונים שלך יופיעו כאן</Text>
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
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>שריונים</Text>
          </View>
          <View style={styles.ItemsSeparatorFirst} />
          <View style={{ flex: 9 }}>
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
        </View>
      )}
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
    marginBottom: 10,
    color: "#1A2540",
  },
  SubHader: {
    fontSize: 20,
    color: "#7E7D83",
  },
});
const Cardstyles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    width: width,
    height: height * 0.3,
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
    fontSize: 26,
    fontWeight: "bold",
  },
  infoView: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 18,
    color: "#7E7D83",
  },
  infoTitle: {
    fontSize: 18,
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
