import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  I18nManager,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Using Ionicons for the left arrow

const { width } = Dimensions.get("window");

const MenuScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirm = () => {
    setModalVisible(false); // Close the modal
    navigation.navigate("PrevLog"); // Perform the navigation action
  };

  const handleCancel = () => {
    setModalVisible(false); // Just close the modal
  };

  return (
    <View style={styles.container}>
      <View style={styles.Hader}>
        <Text style={styles.userName}>חלפים 4U</Text>
        <Text style={styles.mail}>1234@gmail.com</Text>
      </View>
      <View style={styles.ItemsSeparator} />
      <View style={styles.optionView}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("FavoritsScreen")}
        >
          <View style={styles.leftContent}>
            <Image
              style={styles.image}
              source={require("../assets/icons/menuIcons/Favorits.png")}
            />
            <Text style={styles.text}>מועדפים</Text>
          </View>
          <Icon name="keyboard-arrow-left" size={50} color="#ED2027" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("ContactScreen")}
        >
          <View style={styles.leftContent}>
            <Image
              style={styles.image}
              source={require("../assets/icons/menuIcons/Contact.png")}
            />
            <Text style={styles.text}>צור קשר</Text>
          </View>
          <Icon name="keyboard-arrow-left" size={50} color="#ED2027" />
        </TouchableOpacity>

        {/* Corrected here */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => setModalVisible(true)} // Wrapped in an arrow function
        >
          <View style={styles.leftContent}>
            <Image
              style={styles.image}
              source={require("../assets/icons/menuIcons/LogOut.png")}
            />
            <Text style={styles.text}>התנקת</Text>
          </View>
          <Icon name="keyboard-arrow-left" size={50} color="#ED2027" />
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>כבר הולך?</Text>
              <Text style={styles.modalMessage}>
                האם אתה בטוח שאתה רוצה להתנתק?
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirm}
                >
                  <Text style={styles.buttonText}>כן</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                >
                  <Text style={styles.buttonText}>לא</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  Hader: {
    flex: 2,
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
    alignSelf: I18nManager.isRTL ? "flex-start" : "flex-end",
    justifyContent: "center",
    left: I18nManager.isRTL ? 20 : -20,
    top: 10,
  },
  userName: {
    fontSize: 30,
    color: "#1A2540",
    fontWeight: "bold",
  },
  mail: {
    fontSize: 18,
    color: "#7E7D83",
  },
  ItemsSeparator: {
    height: 1.5,
    width: width * 0.9,
    alignSelf: "center",
    backgroundColor: "#EBEDF5",
  },
  optionView: {
    flex: 8,
  },
  option: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 50,
    marginTop: 30,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 25,
  },
  text: {
    fontSize: 25,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
  },
  confirmButton: {
    backgroundColor: "#ED2027",
    borderRadius: 10,
    width: 50,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginHorizontal: 15,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    borderRadius: 10,
    width: 50,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginHorizontal: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MenuScreen;
