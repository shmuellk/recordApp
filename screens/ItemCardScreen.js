import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  I18nManager,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";

import Button from "../components/Button";
import InfoButton from "../components/InfoButton";

const { width, height } = Dimensions.get("window");

const ItemCardScreen = ({ route, navigation }) => {
  const { item } = route.params || {}; // Default to an empty object if item is undefined
  const [star, setStar] = useState(false);
  const [armor, setArmor] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState("aaa");
  const brand = [
    {
      imag: require("../assets/icons/itemCard/categoris/skf.png"),
      name: "aaa",
    },
    {
      imag: require("../assets/icons/itemCard/categoris/monro.png"),
      name: "bbb",
    },
    {
      imag: require("../assets/icons/itemCard/categoris/ironman.png"),
      name: "ccc",
    },
    {
      imag: require("../assets/icons/itemCard/categoris/optimal.png"),
      name: "ddd",
    },
    {
      imag: require("../assets/icons/itemCard/categoris/optimal.png"),
      name: "eee",
    },
    {
      imag: require("../assets/icons/itemCard/categoris/optimal.png"),
      name: "fff",
    },
    {
      imag: require("../assets/icons/itemCard/categoris/optimal.png"),
      name: "ggg",
    },
  ];

  const hendelOnPress = () => {};

  const handleArmorToggle = () => {
    setArmor((prevArmor) => !prevArmor);
  };

  const handleStarToggle = () => {
    setStar((prevStar) => !prevStar);
  };

  const increment = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrement = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleOnPressBrand = (brandName) => {
    setSelectedBrand(brandName); // Update the selected brand when an item is pressed
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        { backgroundColor: selectedBrand === item.name ? "#EBEDF5" : "white" }, // Change background color if selected
      ]}
      onPress={() => handleOnPressBrand(item.name)} // Set selected brand when pressed
    >
      <Image source={item.imag} style={styles.brandImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
            uri: "https://d3m9l0v76dty0.cloudfront.net/system/photos/2803846/large/04d9c97b690e4c29131d1525a9aaec41.jpg",
          }}
        />
      </View>

      {/* Product Information with Star Icon on the left and Product Title on the right */}
      <View style={styles.ItemInfoVeiw}>
        {item ? (
          <View style={styles.itemDetails}>
            <View style={styles.productTitleContainer}>
              {/* Star Icon (on the far left) */}
              <TouchableOpacity onPress={handleStarToggle}>
                <Image
                  style={styles.starIcon}
                  source={
                    star
                      ? require("../assets/icons/itemCard/RedStar.png")
                      : require("../assets/icons/itemCard/GreyStar.png")
                  }
                />
              </TouchableOpacity>

              {/* Product Title (right-aligned) */}
              <Text style={styles.productTitle}>
                {item.name || "Product Title"}
              </Text>
            </View>

            {/* SKU and Brand Info */}
            <Text style={styles.skuText}>
              מק"ט: {item.sku || "DAC 45840039 ABS"}
            </Text>
            <Text style={styles.brandText}>
              מותג: {item.brand || "OPTIMAL"}
            </Text>
            {/* Price Section */}
            <View
              style={{
                flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
                top: 10,
                alignSelf: I18nManager.isRTL ? "flex-start" : "flex-end",
              }}
            >
              <Text style={styles.priceText}>
                מחיר ברוטו: <Text style={styles.priceValue}>₪15.00</Text>
              </Text>
              <Text style={styles.priceText}>
                מחיר נטו: <Text style={styles.priceValue}>₪93.00</Text>
              </Text>
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

              <Text style={styles.quantityText}>{quantity}</Text>

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
            data={brand}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true} // Enable horizontal scrolling
            inverted={I18nManager.isRTL ? false : true}
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
          <Button title={"הוסף לעגלה"} onPress={hendelOnPress} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A2540",
    textAlign: I18nManager.isRTL ? "left" : "right", // RTL alignment for the title
    flex: 1, // Allow the title to take up the remaining space
  },
  starIcon: {
    marginRight: 10, // Place the star icon on the left side
  },
  skuText: {
    fontSize: 18,
    color: "#1A2540",
    marginBottom: 5,
    textAlign: I18nManager.isRTL ? "left" : "right", // RTL alignment
  },
  brandText: {
    fontSize: 18,
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
    fontSize: 20,
  },
  image: {
    width: 300, // Adjust as per your requirement
    height: 300, // Adjust as per your requirement
    resizeMode: "contain", // Keep the aspect ratio
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
});

export default ItemCardScreen;
