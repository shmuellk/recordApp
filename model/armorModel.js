import axios from "axios";
const IP = "http://128.140.125.244:8080";

const getArmorsList = async (data) => {
  const userName = data.userName ? data.userName : "";
  const cardCode = data.cardCode ? data.cardCode : "";

  try {
    const response = await axios.get(`${IP}/armor/getArmorsList`, {
      params: {
        userName,
        cardCode,
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

const addItemToArmors = async (data) => {
  const userName = data.userName ? data.userName : "";
  const cardCode = data.cardCode ? data.cardCode : "";
  const item_code = data.item_code ? data.item_code : "";
  const status = data.status ? data.status : 0;

  try {
    const response = await axios.get(`${IP}/armor/addItemToArmors`, {
      params: {
        userName,
        cardCode,
        item_code,
        status,
      },
    });

    if (response.status === 200) {
      return true;
    } else {
      console.error("Unexpected status code:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error during login request:", error);
    return false;
  }
};

const updateArmorsList = async (data) => {
  const userName = data.userName ? data.userName : "";
  const cardCode = data.cardCode ? data.cardCode : "";
  const item_code = data.item_code ? data.item_code : "";
  const amountToArmor = data.amountToArmor ? data.amountToArmor : "";

  console.log("====================================");
  console.log("userName: " + userName);
  console.log("cardCode: " + cardCode);
  console.log("item_code: " + item_code);
  console.log("amountToArmor: " + amountToArmor);
  console.log("====================================");

  try {
    const response = await axios.get(`${IP}/armor/updateArmorsList`, {
      params: {
        userName,
        cardCode,
        item_code,
        amountToArmor,
      },
    });

    if (response.status === 200) {
      return [];
    } else {
      console.error("Unexpected status code:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error during login request:", error);
    return [];
  }
};

const getArmorsInStock = async (data) => {
  const userName = data.userName ? data.userName : "";
  const cardCode = data.cardCode ? data.cardCode : "";

  console.log("====================================");
  console.log("userName: " + userName);
  console.log("cardCode: " + cardCode);
  console.log("====================================");

  try {
    const response = await axios.get(`${IP}/armor/getArmorsInStock`, {
      params: {
        userName,
        cardCode,
      },
    });

    if (response.status === 200) {
      console.log("====================================");
      console.log("response.inStock = " + response.data.inStock);
      console.log("====================================");
      return response.data.inStock;
    } else {
      console.error("Unexpected status code:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error during login request:", error);
    return false;
  }
};
const cartModel = {
  getArmorsList,
  addItemToArmors,
  updateArmorsList,
  getArmorsInStock,
};

export default cartModel;
