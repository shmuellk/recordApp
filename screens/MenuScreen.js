import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign"; // Using Ionicons for the left arrow
const { width, height } = Dimensions.get("window");
const MenuScreen = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { userData } = route.params;

  console.log("====================================");
  console.log(userData);
  console.log("====================================");

  const handleConfirm = () => {
    setModalVisible(false); // Close the modal
    navigation.navigate("PrevLog"); // Perform the navigation action
  };

  const handleCancel = () => {
    setModalVisible(false); // Just close the modal
  };
  return (
    <View style={styles.container}>
      {/* כותרת עליונה */}
      <View style={styles.header}>
        <Image
          style={styles.image}
          source={require("../assets/PageLogo.png")}
        />
      </View>

      {/* כרטיס פרופיל */}
      <View style={styles.profileCard}>
        {/* תמונת פרופיל */}
        {/* <Image
          source={{ uri: "https://via.placeholder.com/80" }}
          style={styles.profileImage}
        /> */}

        <Text style={styles.name}>שלום {userData.U_VIEW_NAME}</Text>
        {/* <Text style={styles.email}>1234@gmail.com</Text> */}

        {/* כפתורי פעולה */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate("FavoritsScreen", { userData: userData })
            }
          >
            <Text style={styles.actionText}>מועדפים</Text>
            <Icon name="staro" size={22} color="red" style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate("ArmorScreen", { userData: userData })
            }
          >
            <Text style={styles.actionText}>שריונים</Text>
            <Icon name="book" size={22} color="red" style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate("ContactScreen", { userData: userData })
            }
          >
            <Text style={styles.actionText}>צור קשר</Text>
            <Icon name="phone" size={22} color="red" style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.actionText}>התנתק</Text>
            <Icon name="logout" size={22} color="red" style={styles.icon} />
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
    </View>
  );
};

// גודל המסך למקרים שנרצה להשתמש בפרופורציות

// יצירת גליון הסגנונות
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    // במידה ויש צורך ליישר הכל RTL ידנית (אם לא משתמשים ב־I18nManager):
    // flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  header: {
    backgroundColor: "#f9f9f9",
    paddingVertical: 20,
    alignItems: "center", // מרכז כותרת
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 5,
  },
  headerSubtitle: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.8,
  },
  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 40, // כדי לעלות את הכרטיס על ההדר
    borderRadius: 10,
    alignItems: "center",
    padding: 20,
    // צל (Shadow) ל-iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // צל (Shadow) לאנדרואיד
    elevation: 2,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // עיגול
    marginTop: -60, // תופס מקום כדי 'לצאת' מחוץ לכרטיס
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#ccc",
  },
  name: {
    fontSize: 20,
    color: "#1A2540",
    marginBottom: 5,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#777",
  },
  actions: {
    marginTop: 20,
    width: "100%",
  },
  actionButton: {
    // במידה ו־RTL:
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EBEDF5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 5,
  },
  actionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  actionIcon: {
    fontSize: 22,
    color: "#ED2027",
    marginHorizontal: 10,
    width: 30,
    textAlign: "center",
  },

  image: {
    maxHeight: "100%",
    maxWidth: "100%",
    height: height * 0.05,
    resizeMode: "contain",
    marginTop: 40,
    alignSelf: "center",
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
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
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
});

export default MenuScreen;
