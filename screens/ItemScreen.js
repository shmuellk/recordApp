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
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/Feather"; // Using Ionicons for the left arrow
import renderItem from "../components/renderItem";
import carModel from "../model/carsModel";
import CarInfoPop from "../components/CarInfoPop";
import filterModel from "../model/filterModel";
import usersModel from "../model/usersModel";
import Icon2 from "react-native-vector-icons/FontAwesome";

const { width, height } = Dimensions.get("window");

const chunkData = (data, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  return chunks;
};

const ItemScreen = ({ navigation, route }) => {
  const [filteredItems, setFilteredItems] = useState([]); // State for filtered items
  const [showImage, setShowImage] = useState(false); // State for image display
  const [currentCategory, setCurrentCategory] = useState("MainCategory"); // Track current category level
  // const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Track the selected category
  const [selectedPARENT_GROUP, setSelectedPARENT_GROUP] = useState(null); // Track the selected category
  const [selectedITEM_GROUP, setSelectedITEM_GROUP] = useState(null); // Track the selected category
  const [selectedCHILD_GROUP, setSelectedCHILD_GROUP] = useState(null); // Track the selected category
  const [loader, setLoader] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [serchInput, setSerchInput] = useState("");
  const [sendSerchInput, setSendSerchInput] = useState("");
  const [serchData, setSerchData] = useState([]);
  const { category, carData, carNumber } = route.params;
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [whatsappData, setWhtsappData] = useState([]);

  useEffect(() => {
    const fetchWhatsappData = async () => {
      const data = await usersModel.getWhatsAppUsers();
      setWhtsappData(data);
    };
    fetchWhatsappData();
  }, []);

  useEffect(() => {
    fatchSDKSerch = async () => {
      if (serchInput != "" && serchInput.length > 1) {
        try {
          let temp = await filterModel.getComplitSerch({
            search_value: serchInput,
          });

          setSerchData(temp || []);
        } catch (error) {
          console.log("====================================");
          console.log("error : " + error);
          console.log("====================================");
        }
      } else {
        setSerchData([]);
      }
    };
    fatchSDKSerch();
  }, [serchInput]);

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
  const handleSelectSerch = async (item) => {
    Keyboard.dismiss();
    setSendSerchInput(item);
    setSerchInput("");
    setSerchData([]);
    setSearchPerformed(true); // Mark that a search was performed
    try {
      setLoader(true);
      const response = await carModel.getProdactsByCHILD_GROUPSerch({
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
        CHILD_GROUP: item,
      });

      console.log("====================================");
      console.log("response : " + JSON.stringify(response));
      console.log("====================================");
      setFilteredItems(response);
    } catch (err) {
      console.log("====================================");
      console.log("error: " + err.message);
      console.log("====================================");
    } finally {
      setLoader(false);
    }
  };

  const hendelCategoryChose = (category) => {
    setSerchData([]);
    setSendSerchInput(serchInput);
    setSerchInput("");
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

  const renderWhatsappUser = (item) => {
    return (
      <TouchableOpacity onPress={() => openWhatsApp(`${item.phone}`)}>
        <View style={styles.addresViewText}>
          <View style={styles.iconContainer}>
            <Icon2 name="whatsapp" size={30} color="#1A2540" />
          </View>
          <Text style={styles.addresText}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // פונקציה לפתיחת WhatsApp עם מספר הטלפון המבוקש
  const openWhatsApp = async (phoneNumber) => {
    const searchValue = sendSerchInput || "פריט לא מוגדר";

    const message = `שלום.
אני מעוניין לקבל פרטים על "${searchValue}" עבור רכב : ${carNumber}`;
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert("WhatsApp לא מותקן במכשיר זה");
      }
    } catch (error) {
      console.error("An error occurred", error);
      alert("WhatsApp לא מותקן במכשיר זה");
    }
  };

  // חלוקת הנתונים לעמודות: בכל עמודה עד 3 פריטים
  const columns = chunkData(whatsappData, 3);

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
        <KeyboardAvoidingView
          style={{ flex: 1 }} // adjust paddingTop to header height
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
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
                style={styles.serchItemText}
                textAlign={I18nManager.isRTL ? "right" : "right"} // Dynamic alignment for RTL/LTR
                onChangeText={(text) => {
                  setSerchInput(text);
                }}
                value={serchInput}
                returnKeyType="search" // Changes the return key label to "Search"
              />
              <Icon
                name="search"
                size={25}
                color="black"
                style={styles.serchItemIcon}
              />
            </View>

            {serchData.length > 0 ? (
              <View style={styles.suggestionsContainer}>
                <FlatList
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  data={serchData}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelectSerch(item)}>
                      <Text style={styles.suggestionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            ) : (
              serchInput.length > 1 && (
                <View style={styles.nosuggestionsContainer}>
                  <Text style={styles.suggestionText}>
                    אין פריטים תואמים לחיפוש
                  </Text>
                </View>
              )
            )}
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
              // When items are available, show the normal view:
              <View
                style={{
                  flex: 7.5,
                  flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
                  backgroundColor: "#f8f8f8",
                }}
              >
                <View style={{ flex: 3.5, backgroundColor: "white" }}>
                  <FlatList
                    data={categories}
                    renderItem={renderCategory}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
                <View
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
                      data={filteredItems}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) =>
                        renderItem({ item, navigation, carData })
                      }
                      ItemSeparatorComponent={
                        filteredItems.length > 1 ? renderSeparatorItem : null
                      }
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{
                        flexGrow: 1,
                        alignItems: "flex-end",
                        alignContent: "flex-end",
                        alignSelf: "flex-end",
                      }}
                    />
                  )}
                </View>
              </View>
            ) : // When no items are available, choose between two UI variants:
            searchPerformed ? (
              // Snippet A: When a search was performed and no items were found
              <>
                <View style={{ flex: 3.5 }}>
                  <FlatList
                    data={categories}
                    renderItem={renderCategory}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
                <View
                  style={{
                    flex: 6.5,
                    alignItems: "center",
                    top: height * 0.1,
                  }}
                >
                  <Image
                    style={styles.InfoCar}
                    source={require("../assets/icons/searchIcons/no_result.png")}
                  />
                  <Text style={{ fontSize: width * 0.075 }}>
                    פריט זה לא נמצא{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: width * 0.04,
                      marginTop: 5,
                      marginBottom: 10,
                      color: "#ED2027",
                    }}
                  >
                    לבקשת פריט התחל שיחה עם :
                  </Text>

                  <FlatList
                    data={columns} // מערך העמודות
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item: columnItems }) => (
                      <View style={styles.column}>
                        {columnItems.map((user) => (
                          <View key={user.id} style={styles.item}>
                            {renderWhatsappUser(user)}
                          </View>
                        ))}
                      </View>
                    )}
                  />
                </View>
              </>
            ) : (
              // Snippet B: When no search has been performed yet
              <>
                <View
                  style={{
                    flex: 7.5,
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    alignSelf: "center",
                    alignContent: "center",
                    bottom: 30,
                  }}
                >
                  <Image
                    style={styles.InfoCar}
                    source={require("../assets/icons/searchIcons/no_result.png")}
                  />
                  <Text style={{ fontSize: 25 }}>אין פריטים לרכב זה</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 20 }}>לקבלת מידע נוסף: </Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("ContactScreen");
                      }}
                    >
                      <Text style={{ fontSize: 20, color: "#d01117" }}>
                        צור קשר
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
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
        </KeyboardAvoidingView>
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80, // set this to your header's height
    backgroundColor: "white",
    zIndex: 100, // ensure it stays above other content
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 20,
    height: height * 0.15,
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
    paddingTop: height * 0.15,
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
    height: height * 0.075,
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
    height: height * 0.075,
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
  suggestionsContainer: {
    position: "absolute",
    top: height * 0.22, // בדיוק אחרי גובה שדה החיפוש
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    maxHeight: height * 0.35,
    zIndex: 999,
    width: width * 0.65,
    alignItems: "center",
  },
  nosuggestionsContainer: {
    position: "absolute",
    top: height * 0.22, // בדיוק אחרי גובה שדה החיפוש
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    maxHeight: height * 0.35,
    zIndex: 999,
    width: width * 0.65,
    alignItems: "center",
  },
  suggestionText: {
    padding: 12,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    textAlign: "center",
  },
  noItemsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    bottom: 30,
  },

  addresViewText: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  iconContainer: {
    // backgroundColor: "#EBEDF5",
    padding: 5,
    borderRadius: 10,
  },
  column: {
    marginHorizontal: width * 0.001,
    justifyContent: "flex-start",
  },
  item: {
    marginBottom: 10,
  },
  phonsNumView: {
    flex: 2.5,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  addresText: {
    fontSize: width * 0.045,
    textDecorationLine: "underline",
    color: "#1A2540",
    fontWeight: "bold",
  },
});
