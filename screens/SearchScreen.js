import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Animated,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
  I18nManager,
  ActivityIndicator, // Import to handle RTL/LTR
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Using Ionicons for the left arrow
import Button from "../components/Button";
import Filter from "../components/Filter";
import carModel from "../model/carsModel";
import filterModel from "../model/filterModel";
import itemCardModel from "../model/itemCardModel";

const { width, height } = Dimensions.get("window");

const SearchScreen = ({ navigation, route }) => {
  const [loadingFilters, setLoadingFilters] = useState({}); // Manage loading states for filters
  const { userData } = route.params;
  const [selectedTab, setSelectedTab] = useState("SerchByCarNumber");
  const animatedHeight = useRef(new Animated.Value(height * 0.46)).current;
  const [carNumber, setCarNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);
  const [model, setModel] = useState([]);
  const [manufacture_year, setManufacture_year] = useState([]);
  const [engine_model, setEngine_model] = useState([]);
  const [capacity, setCapacity] = useState([]);
  const [gas, setGas] = useState([]);
  const [gear, setGear] = useState([]);
  const [Propulsion, setPropulsion] = useState([]);
  const [doors, setDoors] = useState([]);
  const [boody, setBoody] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false); // Loader state for search button
  const [searchEnabled, setSearchEnabled] = useState(false); // Loader state for search button
  const [SDkserchInput, setSDkserchInput] = useState("");
  const [SDKData, setSDKData] = useState([]);

  useEffect(() => {
    fatchSDKSerch = async () => {
      if (SDkserchInput != "" && SDkserchInput.length > 1) {
        try {
          let temp = await filterModel.getAlternativeSKU({
            SKU: SDkserchInput,
          });
          setSDKData(temp || []);
        } catch (error) {
          console.log("====================================");
          console.log("error : " + error);
          console.log("====================================");
        }
      } else {
        setSDKData([]);
      }
    };
    fatchSDKSerch();
  }, [SDkserchInput]);

  useEffect(() => {
    //יצרן
    const fetchManufacturers = async () => {
      try {
        setLoadingFilters((prev) => ({ ...prev, MANUFACTURER: true })); // Start loader for MANUFACTURER
        const result = await filterModel.getManufacturer();
        setManufacturers(result || []);
      } catch (error) {
        console.error("Error fetching manufacturers:", error);
      } finally {
        setLoadingFilters((prev) => ({ ...prev, MANUFACTURER: false })); // Stop loader for MANUFACTURER
      }
    };

    fetchManufacturers();
  }, []);

  const [filtersEnabled, setFiltersEnabled] = useState({
    MANUFACTURER: true,
    MODEL: false,
    MANUFACTURE_YEAR: false,
    ENGINE_MODEL: false,
    CAPACITY: false,
    GAS: false,
    GEAR: false,
    PROPULSION: false,
    DOORS: false,
    BODY: false,
  });

  const [searchJson, setSearchJson] = useState({
    MANUFACTURER: "",
    MODEL: "",
    MANUFACTURE_YEAR: "",
    ENGINE_MODEL: "",
    CAPACITY: "",
    GAS: "",
    GEAR: "",
    PROPULSION: "",
    DOORS: "",
    BODY: "",
    YEAR_LIMIT: "",
    NOTE: "",
  });

  useEffect(() => {
    //מודל
    if (searchJson.MANUFACTURER) {
      const fetchManufacturers = async () => {
        try {
          setLoadingFilters((prev) => ({ ...prev, MODEL: true })); // Start loader for MODEL
          const result = await filterModel.getAllModel({
            MANUFACTURER: searchJson.MANUFACTURER,
          });
          setModel(result || []);
        } catch (error) {
          console.error("Error fetching manufacturers:", error);
        } finally {
          setLoadingFilters((prev) => ({ ...prev, MODEL: false })); // Stop loader for MODEL
        }
      };

      fetchManufacturers();
    }
  }, [searchJson.MANUFACTURER]);

  useEffect(() => {
    //שנה
    if (searchJson.MODEL) {
      const fetchManufacturers = async () => {
        try {
          const result = await filterModel.getAllmanufactureYear({
            MANUFACTURER: searchJson.MANUFACTURER,
            MODEL: searchJson.MODEL,
          });
          if (result) {
            setManufacture_year(result);
          }
        } catch (error) {
          console.error("Error fetching manufacturers:", error);
        }
      };

      fetchManufacturers();
    }
  }, [searchJson.MODEL]);

  useEffect(() => {
    //דגם מנוע

    if (searchJson.MANUFACTURE_YEAR) {
      const fetchManufacturers = async () => {
        try {
          const result = await filterModel.getAllEngineModel({
            MANUFACTURER: searchJson.MANUFACTURER,
            MODEL: searchJson.MODEL,
            MANUFACTURE_YEAR: searchJson.MANUFACTURE_YEAR,
          });
          if (result) {
            setEngine_model(result);
          }
        } catch (error) {
          console.error("Error fetching manufacturers:", error);
        }
      };

      fetchManufacturers();
    }
  }, [searchJson.MANUFACTURE_YEAR]);

  useEffect(() => {
    //נפח

    if (searchJson.ENGINE_MODEL) {
      const fetchManufacturers = async () => {
        try {
          const result = await filterModel.getAllCapacity({
            MANUFACTURER: searchJson.MANUFACTURER,
            MODEL: searchJson.MODEL,
            MANUFACTURE_YEAR: searchJson.MANUFACTURE_YEAR,
            ENGINE_MODEL: searchJson.ENGINE_MODEL,
          });
          if (result) {
            setCapacity(result);
          }
        } catch (error) {
          console.error("Error fetching manufacturers:", error);
        }
      };

      fetchManufacturers();
    }
  }, [searchJson.ENGINE_MODEL]);

  useEffect(() => {
    //בנזין/דיזל

    if (searchJson.CAPACITY) {
      const fetchManufacturers = async () => {
        try {
          const result = await filterModel.getAllGas({
            MANUFACTURER: searchJson.MANUFACTURER,
            MODEL: searchJson.MODEL,
            MANUFACTURE_YEAR: searchJson.MANUFACTURE_YEAR,
            ENGINE_MODEL: searchJson.ENGINE_MODEL,
            CAPACITY: searchJson.CAPACITY,
          });
          if (result) {
            setGas(result);
          }
        } catch (error) {
          console.error("Error fetching manufacturers:", error);
        }
      };

      fetchManufacturers();
    }
  }, [searchJson.CAPACITY]);

  useEffect(() => {
    //גיר
    if (searchJson.GAS) {
      const fetchManufacturers = async () => {
        try {
          const result = await filterModel.getAllGear({
            MANUFACTURER: searchJson.MANUFACTURER,
            MODEL: searchJson.MODEL,
            MANUFACTURE_YEAR: searchJson.MANUFACTURE_YEAR,
            ENGINE_MODEL: searchJson.ENGINE_MODEL,
            CAPACITY: searchJson.CAPACITY,
            GAS: searchJson.GAS,
          });
          if (result) {
            setGear(result);
          }
        } catch (error) {
          console.error("Error fetching manufacturers:", error);
        }
      };

      fetchManufacturers();
    }
  }, [searchJson.GAS]);

  useEffect(() => {
    //הנעה

    if (searchJson.GEAR) {
      const fetchManufacturers = async () => {
        try {
          const result = await filterModel.getAllPropulsion({
            MANUFACTURER: searchJson.MANUFACTURER,
            MODEL: searchJson.MODEL,
            MANUFACTURE_YEAR: searchJson.MANUFACTURE_YEAR,
            ENGINE_MODEL: searchJson.ENGINE_MODEL,
            CAPACITY: searchJson.CAPACITY,
            GAS: searchJson.GAS,
            GEAR: searchJson.GEAR,
          });
          if (result) {
            setPropulsion(result);
          }
        } catch (error) {
          console.error("Error fetching manufacturers:", error);
        }
      };

      fetchManufacturers();
    }
  }, [searchJson.GEAR]);

  useEffect(() => {
    //מספר דלתות

    if (searchJson.PROPULSION) {
      const fetchManufacturers = async () => {
        try {
          const result = await filterModel.getAllDoors({
            MANUFACTURER: searchJson.MANUFACTURER,
            MODEL: searchJson.MODEL,
            MANUFACTURE_YEAR: searchJson.MANUFACTURE_YEAR,
            ENGINE_MODEL: searchJson.ENGINE_MODEL,
            CAPACITY: searchJson.CAPACITY,
            GAS: searchJson.GAS,
            GEAR: searchJson.GEAR,
            PROPULSION: searchJson.PROPULSION,
          });
          if (result) {
            setDoors(result);
          }
        } catch (error) {
          console.error("Error fetching manufacturers:", error);
        }
      };

      fetchManufacturers();
    }
  }, [searchJson.PROPULSION]);

  useEffect(() => {
    //מרכב

    if (searchJson.DOORS) {
      const fetchManufacturers = async () => {
        try {
          const result = await filterModel.getAllBooy({
            MANUFACTURER: searchJson.MANUFACTURER,
            MODEL: searchJson.MODEL,
            MANUFACTURE_YEAR: searchJson.MANUFACTURE_YEAR,
            ENGINE_MODEL: searchJson.ENGINE_MODEL,
            CAPACITY: searchJson.CAPACITY,
            GAS: searchJson.GAS,
            GEAR: searchJson.GEAR,
            PROPULSION: searchJson.PROPULSION,
            DOORS: searchJson.DOORS,
          });
          if (result) {
            setBoody(result);
          }
        } catch (error) {
          console.error("Error fetching manufacturers:", error);
        }
      };

      fetchManufacturers();
    }
  }, [searchJson.DOORS]);

  useEffect(() => {
    if (route.params?.resetFilters) {
      setFiltersEnabled({
        MANUFACTURER: true,
        MODEL: false,
        MANUFACTURE_YEAR: false,
        ENGINE_MODEL: false,
        CAPACITY: false,
        GAS: false,
        GEAR: false,
        PROPULSION: false,
        DOORS: false,
        BODY: false,
      });

      setSearchJson({
        MANUFACTURER: "",
        MODEL: "",
        MANUFACTURE_YEAR: "",
        ENGINE_MODEL: "",
        CAPACITY: "",
        GAS: "",
        GEAR: "",
        PROPULSION: "",
        DOORS: "",
        BODY: "",
        YEAR_LIMIT: "",
        NOTE: "",
      });
      setSearchEnabled(false); // Enable search when all filters are reset

      // Clear the parameter after resetting
      navigation.setParams({ resetFilters: null });
    }
  }, [route.params?.resetFilters]);

  const enableFilter = (filterName) => {
    setFiltersEnabled((prevState) => {
      const newFiltersEnabled = { ...prevState };
      const newSearchJson = { ...searchJson };

      let foundFilter = false;

      // Iterate through all filters
      for (const key in newFiltersEnabled) {
        if (foundFilter) {
          // Reset subsequent filters
          newFiltersEnabled[key] = false; // Disable subsequent filters
          newSearchJson[key] = ""; // Clear values for subsequent filters
        } else if (key === filterName) {
          if (newFiltersEnabled[key]) {
            // If already enabled, reset its value
            newSearchJson[key] = ""; // Set the corresponding searchJson key to ""
          } else {
            // Enable the current filter
            newFiltersEnabled[key] = true;
          }
          foundFilter = true; // Start resetting after this filter
        }
      }
      if (!searchEnabled) {
        setSearchEnabled(true);
      } //
      // Update states
      setSearchJson(newSearchJson);
      return newFiltersEnabled;
    });
  };
  const saveSelect = (filterName, value) => {
    setSearchJson((prevJson) => {
      const updatedJson = { ...prevJson };
      updatedJson[filterName.toUpperCase()] = value; // Update selected value
      return updatedJson;
    });
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setSDKData([]);
    setSearchEnabled(false);
    setSearchJson({
      MANUFACTURER: "",
      MODEL: "",
      MANUFACTURE_YEAR: "",
      ENGINE_MODEL: "",
      CAPACITY: "",
      GAS: "",
      GEAR: "",
      PROPULSION: "",
      DOORS: "",
      BODY: "",
      YEAR_LIMIT: "",
      NOTE: "",
    });
    setFiltersEnabled({
      MANUFACTURER: true,
      MODEL: false,
      MANUFACTURE_YEAR: false,
      ENGINE_MODEL: false,
      CAPACITY: false,
      GAS: false,
      GEAR: false,
      PROPULSION: false,
      DOORS: false,
      BODY: false,
    });
    setCarNumber("");
    Keyboard.dismiss();
    setSDkserchInput("");
    // Animate the height when tab is switched
    Animated.timing(animatedHeight, {
      toValue: tab === "SerchByCarNumber" ? height * 0.46 : height * 0.13,
      duration: 300,
      useNativeDriver: false, // Set to false for height animations
    }).start();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const onSerch = async () => {
    setSearchLoading(true); // Start loader
    try {
      if (selectedTab == "SerchByCarNumber") {
        const category = await carModel.getCategorisByCar({
          MANUFACTURER: searchJson.MANUFACTURER,
          MODEL: searchJson.MODEL,
          MANUFACTURE_YEAR: searchJson.MANUFACTURE_YEAR,
          ENGINE_MODEL: searchJson.ENGINE_MODEL,
          GEAR: searchJson.GEAR,
          PROPULSION: searchJson.PROPULSION,
          DOORS: searchJson.DOORS,
          BODY: searchJson.BODY,
          YEAR_LIMIT: searchJson.YEAR_LIMIT,
          NOTE: searchJson.NOTE,
        });
        if (category) {
          Keyboard.dismiss();
          navigation.navigate("ItemScreen", {
            userName: userData.U_VIEW_NAME,
            carData: searchJson,
            category: category,
          });
        } else {
          console.log("====================================");
          console.log("error");
          console.log("====================================");
        }
      } else {
      }
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
    } finally {
      setSearchLoading(false); // Stop loader
    }
  };

  const serchCarByNumber = async () => {
    Keyboard.dismiss();
    if (carNumber.length > 5 && carNumber.length < 12) {
      setLoading(true);
      try {
        let carInfo = await carModel.getCarInfo(carNumber);
        if (carInfo) {
          setSearchJson(carInfo);
        }
        setSearchEnabled(true);
        setCarNumber("");
        setFiltersEnabled({
          MANUFACTURER: true,
          MODEL: false,
          MANUFACTURE_YEAR: false,
          ENGINE_MODEL: false,
          CAPACITY: false,
          GAS: false,
          GEAR: false,
          PROPULSION: false,
          DOORS: false,
          BODY: false,
        });
      } catch (error) {
        console.error("Error fetching car info:", error);
      } finally {
        setLoading(false); // Hide loader
      }
    }
  };

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // Add listeners for keyboard show and hide
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // Keyboard is visible
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // Keyboard is hidden
      }
    );

    // Cleanup listeners on unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSelect = async (item) => {
    setSDkserchInput("");
    setSDKData([]);
    // setSearchLoading(true); // Start loader
    try {
      const product = await carModel.getProdactsById({
        CATALOG_NUMBER: item,
      });
      if (product.length > 1) {
        Keyboard.dismiss();
        navigation.navigate("SkuScreen", {
          userName: userData.U_VIEW_NAME,
          product: product,
          CATALOG_NUMBER: item,
        });
      } else if (product.length == 1) {
        Keyboard.dismiss();
        try {
          const Brand = await itemCardModel.getItemBrand({
            CATALOG_NUMBER: product[0].CATALOG_NUMBER,
            CHILD_GROUP: product[0].CHILD_GROUP,
            DESCRIPTION_NOTE: product[0].DESCRIPTION_NOTE,
          });
          console.log("====================================");
          console.log("Brand: " + JSON.stringify(Brand));
          console.log("====================================");
          navigation.navigate("ItemCardScreen", { item: product[0], Brand });
        } catch (error) {
          console.log("====================================");
          console.log("Error: " + error);
          console.log("====================================");
        }
      } else {
        console.log("====================================");
        console.log("error");
        console.log("====================================");
      }
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
    } finally {
      setSearchLoading(false); // Stop loader
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        {(!isKeyboardVisible || selectedTab === "SerchByCarNumber") && (
          <View style={styles.top}>
            <Image
              style={styles.image}
              source={require("../assets/PageLogo.png")}
            />
            <View style={styles.textContainer}>
              <Text style={styles.hader}>שלום {userData.U_VIEW_NAME}</Text>
              <Text style={styles.subText}>
                בחר את שיטת החיפוש המועדפת עליך
              </Text>
            </View>
          </View>
        )}
        <View
          style={[
            styles.tabContainer,
            isKeyboardVisible &&
              selectedTab != "SerchByCarNumber" && {
                paddingTop: 40,
              },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === "SerchByCarNumber"
                ? styles.activeTab
                : styles.inactiveTab,
            ]}
            onPress={() => handleTabChange("SerchByCarNumber")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "SerchByCarNumber"
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              חפש לפי רכב
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === "part" ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => handleTabChange("part")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "part"
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              חפש מק"ט
            </Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.data, { height: animatedHeight }]}>
          {selectedTab === "SerchByCarNumber" ? (
            <View style={styles.tubInfo}>
              <View style={styles.CarNumSerchOut}>
                <TextInput
                  placeholder="הזן מספר רכב"
                  style={styles.CarNumSerch}
                  textAlign={I18nManager.isRTL ? "right" : "right"} // Dynamic alignment for RTL/LTR
                  onChangeText={(text) => setCarNumber(text)}
                  value={carNumber}
                  keyboardType="numeric"
                  returnKeyType="search" // Changes the return key label to "Search"
                  onSubmitEditing={serchCarByNumber} // Calls the search function when "Enter" is pressed
                />
                <TouchableOpacity
                  style={styles.serchClick}
                  onPress={serchCarByNumber}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Icon
                      name="search"
                      size={22}
                      color="white"
                      style={styles.icon}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.filterRow}>
                <View>
                  <Filter
                    key={`MANUFACTURER-${searchJson.MANUFACTURER}`} // Unique key for React
                    placeholder="יצרן"
                    currentValue={searchJson.MANUFACTURER}
                    data={manufacturers} // Pass dynamic data here
                    enable={filtersEnabled.MANUFACTURER}
                    loading={loadingFilters.MANUFACTURER} // Pass loading state
                    onSelectItem={(value) => {
                      enableFilter("MODEL");
                      saveSelect("MANUFACTURER", value);
                      saveSelect("MODEL", "");
                    }}
                  />
                  <Filter
                    key={`MANUFACTURE_YEAR-${searchJson.MANUFACTURE_YEAR}`} // Unique key for React
                    placeholder="שנה"
                    currentValue={searchJson.MANUFACTURE_YEAR}
                    data={manufacture_year}
                    enable={filtersEnabled.MANUFACTURE_YEAR}
                    onSelectItem={(value) => {
                      enableFilter("ENGINE_MODEL");
                      saveSelect("MANUFACTURE_YEAR", value);
                    }}
                  />
                  <Filter
                    key={`CAPACITY-${searchJson.CAPACITY}`} // Unique key for React
                    placeholder="נפח"
                    data={capacity}
                    currentValue={searchJson.CAPACITY}
                    enable={filtersEnabled.CAPACITY}
                    onSelectItem={(value) => {
                      enableFilter("GAS");
                      saveSelect("CAPACITY", value);
                    }}
                  />
                  <Filter
                    key={`GEAR-${searchJson.GEAR}`} // Unique key for React
                    placeholder="גיר"
                    currentValue={searchJson.GEAR}
                    data={gear}
                    enable={filtersEnabled.GEAR}
                    onSelectItem={(value) => {
                      enableFilter("PROPULSION");
                      saveSelect("GEAR", value);
                    }}
                  />
                  <Filter
                    key={`DOORS-${searchJson.DOORS}`} // Unique key for React
                    placeholder="מספר דלתות"
                    data={doors}
                    currentValue={searchJson.DOORS}
                    enable={filtersEnabled.DOORS}
                    onSelectItem={(value) => {
                      enableFilter("BODY");
                      saveSelect("DOORS", value);
                    }}
                  />
                </View>
                <View>
                  <Filter
                    key={`MODEL-${searchJson.MODEL}`} // Unique key for React
                    placeholder="מודל"
                    data={model}
                    currentValue={searchJson.MODEL}
                    enable={filtersEnabled.MODEL}
                    loading={loadingFilters.MODEL} // Pass loading state
                    onSelectItem={(value) => {
                      enableFilter("MANUFACTURE_YEAR");
                      saveSelect("MODEL", value);
                    }}
                  />
                  <Filter
                    key={`ENGINE_MODEL-${searchJson.ENGINE_MODEL}`} // Unique key for React
                    placeholder="דגם מנוע"
                    data={engine_model}
                    currentValue={searchJson.ENGINE_MODEL}
                    enable={filtersEnabled.ENGINE_MODEL}
                    onSelectItem={(value) => {
                      enableFilter("CAPACITY");
                      saveSelect("ENGINE_MODEL", value);
                    }}
                  />
                  <Filter
                    key={`GAS-${searchJson.GAS}`} // Unique key for React
                    placeholder="בנזין/דיזל"
                    data={gas}
                    currentValue={searchJson.GAS}
                    enable={filtersEnabled.GAS}
                    onSelectItem={(value) => {
                      enableFilter("GEAR");
                      saveSelect("GAS", value);
                    }}
                  />
                  <Filter
                    key={`PROPULSION-${searchJson.PROPULSION}`} // Unique key for React
                    placeholder="הנעה"
                    data={Propulsion}
                    currentValue={searchJson.PROPULSION}
                    enable={filtersEnabled.PROPULSION}
                    onSelectItem={(value) => {
                      enableFilter("DOORS");
                      saveSelect("PROPULSION", value);
                    }}
                  />
                  <Filter
                    key={`BODY-${searchJson.BODY}`} // Unique key for React
                    placeholder="מרכב"
                    data={boody}
                    currentValue={searchJson.BODY}
                    enable={filtersEnabled.BODY}
                    onSelectItem={(value) => {
                      enableFilter("BODY");
                      saveSelect("BODY", value);
                    }}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.tubInfo}>
              <View style={styles.CarNumSerchOut}>
                <TextInput
                  placeholder='חפש מק"ט'
                  style={styles.CarNumSerch}
                  textAlign={I18nManager.isRTL ? "right" : "right"} // Dynamic alignment for RTL/LTR
                  onChangeText={(text) => {
                    setSDkserchInput(text);
                    if (SDkserchInput != "") {
                      setSearchEnabled(true);
                    } else {
                      setSearchEnabled(false);
                    }
                  }}
                  value={SDkserchInput}
                />
              </View>
            </View>
          )}
        </Animated.View>
        {/* SDKData Rendering */}
        {SDKData.length > 0 ? (
          <View style={styles.suggestionsContainer}>
            <FlatList
              keyboardShouldPersistTaps={"handled"}
              showsVerticalScrollIndicator={false}
              data={SDKData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelect(item)}>
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : (
          SDkserchInput.length > 1 && (
            <View style={styles.nosuggestionsContainer}>
              <Text style={styles.suggestionText}>אין מקטים תואמים לחיפוש</Text>
            </View>
          )
        )}

        {selectedTab === "SerchByCarNumber" && (
          <View style={styles.bottom}>
            <Button
              title="חפש"
              onPress={onSerch}
              loading={searchLoading}
              enable={searchEnabled}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
  },
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginTop: 4,
    minHeight: 30,
    maxHeight: height * 0.35,
    bottom: 40,
  },
  nosuggestionsContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginTop: 4,
    minHeight: 30,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    maxHeight: height * 0.5,
    bottom: 40,
  },
  suggestionText: {
    padding: 12,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  serchClick: {
    backgroundColor: "#ED2027",
    width: width * 0.12,
    height: height * 0.08,
    maxHeight: 61,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: I18nManager.isRTL ? "flex-end" : "flex-start",
    borderTopRightRadius: I18nManager.isRTL ? 15 : 0,
    borderBottomRightRadius: I18nManager.isRTL ? 15 : 0,
    borderTopLeftRadius: I18nManager.isRTL ? 0 : 15,
    borderBottomLeftRadius: I18nManager.isRTL ? 0 : 15,
  },
  CarNumSerchOut: {
    backgroundColor: "white",
    width: width * 0.9,
    height: height * 0.08,
    maxHeight: 61,
    borderRadius: 15,
    top: height * 0.01,
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    marginBottom: 10,
  },
  top: {
    backgroundColor: "#EBEDF5",
    paddingHorizontal: 25,
    flexDirection: "column",
  },
  data: {
    backgroundColor: "#EBEDF5",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  bottom: {
    top: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  image: {
    maxHeight: "100%",
    maxWidth: "100%",
    height: height * 0.05,
    resizeMode: "contain",
    marginTop: 40,
    alignSelf: "center",
  },
  icon: {
    marginHorizontal: 10,
  },
  textContainer: {
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
  },
  hader: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1A2540",
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  subText: {
    fontSize: 16,
    color: "#1A2540",
    textAlign: "center",
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    height: 45,
    width: width * 0.1,
  },
  activeTab: {
    backgroundColor: "#1A2540",
    borderRadius: 15,
    zIndex: 1,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  inactiveTab: {
    backgroundColor: "white",
    borderRadius: 15,
    zIndex: 0,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activeTabText: {
    color: "white",
  },
  inactiveTabText: {
    color: "#7E7D83",
  },
  filterRow: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "space-between",
  },

  CarNumSerch: {
    flex: 1,
    textAlign: I18nManager.isRTL ? "left" : "right", // Handle RTL/LTR

    color: "#BDC3C7",
    fontSize: 18,
    left: 10,
  },
});

export default SearchScreen;
