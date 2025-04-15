import axios from "axios";
const IP = "https://api.recordltd.co.il";

const getAllSalesProdact = async (data) => {
  try {
    let response = await axios.get(
      `http://app.record.a-zuzit.co.il:8085/Salse/getAllSalesProdact`
    );

    console.log("====================================");
    console.log(response.data.order);
    console.log("====================================");

    if (response.status === 200) {
      return response.data.order;
    } else {
      // console.error("Unexpected status code:", response.status);
      return [];
    }
  } catch (error) {
    // console.error("Error during OrdersList request:", error.message);
    return [];
  }
};

const ordersModel = {
  getAllSalesProdact,
};

export default ordersModel;
