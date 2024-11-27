import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  I18nManager,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/Feather"; // Using Ionicons for the left arrow
import renderItem from "../components/renderItem";
import carModel from "../model/carsModel";

const { width, height } = Dimensions.get("window");

const ItemScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredItems, setFilteredItems] = useState([]); // State for filtered items
  const [showImage, setShowImage] = useState(false); // State for image display
  const [currentCategory, setCurrentCategory] = useState("MainCategory"); // Track current category level
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Track the selected category
  const [selectedPARENT_GROUP, setSelectedPARENT_GROUP] = useState(null); // Track the selected category
  const [selectedITEM_GROUP, setSelectedITEM_GROUP] = useState(null); // Track the selected category
  const [selectedCHILD_GROUP, setSelectedCHILD_GROUP] = useState(null); // Track the selected category

  const { category, searchJson } = route.params;

  const MainCategory = category
    .filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.PARENT_GROUP === item.PARENT_GROUP) // Ensure uniqueness
    )
    .map((item, index) => ({
      id: index + 1,
      name: item.PARENT_GROUP,
    }));

  const SubCategory = category
    .filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.ITEM_GROUP === item.ITEM_GROUP) // Ensure uniqueness
    )
    .map((item, index) => ({
      id: index + 1,
      main: item.PARENT_GROUP,
      name: item.ITEM_GROUP,
    }));
  const GrendSubCategory = category
    .filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.CHILD_GROUP === item.CHILD_GROUP) // Ensure uniqueness
    )
    .map((item, index) => ({
      id: index + 1,
      main: item.ITEM_GROUP,
      name: item.CHILD_GROUP,
    }));
  const [categories, setCategories] = useState(MainCategory);

  // Filter function based on the search query
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === "") {
      setFilteredItems(route.params.Items); // Reset to original items if search is cleared
    } else {
      const filteredData = route.params.Items.filter(
        (item) => item.name.includes(text) || item.carName.includes(text)
      );
      setFilteredItems(filteredData);
    }
  };

  const hendelCategoryChose = (category) => {
    if (currentCategory === "MainCategory") {
      let categoryTemp = SubCategory.filter(
        (sub) => sub.main === category.name
      );

      const filteredData = filteredItems.filter(
        (item) => item.PARENT_GROUP === category.name
      );

      setFilteredItems(filteredData); // Filter items
      setCategories(categoryTemp); // Load subcategories
      setCurrentCategory("SubCategory");

      // Update selected category states
      setSelectedPARENT_GROUP(category.name);
      setSelectedITEM_GROUP(null); // Clear lower-level selections
      setSelectedCHILD_GROUP(null);
      setShowImage(true); // Show the back arrow
    } else if (currentCategory === "SubCategory") {
      let categoryTemp = GrendSubCategory.filter(
        (sub) => sub.main === category.name
      );

      const filteredData = filteredItems.filter(
        (item) => item.ITEM_GROUP === category.name
      );

      setFilteredItems(filteredData); // Filter items
      setCategories(categoryTemp); // Load grand subcategories
      setCurrentCategory("GrendSubCategory");

      // Update selected category states
      setSelectedITEM_GROUP(category.name);
      setSelectedCHILD_GROUP(null); // Clear lower-level selections
    } else if (currentCategory === "GrendSubCategory") {
      const filteredData = filteredItems.filter(
        (item) => item.CHILD_GROUP === category.name
      );

      setFilteredItems(filteredData); // Filter items
      setSelectedCHILD_GROUP(category.name); // Update selected child group
    }
  };

  const hendelBackFromCategory = () => {
    if (currentCategory === "GrendSubCategory") {
      // Go back to SubCategory
      const categoryTemp = SubCategory.filter(
        (sub) => sub.main === selectedPARENT_GROUP
      );

      setCategories(categoryTemp); // Update categories
      setCurrentCategory("SubCategory");
      setSelectedCHILD_GROUP(null); // Clear current child group selection
    } else if (currentCategory === "SubCategory") {
      // Go back to MainCategory
      setCategories(MainCategory); // Reset to all main categories
      setCurrentCategory("MainCategory");
      setSelectedITEM_GROUP(null); // Clear current item group selection
      setShowImage(false); // Hide back arrow
    } else if (currentCategory === "MainCategory") {
      // Already at the main category level; reset everything
      setCategories(MainCategory); // Reset categories
      setCurrentCategory("MainCategory");
      setSelectedPARENT_GROUP(null); // Clear current parent group selection
      setShowImage(false); // Hide back arrow
    }
  };

  const renderCategory = ({ item, index }) => (
    <TouchableOpacity
      style={[
        currentCategory === "GrendSubCategory" && selectedCategoryId === item.id
          ? styles.categoryItem2
          : styles.categoryItem,
        index === 0 && { marginTop: 10 },
      ]}
      onPress={() => hendelCategoryChose(item)} // Pass the selected category
    >
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  // const renderSeparatorCategory = () => (
  //   <View style={styles.CategorySeparator} />
  // );
  const renderSeparatorItem = () => <View style={styles.ItemsSeparator} />;
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    // This effect will run whenever the currentCategory or categories change.
    console.log("Category changed:", currentCategory);
    console.log("Available categories:", categories);

    // Example: Add any logic that needs to happen when the category changes
    if (currentCategory === "MainCategory") {
      ProdactsByCar = async () => {
        const response = await carModel.getProdactsByCar({
          MANUFACTURER: searchJson.MANUFACTURER,
          MODEL: searchJson.MODEL,
          MANUFACTURE_YEAR: searchJson.MANUFACTURE_YEAR,
          ENGINE_MODEL: searchJson.ENGINE_MODEL,
          CAPACITY: searchJson.CAPACITY,
          GAS: searchJson.GAS,
          GEAR: searchJson.GEAR,
          PROPULSION: searchJson.PROPULSION,
          DOORS: searchJson.DOORS,
          BODY: searchJson.BODY,
          YEAR_LIMIT: searchJson.YEAR_LIMIT,
          NOTE: searchJson.NOTE,
        });
        setFilteredItems(response);
      };
      ProdactsByCar();
      console.log("You're in the Main Category");
    } else if (currentCategory === "SubCategory") {
      ProdactsByPARENT_GROUP = async () => {
        const response = await carModel.getProdactsByPARENT_GROUP({
          MANUFACTURER: searchJson.MANUFACTURER,
          MODEL: searchJson.MODEL,
          MANUFACTURE_YEAR: searchJson.MANUFACTURE_YEAR,
          ENGINE_MODEL: searchJson.ENGINE_MODEL,
          CAPACITY: searchJson.CAPACITY,
          GAS: searchJson.GAS,
          GEAR: searchJson.GEAR,
          PROPULSION: searchJson.PROPULSION,
          DOORS: searchJson.DOORS,
          BODY: searchJson.BODY,
          YEAR_LIMIT: searchJson.YEAR_LIMIT,
          NOTE: searchJson.NOTE,
          PARENT_GROUP: selectedPARENT_GROUP,
        });
        setFilteredItems(response);
      };
      ProdactsByPARENT_GROUP();
      console.log("You're in the Sub Category");
    } else if (currentCategory === "GrendSubCategory") {
      ProdactsByITEM_GROUP = async () => {
        const response = await carModel.getProdactsByITEM_GROUP({
          MANUFACTURER: searchJson.MANUFACTURER,
          MODEL: searchJson.MODEL,
          MANUFACTURE_YEAR: searchJson.MANUFACTURE_YEAR,
          ENGINE_MODEL: searchJson.ENGINE_MODEL,
          CAPACITY: searchJson.CAPACITY,
          GAS: searchJson.GAS,
          GEAR: searchJson.GEAR,
          PROPULSION: searchJson.PROPULSION,
          DOORS: searchJson.DOORS,
          BODY: searchJson.BODY,
          YEAR_LIMIT: searchJson.YEAR_LIMIT,
          NOTE: searchJson.NOTE,
          PARENT_GROUP: selectedPARENT_GROUP,
          ITEM_GROUP: selectedITEM_GROUP,
        });
        setFilteredItems(response);
      };
      ProdactsByITEM_GROUP();
      console.log("You're in the Grand Sub Category");
    }
  }, [currentCategory, categories]);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {/* Header */}
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
            <Text style={styles.haderTitel}>שם רכב</Text>
          </View>

          <TouchableOpacity style={styles.leftButton}>
            <Image source={require("../assets/Car_Info.png")} />
          </TouchableOpacity>
        </View>

        {/* Middle Bar */}
        <View style={styles.midelBar}>
          <View style={styles.categoryButton}>
            <TouchableOpacity
              style={styles.categoryButtonIn}
              onPress={hendelBackFromCategory}
            >
              {showImage && (
                <Image
                  style={styles.categoryButtonIcon}
                  source={require("../assets/RedBackArrow.png")}
                />
              )}
              <View style={styles.categoryButtonTextContainer}>
                <Text style={styles.categoryButtonText}>
                  {currentCategory === "MainCategory"
                    ? "קטגוריות"
                    : currentCategory === "SubCategory"
                    ? selectedPARENT_GROUP
                    : selectedITEM_GROUP}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.serchItem}>
            <TextInput
              placeholder="חפש פריט..."
              value={searchQuery}
              onChangeText={handleSearch}
              style={styles.serchItemText}
            />
            <Icon
              name="search"
              size={25}
              color="black"
              style={styles.serchItemIcon}
            />
          </View>
        </View>

        {/* Category and Items */}
        <View
          style={{
            flex: 7.5,
            flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
            backgroundColor: "#f8f8f8",
          }}
        >
          {filteredItems.length > 0 ? (
            <View
              style={{
                flex: 7.5,
                flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
                backgroundColor: "#f8f8f8",
              }}
            >
              <View
                id="category"
                style={{ flex: 3.5, backgroundColor: "white" }}
              >
                <FlatList
                  data={categories}
                  renderItem={renderCategory}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                />
              </View>

              <View
                id="itemList"
                style={{ flex: 6.5, backgroundColor: "#ffffff" }}
              >
                <FlatList
                  data={filteredItems} // Use filteredItems here
                  keyExtractor={(item, Index) => Index.toString()}
                  renderItem={({ item }) => renderItem({ item, navigation })}
                  ItemSeparatorComponent={renderSeparatorItem}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                alignSelf: "center",
                bottom: 30,
              }}
            >
              <Image
                style={styles.InfoCar}
                source={require("../assets/icons/searchIcons/no_result.png")}
              />
              <Text style={{ fontSize: 25 }}>אין פריטים לרכב זה</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ItemScreen;

const styles = StyleSheet.create({
  TitleView: {
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
  },
  InfoCar: {
    height: 150,
    width: 150,
    resizeMode: "contain",
  },
  image: {
    width: 100,
    height: 100,
    position: "absolute",
    bottom: 10,
    right: 10,
    resizeMode: "contain",
  },
  hader: {
    flex: 1.5,
    backgroundColor: "white",
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  haderTitel: {
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
    marginTop: 10,
  },
  leftButton: {
    right: 10,
  },
  rightButton: {
    left: 10,
  },

  categoryItem: {
    marginBottom: 10,
    backgroundColor: "white",
    height: 60,
    width: width * 0.3,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    elevation: 5,
  },
  categoryItem2: {
    marginBottom: 10,
    backgroundColor: "#EBEDF5",
    height: 60,
    width: width * 0.3,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    elevation: 5,
  },
  ItemList: {
    flexDirection: "column",
    backgroundColor: "white",
    height: 180,
    width: "95%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  categoryText: {
    fontSize: 16,
    color: "#1A2540",
    textAlign: "center",
  },
  CategorySeparator: {
    top: 10,
    height: 1.5,
    width: width * 0.3,
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
  },
  ItemsSeparator: {
    height: 1.5,
    width: width * 0.6,
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
  },

  horizontalSeparator: {
    height: 1.5,
    width: "100%",
    backgroundColor: "#EBEDF5",
  },
  ItemInfo: {
    flex: 6,
    alignSelf: "flex-end",
    bottom: 10,
  },
  ItemImag: { flex: 4 },
  ItemTitle: {
    color: "#1A2540",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    top: 10,
  },
  ItemInfoText: {
    fontSize: 18,
    color: "#7E7D83",
    marginBottom: 5,
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  midelBar: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
  },
  categoryButton: {
    flex: 3.5,
    alignSelf: "center",
  },

  categoryButtonIn: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row", // Handle RTL
    justifyContent: "center", // Center the content as needed
    alignItems: "center", // Vertically center text and icon
    width: "100%", // Ensure the button takes the full width
    height: 55,
    backgroundColor: "#1A2540",
    position: "relative", // Allows for absolute positioning of the image
  },

  categoryButtonTextContainer: {
    width: "70%", // Ensure the text takes 70% of the width
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  categoryButtonText: {
    textAlign: "center", // Centers the text horizontally
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },

  categoryButtonIcon: {
    position: "absolute", // Ensure the image is absolutely positioned
    right: 2, // Aligns the image to the left edge
  },
  serchItem: {
    flex: 6.5,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: I18nManager.isRTL ? "flex-end" : "flex-start",
    alignItems: "center",
    height: 55,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
  },
  serchItemText: {
    flex: 1,
    textAlign: "right", // Align the text to the left
    color: "black", // Set a color for the text
    fontSize: 18,
    marginHorizontal: 20,
  },
  serchItemIcon: {
    right: 10,
  },
});
