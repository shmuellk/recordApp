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
  const status = data.status ? data.status : "";

  try {
    const response = await axios.get(`${IP}/cart/addItemToCart`, {
      params: {
        userName,
        cardCode,
        item_code,
        amountToBy,
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

const deleteItemFromCart = async (data) => {
  const cardCode = data.U_CARD_CODE ? data.U_CARD_CODE : "";
  const userName = data.U_USER_NAME ? data.U_USER_NAME : "";
  console.log("====================================");
  console.log("data = " + JSON.stringify(data));
  console.log("====================================");
  console.log("Deleting cart item:", { userName, cardCode });
  try {
    const response = await axios.delete(`${IP}/cart/deleteItemFromCart`, {
      params: {
        userName,
        cardCode,
      },
    });

    if (response.status === 200) {
      return response;
    } else {
      console.error("Unexpected status code:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error during deleteItemFromCart request:", error);
    return [];
  }
};

const cartModel = {
  getCartList,
  addItemToCart,
  deleteItemFromCart,
};

export default cartModel;
