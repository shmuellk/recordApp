import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from "react-native";

const renderItem = ({ item, navigation }) => {
  const hendelOnPress = () => {
    // Navigate to the ItemCardScreen, passing item details as parameters
    navigation.navigate("ItemCardScreen", { item });
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
          <Image style={styles.image} source={{ uri: item.IMAGE }} />
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
    height: 180,
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
    bottom: 10,
  },
  ItemImag: { flex: 4 },
  ItemInfoText: {
    fontSize: 15,
    color: "black",
    marginBottom: 5,
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  image: {
    width: 100,
    height: 100,
    position: "absolute",
    bottom: 10,
    right: 10,
    resizeMode: "contain",
  },
});
