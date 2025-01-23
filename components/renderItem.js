import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import itemCardModel from "../model/itemCardModel";

const renderItem = ({ item, navigation, carData }) => {
  const hendelOnPress = async () => {
    // Navigate to the ItemCardScreen, passing item details as parameters
    if (carData) {
      try {
        const Brand = await itemCardModel.getItemBrandByCar({
          CHILD_GROUP: item.CHILD_GROUP,
          DESCRIPTION_NOTE: item.DESCRIPTION_NOTE,
          MANUFACTURER: carData.MANUFACTURER,
          MODEL: carData.MODEL,
          MANUFACTURE_YEAR: carData.MANUFACT,
          YEAR_LIMIT: carData.YEAR_LIMIT,
          GEAR: carData.GEAR,
          BODY: carData.BODY,
          DOORS: carData.DOORS,
          ENGINE_MODEL: carData.ENGINE_MODEL,
          PROPULSION: carData.PROPULSION,
          NOTE: carData.NOTE,
        });
        console.log("====================================");
        console.log("Brand - getItemBrandByCar: " + JSON.stringify(Brand));
        console.log("====================================");
        navigation.navigate("ItemCardScreen", { item, Brand });
      } catch (error) {
        console.log("====================================");
        console.log("Error: " + error);
        console.log("====================================");
      }
    } else {
      try {
        const Brand = await itemCardModel.getItemBrand({
          CATALOG_NUMBER: item.CATALOG_NUMBER,
          CHILD_GROUP: item.CHILD_GROUP,
          DESCRIPTION_NOTE: item.DESCRIPTION_NOTE,
        });
        console.log("====================================");
        console.log("Brand - getItemBrand: " + JSON.stringify(Brand));
        console.log("====================================");
        navigation.navigate("ItemCardScreen", { item, Brand });
      } catch (error) {
        console.log("====================================");
        console.log("Error: " + error);
        console.log("====================================");
      }
    }
  };

  return (
    <TouchableOpacity style={styles.ItemList} onPress={hendelOnPress}>
      <View
        style={{
          alignSelf: I18nManager.isRTL ? "flex-start" : "flex-end",
        }}
      >
        <Text style={styles.ItemTitle}>
          {item.CHILD_GROUP} {item.DESCRIPTION_NOTE}
        </Text>
      </View>

      <View
        style={{
          flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
        }}
      >
        <View style={styles.ItemInfo}>
          <Text style={styles.ItemInfoText}>{item.MODEL}</Text>
          <Text style={styles.ItemInfoText}>
            {item.FROM_YEAR} - {item.UNTIL_YEAR}
          </Text>
          {item.CAPACITY && (
            <Text style={styles.ItemInfoText}>נפח {item.CAPACITY}</Text>
          )}
          <Text style={styles.ItemInfoText}>{item.CAR_NOTE}</Text>
        </View>
        <View style={styles.ItemImag}>
          <Image
            style={styles.image}
            source={{
              uri: `http://app.record.a-zuzit.co.il:8085/media/${
                item.IMAGE
              }.jpg?timestamp=${Date.UTC()}`,
            }}
            onError={(error) =>
              console.log("Image Load Error in: ", error.nativeEvent.error)
            }
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default renderItem;

const styles = StyleSheet.create({
  ItemList: {
    flexDirection: "column",
    backgroundColor: "white",
    maxHeight: 180,
    width: "95%",
    alignContent: "center",
    alignItems: "center",
    // justifyContent: "center",
    alignSelf: "center",
  },
  ItemTitle: {
    color: "#d01117",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    top: 10,
    marginBottom: 25,
  },
  ItemInfo: {
    flex: 6,
    alignSelf: "flex-end",
    bottom: 6,
  },
  ItemImag: { flex: 4 },
  ItemInfoText: {
    fontSize: 15,
    color: "black",
    marginBottom: 5,
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  image: {
    bottom: 6,
    width: 100,
    height: 100,
    position: "absolute",
    right: 10,
    resizeMode: "contain",
  },
});
