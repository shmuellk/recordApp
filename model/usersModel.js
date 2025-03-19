import axios from "axios";
const IP = "http://128.140.125.244:8080";

const login = async (data) => {
  const userName = data.userName ? data.userName : "";
  const Password = data.Password ? data.Password : "";

  try {
    const response = await axios.get(`${IP}/users/logIn`, {
      params: {
        userName,
        Password,
      },
    });

    if (response.status === 200) {
      return response.data.result;
    } else {
      console.error("Unexpected status code:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error during login request:", error);
    return [];
  }
};

const getWhatsAppUsers = async () => {
  try {
    const response = await axios.get(`${IP}/users/getWhatsAppUsers`);

    if (response.status === 200) {
      return response.data.result;
    } else {
      console.error("Unexpected status code:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error during login request:", error);
    return [];
  }
};

const sendFailureEmail = async (data) => {
  try {
    const response = await axios.post(`${IP}/users/sendEmail`, data);

    if (response.status === 200) {
      console.log("Failure email sent successfully");
    } else {
      console.error("Unexpected status code:", response.status);
    }
  } catch (error) {
    console.error("Error sending failure email:", error);
  }
};

const getUserExistStatus = async (data) => {
  const U_CARD_CODE = data.U_CARD_CODE ? data.U_CARD_CODE : "";
  const U_USER_NAME = data.U_USER_NAME ? data.U_USER_NAME : "";

  console.log("====================================");
  console.log("getUserExistStatus U_CARD_CODE = " + U_CARD_CODE);
  console.log("getUserExistStatus U_USER_NAME = " + U_USER_NAME);
  console.log("====================================");

  try {
    const response = await axios.get(`${IP}/users/getUserExistStatus`, {
      params: {
        U_CARD_CODE,
        U_USER_NAME,
      },
    });

    if (response.status === 200) {
      if (response.data.result[0]) {
        return true;
      } else {
        return false;
      }
    } else {
      console.error("Unexpected status code:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error during getUserExistStatus request:", error);
    return false;
  }
};
const usersModel = {
  login,
  getWhatsAppUsers,
  sendFailureEmail,
  getUserExistStatus,
};

export default usersModel;
