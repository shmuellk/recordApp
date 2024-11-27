import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  I18nManager,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Using Ionicons for the left arrow
import RecentShoppingPop from "./RecentShoppingPop";
import AlternateSKUPop from "./AlternateSKUPop";
import VehiclesPop from "./VehiclesPop";

const { width } = Dimensions.get("window");

const InfoButton = ({ placeholder, type, car }) => {
  const [openPopUp, setOpenPopUp] = useState(false);

  // Toggle pop-up state
  const togglePopUp = () => {
    setOpenPopUp(!openPopUp);
  };
  const RecentShoppingPopData = [
    {
      date: "03/05/2024",
      quantity: 1,
      gross_price: "₪90.72",
      net_price: "₪90.52",
    },
    {
      date: "22/02/2022",
      quantity: 5,
      gross_price: "₪95.48",
      net_price: "₪94.11",
    },
    {
      date: "26/03/2023",
      quantity: 4,
      gross_price: "₪93.74",
      net_price: "₪91.25",
    },
    {
      date: "22/02/2022",
      quantity: 5,
      gross_price: "₪95.48",
      net_price: "₪94.11",
    },
    {
      date: "26/03/2023",
      quantity: 4,
      gross_price: "₪93.74",
      net_price: "₪3333",
    },
    {
      date: "26/03/2023",
      quantity: 4,
      gross_price: "₪93.74",
      net_price: "₪3333",
    },
    {
      date: "26/03/2023",
      quantity: 4,
      gross_price: "₪93.74",
      net_price: "₪3333",
    },
    {
      date: "26/03/2023",
      quantity: 4,
      gross_price: "₪93.74",
      net_price: "₪3333",
    },
  ];
  const VehiclesPopData = [
    {
      manufacturer: "פרואייס סיטי ורסו",
      years: "2011-2016",
      comments: "ברכב עם צלחת אחורי",
    },
    {
      manufacturer: "טויוטה קורולה",
      years: "2014-2018",
      comments: "הרכב מגיע עם מערכת ABS מתקדמת",
    },
    {
      manufacturer: "יונדאי טוסון",
      years: "2016-2020",
      comments: "רכב עם חיישני חנייה",
    },
    {
      manufacturer: "מאזדה 3",
      years: "2010-2015",
      comments: "כולל מצלמת רוורס",
    },
    {
      manufacturer: "פולקסווגן גולף",
      years: "2012-2017",
      comments: "רכב ספורט עם גג נפתח",
    },
    {
      manufacturer: "סובארו אימפרזה",
      years: "2013-2019",
      comments: "הרכב מצויד בבקרת יציבות",
    },
    {
      manufacturer: "ניסאן קשקאי",
      years: "2015-2021",
      comments: "רכב עם מערכת בקרת אקלים",
    },
    {
      manufacturer: "פורד פוקוס",
      years: "2011-2016",
      comments: "כולל מערכת התראה על התקרבות יתר",
    },
    {
      manufacturer: "מרצדס C קלאס",
      years: "2017-2022",
      comments: "מערכת מולטימדיה עם מסך מגע",
    },
  ];

  const AlternateSKUPopData = [
    {
      SKU: "DAC 45840039ABS",
    },
    {
      SKU: "TRK 58392010XYZ",
    },
    {
      SKU: "MOT 34985029JLP",
    },
    {
      SKU: "BRK 12948763GHT",
    },
    {
      SKU: "WHL 78392047XYZ",
    },
    {
      SKU: "ENG 45920384PLT",
    },
    {
      SKU: "FTR 39485763BRK",
    },
    {
      SKU: "CLT 83920475DFG",
    },
    {
      SKU: "PIP 23984765PLQ",
    },
    {
      SKU: "BTT 98237495XYZ",
    },
  ];
  console.log("====================================");
  console.log(type);
  console.log("====================================");
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
            title={car ? car.name : "Unknown"} // Safe check for car.name
            subTitle={car ? car.carName : ""} // Safe check for car.carName
          />
        )}
        {type == 2 && (
          <VehiclesPop
            data={VehiclesPopData}
            onClose={togglePopUp}
            title={car ? car.name : "Unknown"} // Safe check for car.name
            subTitle={car ? car.carName : ""} // Safe check for car.carName
          />
        )}
        {type == 3 && (
          <AlternateSKUPop
            data={AlternateSKUPopData}
            onClose={togglePopUp}
            title={car ? car.name : "Unknown"} // Safe check for car.name
            subTitle={car ? car.carName : ""} // Safe check for car.carName
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
