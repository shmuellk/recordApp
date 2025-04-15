import axios from "axios";
const IP = "https://api.recordltd.co.il";

const getAllClient = async (data) => {
  try {
    let response = await axios.get(
      `http://app.record.a-zuzit.co.il:8085/client/getAllClient`
    );

    if (response.status === 200) {
      const result = response.data.items.map((item) => item.CardName);
      return result;
    } else {
      console.error("Unexpected status code:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error during getAllClient request:", error.message);
    return [];
  }
};

const ItemCardModel = {
  getAllClient,
};

export default ItemCardModel;
