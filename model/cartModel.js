import axios from "axios";
const IP = "http://128.140.125.244:8080";

const getCartList = async (data) => {
  const userName = data.userName ? data.userName : "";
  const cardCode = data.cardCode ? data.cardCode : "";

  try {
    const response = await axios.get(`${IP}/cart/getCartList`, {
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

const addItemToCart = async (data) => {
  const userName = data.userName ? data.userName : "";
  const cardCode = data.cardCode ? data.cardCode : "";
  const item_code = data.item_code ? data.item_code : "";
  const amountToBy = data.amountToBy ? data.amountToBy : 0;

  console.log("====================================");
  console.log("userName : " + userName);
  console.log("cardCode : " + cardCode);
  console.log("item_code : " + item_code);
  console.log("amountToBy : " + amountToBy);
  console.log("====================================");

  try {
    const response = await axios.get(`${IP}/cart/addItemToCart`, {
      params: {
        userName,
        cardCode,
        item_code,
        amountToBy,
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

const cartModel = {
  getCartList,
  addItemToCart,
};

export default cartModel;
