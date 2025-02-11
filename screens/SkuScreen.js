import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  FlatList,
} from "react-native";
import renderItemProdact from "../components/renderItemProdact";

const { width, height } = Dimensions.get("window");

const SkuScreen = ({ navigation, route }) => {
  const filteredItems = route.params.product;
  const CATALOG_NUMBER = route.params.CATALOG_NUMBER;
  console.log("====================================");
  console.log("filteredItems: " + JSON.stringify(filteredItems));
  console.log("====================================");

  const renderSeparatorItem = () => <View style={styles.ItemsSeparator} />;

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={styles.hader}>
          <TouchableOpacity
            style={styles.rightButton}
            onPress={() => {
              navigation.navigate("SearchScreen", {
                resetFilters: true, // Pass a parameter to indicate a reset
              });
            }}
          >
            <Image source={require("../assets/Home.png")} />
          </TouchableOpacity>

          <View style={styles.TitleView}>
            <Image source={require("../assets/PageHader.png")} />
            <Text style={styles.haderTitel}>{CATALOG_NUMBER}</Text>
          </View>
        </View>

        <View
          style={{
            flex: 8.5,
            flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
            backgroundColor: "#f8f8f8",
          }}
        >
          <View
            id="itemList"
            style={{
              backgroundColor: "#ffffff",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
          >
            <View style={styles.ItemsSeparator} />
            <FlatList
              data={filteredItems} // Use filteredItems here
              keyExtractor={(item, Index) => Index.toString()}
              renderItem={({ item }) => renderItemProdact({ item, navigation })}
              ItemSeparatorComponent={renderSeparatorItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                alignItems: "flex-end", // Align items properly
                alignContent: "flex-end",
                alignSelf: "flex-end",
              }}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SkuScreen;

const styles = StyleSheet.create({
  hader: {
    flex: 1.5,
    backgroundColor: "white",
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  rightButton: {
    left: 10,
  },
  leftButton: {
    right: 10,
  },
  TitleView: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", // Ensures the content is centered vertically
    flex: 1, // Allows the TitleView to take up available space for proper centering
    right: 15,
  },
  haderTitel: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
  },
  ItemsSeparator: {
    height: 1.5,
    width: width * 0.9,
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
  },
});
