import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
const { width, height } = Dimensions.get("window");

const ContactScreen = ({ navigation }) => {
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

        {/* Logo Section - Below Header */}
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
        <View style={styles.addresViewText}>
          <Image source={require("../assets/icons/contact/Location.png")} />
          <Text style={styles.addresText}>הסדן 7, חולון 5881560</Text>
        </View>
        <View style={styles.addresViewText}>
          <Image source={require("../assets/icons/contact/Address.png")} />
          <Text style={styles.addresText}>ת.ד 37207 תל אביב 66188</Text>
        </View>
        <View style={styles.addresViewText}>
          <Image source={require("../assets/icons/contact/Group.png")} />
          <Text style={styles.addresText}>03-6391469</Text>
        </View>
        <View style={styles.addresViewText}>
          <Image source={require("../assets/icons/contact/Email.png")} />
          <Text style={styles.addresText}>info@record.co.il</Text>
        </View>
      </View>
      <View style={styles.ItemsSeparator} />

      <View style={styles.phonsNumView}>
        <View>
          <View style={styles.addresViewText}>
            <Image source={require("../assets/icons/contact/Phone.png")} />
            <Text style={styles.addresText}>03-6391462</Text>
          </View>
          <View style={styles.addresViewText}>
            <Image source={require("../assets/icons/contact/Phone.png")} />
            <Text style={styles.addresText}>03-6391463</Text>
          </View>
        </View>
        <View>
          <View style={styles.addresViewText}>
            <Image source={require("../assets/icons/contact/Phone.png")} />
            <Text style={styles.addresText}>03-6391464</Text>
          </View>
          <View style={styles.addresViewText}>
            <Image source={require("../assets/icons/contact/Phone.png")} />
            <Text style={styles.addresText}>03-6391465</Text>
          </View>
        </View>
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
    alignItems: "center", // Center items vertically
    justifyContent: "center", // Center items horizontally
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
  addresView: {
    flex: 4,
    backgroundColor: "white",
    alignItems: "flex-start",
  },
  phonsNumView: {
    flex: 3,
    flexDirection: "row",
  },
  logoImage: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: "contain",
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
  phonsNum: {
    flexDirection: "column",
  },
});
