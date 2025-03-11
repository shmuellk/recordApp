import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  I18nManager,
} from "react-native";
import RecentShoppingPop from "./RecentShoppingPop";
import AlternateSKUPop from "./AlternateSKUPop";
import VehiclesPop from "./VehiclesPop";
import itemCardModel from "../model/itemCardModel";

const { width } = Dimensions.get("window");

const InfoButton = ({ placeholder, type, car, catalog_number, sku_code }) => {
  const [openPopUp, setOpenPopUp] = useState(false);
  const [RecentShoppingPopData, setRecentShoppingPopData] = useState([]);
  const [VehiclesPopData, setVehiclesPopData] = useState([]);
  const [AlternateSKUPopData, setAlternateSKUPopData] = useState([]);
  const fetchData = async () => {
    try {
      // Simulate fetching data (replace with your API or data-fetch logic)

      if (type === 1) {
        let data = await itemCardModel.getRecentShopping({
          CATALOG_NUMBER: catalog_number,
        });
        setRecentShoppingPopData(data);
      }
      if (type === 2) {
        let data = await itemCardModel.getCarsByItem({
          CATALOG_NUMBER: catalog_number,
        });
        setVehiclesPopData(data);
      }
      if (type === 3) {
        let data = await itemCardModel.getAlternativeSkus({
          CATALOG_NUMBER: catalog_number,
        });

        setAlternateSKUPopData(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  // Toggle pop-up state
  const togglePopUp = () => {
    setOpenPopUp(!openPopUp);
  };

  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={togglePopUp}>
        <Text style={styles.input}>{placeholder}</Text>
      </TouchableOpacity>

      {/* Render Modal for the PopUp */}
      <Modal
        visible={openPopUp}
        transparent={true}
        animationType="slide" // Animates the popup from the bottom
        onRequestClose={togglePopUp} // Closes the modal on Android back button
      >
        {type == 1 && (
          <RecentShoppingPop
            data={RecentShoppingPopData}
            onClose={togglePopUp}
            title={car ? sku_code : "Unknown"} // Safe check for car.name
            subTitle={"קניות אחרונות"} // Safe check for car.carName
          />
        )}
        {type == 2 && (
          <VehiclesPop
            data={VehiclesPopData}
            onClose={togglePopUp}
            title={car ? sku_code : "Unknown"} // Safe check for car.name
            subTitle={"רכבים"} // Safe check for car.carName
          />
        )}
        {type == 3 && (
          <AlternateSKUPop
            data={AlternateSKUPopData}
            onClose={togglePopUp}
            title={car ? sku_code : "Unknown"} // Safe check for car.name
            subTitle={"מקטים חלופיים"} // Safe check for car.carName
          />
        )}
      </Modal>
    </View>
  );
};

export default InfoButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EBEDF5",
    width: width * 0.28,
    height: 45,
    borderRadius: 10,
    top: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    color: "#1A2540", // Set a color for the text
    fontSize: 16,
  },
});
