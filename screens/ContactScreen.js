import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking,
  FlatList,
  I18nManager,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/AntDesign";
import Icon3 from "react-native-vector-icons/MaterialIcons";
import usersModel from "../model/usersModel";

const { width, height } = Dimensions.get("window");

// Base dimensions from your design (adjust these as needed)
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

// Helper scaling functions
const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Function to split data into chunks of a fixed size (3 items per chunk)
const chunkData = (data, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  return chunks;
};

const ContactScreen = ({ navigation }) => {
  const [whatsappData, setWhtsappData] = useState([]);

  useEffect(() => {
    const fetchWhatsappData = async () => {
      const data = await usersModel.getWhatsAppUsers();
      setWhtsappData(data);
    };
    fetchWhatsappData();
  }, []);

  // Render a single WhatsApp user (icon and name)
  const renderWhatsappUser = (item) => {
    return (
      <TouchableOpacity onPress={() => openPhoneCall(`${item.phone}`)}>
        <View style={styles.addresViewText}>
          <View style={styles.iconContainer}>
            <Icon2 name="phone" size={scale(28)} color="#d01117" />
          </View>
          <Text style={styles.addresText}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Opens the phone dialer
  const openPhoneCall = async (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert("לא ניתן לחייג ממכשיר זה");
      }
    } catch (error) {
      console.error("An error occurred", error);
      alert("לא ניתן לחייג ממכשיר זה");
    }
  };

  const handleOpenMail = async () => {
    const email = "info@record.co.il";
    const url = `mailto:${email}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert("מייל לא נתמך במכשיר זה");
      }
    } catch (error) {
      console.error("Error opening email", error);
      alert("התרחשה שגיאה בפתיחת המייל");
    }
  };

  const handleOpenWaze = async () => {
    const url = "https://waze.com/ul/hsv8wpvqbs";
    try {
      await Linking.openURL(url);
    } catch (error) {
      alert("Waze לא הצליח להיפתח");
    }
  };

  // Split the WhatsApp data into columns (each column contains up to 3 items)
  const columns = chunkData(whatsappData, 3);

  return (
    <View style={styles.container}>
      <View style={styles.logoView}>
        {/* Header Section */}
        <View style={styles.hader}>
          <TouchableOpacity
            style={styles.rightButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require("../assets/Back.png")}
              style={styles.iconImage}
            />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.headerText}>צור קשר</Text>
          </View>
        </View>

        {/* Logo Section */}
        <View style={styles.logoWrapper}>
          <Image
            source={require("../assets/WhiteRecordLogo.png")}
            style={styles.logoImage}
          />
        </View>
      </View>

      {/* Address Section */}
      <View style={styles.addresView}>
        <View style={styles.addresHader}>
          <Text style={styles.addresHaderText}>
            רקורד - סמי ואהרון כהן בע"מ
          </Text>
        </View>
        <TouchableOpacity onPress={handleOpenWaze}>
          <View style={styles.addresViewText}>
            <View style={styles.iconContainer}>
              <Icon2 name="enviromento" size={scale(28)} color="#d01117" />
            </View>
            <Text style={styles.addresText}>הסדן 7, חולון 5881560</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openPhoneCall("03-6391469")}>
          <View style={styles.addresViewText}>
            <View style={styles.iconContainer}>
              <Icon2 name="phone" size={scale(30)} color="#d01117" />
            </View>
            <Text style={styles.addresText}>03-6391469</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenMail}>
          <View style={styles.addresViewText}>
            <View style={styles.iconContainer}>
              <Icon3 name="alternate-email" size={scale(28)} color="#d01117" />
            </View>
            <Text style={styles.addresText}>info@record.co.il</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.addresViewText}>
          <View style={styles.iconContainer}>
            <Icon2 name="mail" size={scale(28)} color="#d01117" />
          </View>
          <Text style={styles.addresText}>ת.ד 37207 תל אביב 66188</Text>
        </View>
      </View>
      <View style={styles.ItemsSeparator} />

      {/* Horizontal FlatList displaying columns (each column contains up to 3 items) */}
      <View style={styles.phonsNumView}>
        <FlatList
          data={columns}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item: columnItems, index }) => (
            <View key={index.toString()} style={styles.column}>
              {columnItems.map((user, userIndex) => (
                <View
                  key={user.id ? user.id.toString() : userIndex.toString()}
                  style={styles.item}
                >
                  {renderWhatsappUser(user)}
                </View>
              ))}
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  ItemsSeparator: {
    height: verticalScale(1.5),
    width: width * 0.9,
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
  },
  logoView: {
    flex: 2.5,
    backgroundColor: "#1A2540",
    borderBottomLeftRadius: scale(30),
    borderBottomRightRadius: scale(30),
  },
  hader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    top: verticalScale(35),
  },
  rightButton: {
    position: "absolute",
    right: I18nManager.isRTL ? scale(20) : null,
    left: I18nManager.isRTL ? null : scale(20),
    zIndex: 1,
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: moderateScale(30),
    fontWeight: "bold",
    color: "white",
  },
  iconImage: {
    width: scale(30),
    height: scale(30),
    resizeMode: "contain",
  },
  logoWrapper: {
    position: "absolute",
    // top: verticalScale(30),
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: "contain",
  },
  addresView: {
    flex: 4.5,
    backgroundColor: "white",
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
  },
  addresHader: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(15),
    marginBottom: verticalScale(10),
  },
  addresHaderText: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  addresViewText: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
  },
  addresText: {
    marginLeft: I18nManager.isRTL ? scale(10) : null,
    marginRight: I18nManager.isRTL ? null : scale(10),
    fontSize: moderateScale(16),
  },
  iconContainer: {
    backgroundColor: "#EBEDF5",
    padding: scale(3),
    borderRadius: scale(10),
  },
  // Styles for the horizontal FlatList columns
  column: {
    justifyContent: "flex-start",
  },
  // Prevent extra horizontal scrolling
  phonsNumView: {
    flex: 2.5,
    justifyContent: "center",
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
  },
});
