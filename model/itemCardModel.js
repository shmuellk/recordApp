import axios from "axios";
const IP = "http://128.140.125.244:8080";

const getItemBrand = async (data) => {
  try {
    const CATALOG_NUMBER = data.CATALOG_NUMBER ? data.CATALOG_NUMBER : "";
    const CHILD_GROUP = data.CHILD_GROUP ? data.CHILD_GROUP : "";
    const DESCRIPTION_NOTE = data.DESCRIPTION_NOTE ? data.DESCRIPTION_NOTE : "";
    let response = await axios.get(`${IP}/itemCard/getItemBrand/`, {
      params: {
        CATALOG_NUMBER,
        CHILD_GROUP,
        DESCRIPTION_NOTE,
      },
    });

    if (response.status === 200) {
      return response.data.result;
    } else {
      console.error("Unexpected status code:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error during getItemBrand request:", error.message);
    return [];
  }
};

const getItemBrandByCar = async (data) => {
  try {
    const PARENT_GROUP = data.PARENT_GROUP ? data.PARENT_GROUP : "";
    const ITEM_GROUP = data.ITEM_GROUP ? data.ITEM_GROUP : "";
    const CHILD_GROUP = data.CHILD_GROUP ? data.CHILD_GROUP : "";
    const MANUFACTURER = data.MANUFACTURER ? data.MANUFACTURER : "";
    const MODEL = data.MODEL ? data.MODEL : "";
    const CAPACITY = data.CAPACITY ? data.CAPACITY : "";
    const FROM_YEAR = data.FROM_YEAR ? data.FROM_YEAR : "";
    const UNTIL_YEAR = data.UNTIL_YEAR ? data.UNTIL_YEAR : "";
    const YEAR_LIMIT = data.YEAR_LIMIT ? data.YEAR_LIMIT : "";
    const CAR_NOTE = data.CAR_NOTE ? data.CAR_NOTE : "";
    const DESCRIPTION_NOTE = data.DESCRIPTION_NOTE ? data.DESCRIPTION_NOTE : "";
    let response = await axios.get(`${IP}/itemCard/getItemBrandByCar/`, {
      params: {
        PARENT_GROUP,
        ITEM_GROUP,
        CHILD_GROUP,
        MANUFACTURER,
        MODEL,
        CAPACITY,
        FROM_YEAR,
        UNTIL_YEAR,
        YEAR_LIMIT,
        CAR_NOTE,
        DESCRIPTION_NOTE,
      },
    });

    if (response.status === 200) {
      return response.data.result;
    } else {
      console.error("Unexpected status code:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error during getItemBrandByCar request:", error.message);
    return [];
  }
};

const getCarsByItem = async (data) => {
  try {
    const CATALOG_NUMBER = data.CATALOG_NUMBER ? data.CATALOG_NUMBER : "";
    let response = await axios.get(`${IP}/itemCard/getCarsByItem/`, {
      params: {
        CATALOG_NUMBER,
      },
    });

    if (response.status === 200) {
      return response.data.result;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getCarsByItem request:", error.message);
    return null;
  }
};
const getAlternativeSkus = async (data) => {
  try {
    const CATALOG_NUMBER = data.CATALOG_NUMBER ? data.CATALOG_NUMBER : "";
    console.log("====================================");
    console.log("CATALOG_NUMBER : " + CATALOG_NUMBER);
    console.log("====================================");
    let response = await axios.get(`${IP}/itemCard/getAlternativeSkus/`, {
      params: {
        CATALOG_NUMBER,
      },
    });
    console.log("====================================");
    console.log(
      "response.data.result : " + JSON.stringify(response.data.result)
    );
    console.log("====================================");

    if (response.status === 200) {
      const result = response.data.result;

      // Check if 'alternative_skus' exists and is a string
      const alternativeSkusString = result[0]?.alternative_skus || "";

      // Split the string, clean the data, and map it to objects
      const alternativeSkusArray = alternativeSkusString
        .split(",") // Split by commas
        .filter((sku) => sku.trim() !== "") // Remove empty strings
        .map((sku) => ({ SKU: sku.trim() })); // Map to objects with key 'SKU'
      return alternativeSkusArray;
    } else {
      console.error("Unexpected status code:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error during getAlternativeSkus request:", error.message);
    return [];
  }
};

const getRecentShopping = async (data) => {
  try {
    const CATALOG_NUMBER = data.CATALOG_NUMBER ? data.CATALOG_NUMBER : "";
    let response = await axios.get(
      `http://app.record.a-zuzit.co.il:8085/cars/serch/`,
      {
        params: {
          CATALOG_NUMBER,
        },
      }
    );

    if (response.status === 200) {
      return response.data.items;
    } else {
      console.error("Unexpected status code:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error during getRecentShopping request:", error.message);
    return [];
  }
};

const ItemCardModel = {
  getItemBrand,
  getCarsByItem,
  getAlternativeSkus,
  getRecentShopping,
  getItemBrandByCar,
};

export default ItemCardModel;
