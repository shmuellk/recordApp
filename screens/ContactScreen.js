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
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/AntDesign";
import Icon3 from "react-native-vector-icons/MaterialIcons";
import usersModel from "../model/usersModel";

const { width, height } = Dimensions.get("window");

// פונקציה לחלוקת מערך ל-chunks (קבוצות) בגודל מוגדר (במקרה שלנו - 3 פריטים)
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

  // פונקציה להצגת משתמש בודד – היא תציג את האייקון ושם המשתמש
  const renderWhatsappUser = (item) => {
    return (
      <TouchableOpacity onPress={() => openPhoneCall(`${item.phone}`)}>
        <View style={styles.addresViewText}>
          <View style={styles.iconContainer}>
            <Icon2 name="phone" size={28} color="#d01117" />
          </View>
          <Text style={styles.addresText}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // פונקציה לפתיחת WhatsApp עם מספר הטלפון המבוקש
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

  // חלוקת הנתונים לעמודות: בכל עמודה עד 3 פריטים
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

      {/* Other sections */}
      <View style={styles.addresView}>
        <View style={styles.addresHader}>
          <Text style={styles.addresHaderText}>
            רקורד - סמי ואהרון כהן בע"מ
          </Text>
        </View>
        <TouchableOpacity onPress={handleOpenWaze}>
          <View style={styles.addresViewText}>
            <View style={styles.iconContainer}>
              <Icon2 name="enviromento" size={28} color="#d01117" />
            </View>
            <Text style={styles.addresText}>הסדן 7, חולון 5881560</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openPhoneCall("03-6391469")}>
          <View style={styles.addresViewText}>
            <View style={styles.iconContainer}>
              {/* עדכנו את האייקון לאייקון טלפון */}
              <Icon2 name="phone" size={30} color="#d01117" />
            </View>
            <Text style={styles.addresText}>03-6391469</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenMail}>
          <View style={styles.addresViewText}>
            <View style={styles.iconContainer}>
              <Icon3 name="alternate-email" size={28} color="#d01117" />
            </View>
            <Text style={styles.addresText}>info@record.co.il</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.addresViewText}>
          <View style={styles.iconContainer}>
            <Icon2 name="mail" size={28} color="#d01117" />
          </View>
          <Text style={styles.addresText}>ת.ד 37207 תל אביב 66188</Text>
        </View>
      </View>
      <View style={styles.ItemsSeparator} />

      {/* FlatList אופקי המציג עמודות כאשר בכל עמודה עד 3 פריטים */}
      <View style={styles.phonsNumView}>
        <FlatList
          // key={`flatlist_${columns.length}`}
          data={columns} // מערך העמודות
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
    height: 1.5,
    width: width * 0.9,
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
  },
  logoView: {
    flex: 3,
    backgroundColor: "#1A2540",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  hader: {
    flexDirection: "row-reverse",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    top: 50,
  },
  rightButton: {
    position: "absolute",
    right: 20,
    zIndex: 1,
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  logoWrapper: {
    position: "absolute",
    top: 30,
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
    alignItems: "flex-start",
  },
  addresHader: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  addresHaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addresViewText: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  addresText: {
    marginLeft: 10,
    fontSize: 16,
  },
  iconContainer: {
    backgroundColor: "#EBEDF5",
    padding: 5,
    borderRadius: 10,
  },
  // עיצוב עבור כל עמודה (טור) ב-FlatList האופקי
  column: {
    justifyContent: "flex-start",
  },

  // עיצוב המונע הצגת גלילה אופקית מיותרת
  phonsNumView: {
    flex: 2.5,
    justifyContent: "center",
    alignItems: "flex-start",
  },
});
