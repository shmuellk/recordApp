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
  ActivityIndicator,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Feather"; // Using Ionicons for the left arrow
import renderItem from "../components/renderItem";
import carModel from "../model/carsModel";
import CarInfoPop from "../components/CarInfoPop";
const { width, height } = Dimensions.get("window");

const ItemScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredItems, setFilteredItems] = useState([]); // State for filtered items
  const [showImage, setShowImage] = useState(false); // State for image display
  const [currentCategory, setCurrentCategory] = useState("MainCategory"); // Track current category level
  // const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Track the selected category
  const [selectedPARENT_GROUP, setSelectedPARENT_GROUP] = useState(null); // Track the selected category
  const [selectedITEM_GROUP, setSelectedITEM_GROUP] = useState(null); // Track the selected category
  const [selectedCHILD_GROUP, setSelectedCHILD_GROUP] = useState(null); // Track the selected category
  const [loader, setLoader] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);

  const { category, carData } = route.params;

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
  };

  const hendelCategoryChose = (category) => {
    if (currentCategory === "MainCategory") {
      let categoryTemp = SubCategory.filter(
        (sub) => sub.main === category.name
      );
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
      setCategories(categoryTemp); // Load grand subcategories
      setCurrentCategory("GrendSubCategory");
      // Update selected category states
      setSelectedITEM_GROUP(category.name);
      setSelectedCHILD_GROUP(null); // Clear lower-level selections
    } else if (currentCategory === "GrendSubCategory") {
      setCurrentCategory("GrendSubCategory");
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
        currentCategory === "GrendSubCategory" &&
        selectedCHILD_GROUP === item.name
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

  const togglePopUp = () => {
    setOpenPopUp(!openPopUp);
  };

  useEffect(() => {
    // This effect will run whenever the currentCategory or categories change.

    // Example: Add any logic that needs to happen when the category changes
    if (currentCategory === "MainCategory") {
      ProdactsByCar = async () => {
        try {
          setLoader(true);
          const response = await carModel.getProdactsByCar({
            MANUFACTURER: carData.MANUFACTURER,
            MODEL: carData.MODEL,
            MANUFACTURE_YEAR: carData.MANUFACTURE_YEAR,
            ENGINE_MODEL: carData.ENGINE_MODEL,
            GEAR: carData.GEAR,
            PROPULSION: carData.PROPULSION,
            DOORS: carData.DOORS,
            BODY: carData.BODY,
            YEAR_LIMIT: carData.YEAR_LIMIT,
            NOTE: carData.NOTE,
          });
          console.log("====================================");
          console.log("response = " + JSON.stringify(response));
          console.log("====================================");
          setFilteredItems(response);
        } catch (err) {
          console.log("====================================");
          console.log("error : " + err.message);
          console.log("====================================");
        } finally {
          setLoader(false);
        }
      };
      ProdactsByCar();
    } else if (currentCategory === "SubCategory") {
      ProdactsByPARENT_GROUP = async () => {
        try {
          setLoader(true);
          const response = await carModel.getProdactsByPARENT_GROUP({
            MANUFACTURER: carData.MANUFACTURER,
            MODEL: carData.MODEL,
            MANUFACTURE_YEAR: carData.MANUFACTURE_YEAR,
            ENGINE_MODEL: carData.ENGINE_MODEL,
            GEAR: carData.GEAR,
            PROPULSION: carData.PROPULSION,
            DOORS: carData.DOORS,
            BODY: carData.BODY,
            YEAR_LIMIT: carData.YEAR_LIMIT,
            NOTE: carData.NOTE,
            PARENT_GROUP: selectedPARENT_GROUP,
          });
          setFilteredItems(response);
        } catch (err) {
          console.log("====================================");
          console.log("error: " + err.message);
          console.log("====================================");
        } finally {
          setLoader(false);
        }
      };
      ProdactsByPARENT_GROUP();
    } else if (currentCategory === "GrendSubCategory") {
      ProdactsByITEM_GROUP = async () => {
        try {
          setLoader(true);
          const response = await carModel.getProdactsByITEM_GROUP({
            MANUFACTURER: carData.MANUFACTURER,
            MODEL: carData.MODEL,
            MANUFACTURE_YEAR: carData.MANUFACTURE_YEAR,
            ENGINE_MODEL: carData.ENGINE_MODEL,
            GEAR: carData.GEAR,
            PROPULSION: carData.PROPULSION,
            DOORS: carData.DOORS,
            BODY: carData.BODY,
            YEAR_LIMIT: carData.YEAR_LIMIT,
            NOTE: carData.NOTE,
            PARENT_GROUP: selectedPARENT_GROUP,
            ITEM_GROUP: selectedITEM_GROUP,
          });
          setFilteredItems(response);
        } catch (err) {
          console.log("====================================");
          console.log("error: " + err.message);
          console.log("====================================");
        } finally {
          setLoader(false);
        }
      };
      ProdactsByITEM_GROUP();
    }
  }, [currentCategory, categories]);

  useEffect(() => {
    ProdactsByCHILD_GROUP = async () => {
      if (selectedCHILD_GROUP) {
        try {
          setLoader(true);
          const response = await carModel.ProdactsByCHILD_GROUP({
            MANUFACTURER: carData.MANUFACTURER,
            MODEL: carData.MODEL,
            MANUFACTURE_YEAR: carData.MANUFACTURE_YEAR,
            ENGINE_MODEL: carData.ENGINE_MODEL,
            GEAR: carData.GEAR,
            PROPULSION: carData.PROPULSION,
            DOORS: carData.DOORS,
            BODY: carData.BODY,
            YEAR_LIMIT: carData.YEAR_LIMIT,
            NOTE: carData.NOTE,
            PARENT_GROUP: selectedPARENT_GROUP,
            ITEM_GROUP: selectedITEM_GROUP,
            CHILD_GROUP: selectedCHILD_GROUP,
          });
          setFilteredItems(response);
        } catch (err) {
          console.log("====================================");
          console.log("error: " + err.message);
          console.log("====================================");
        } finally {
          setLoader(false);
        }
      }
    };
    ProdactsByCHILD_GROUP();
  }, [selectedCHILD_GROUP]);

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
            <Text style={styles.haderTitel}>
              {carData.MODEL} {carData.MANUFACTURE_YEAR}
            </Text>
          </View>

          <TouchableOpacity style={styles.leftButton} onPress={togglePopUp}>
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
                style={{
                  flex: 6.5,
                  backgroundColor: "#ffffff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {loader ? (
                  <View style={{ transform: [{ scale: 2 }] }}>
                    <ActivityIndicator size="large" color="#d01117" />
                  </View>
                ) : (
                  <FlatList
                    data={filteredItems} // Use filteredItems here
                    keyExtractor={(item, Index) => Index.toString()}
                    renderItem={({ item }) =>
                      renderItem({ item, navigation, carData })
                    }
                    ItemSeparatorComponent={
                      filteredItems.length > 1 ? renderSeparatorItem : null
                    } // No separator for single item
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                      flexGrow: 1,
                      alignItems: "flex-end", // Align items properly
                      alignContent: "flex-end",
                      alignSelf: "flex-end",
                    }}
                  />
                )}
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

        <Modal
          visible={openPopUp}
          transparent={true}
          animationType="slide" // Animates the popup from the bottom
          onRequestClose={togglePopUp} // Closes the modal on Android back button
        >
          <CarInfoPop data={carData} onClose={togglePopUp} />
        </Modal>
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
    // textDecorationLine: "underline",
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
    color: "#1A2540", //כרטיסי קטגוריה
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
    backgroundColor: "#1A2540", //קטגוריה
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
