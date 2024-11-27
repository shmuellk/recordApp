import axios from "axios";
import { IP } from "@env";

const getCarInfo = async (carNumber) => {
  try {
    const CARNUMBER = carNumber;
    let response = await axios.get(`${IP}/cars/serchCarNumber/`, {
      params: { CARNUMBER },
    });

    if (response.status === 200) {
      return response.data.result;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getItemCode request:", error.message);
    return null;
  }
};

const getProdactsByCar = async (data) => {
  try {
    const MANUFACTURER = data.MANUFACTURER ? data.MANUFACTURER : "";
    const MODEL = data.MODEL ? data.MODEL : "";
    const MANUFACTURE_YEAR = data.MANUFACTURE_YEAR ? data.MANUFACTURE_YEAR : "";
    const ENGINE_MODEL = data.ENGINE_MODEL ? data.ENGINE_MODEL : "";
    const CAPACITY = data.CAPACITY ? data.CAPACITY : "";
    const GAS = data.GAS ? data.GAS : "";
    const GEAR = data.GEAR ? data.GEAR : "";
    const PROPULSION = data.PROPULSION ? data.PROPULSION : "";
    const DOORS = data.DOORS ? data.DOORS : "";
    const BODY = data.BODY ? data.BODY : "";
    const YEAR_LIMIT = data.YEAR_LIMIT ? data.YEAR_LIMIT : "";
    const NOTE = data.NOTE ? data.NOTE : "";

    let response = await axios.get(`${IP}/cars/FindProductsByCar/`, {
      params: {
        MANUFACTURER,
        MODEL,
        MANUFACTURE_YEAR,
        ENGINE_MODEL,
        CAPACITY,
        GAS,
        GEAR,
        PROPULSION,
        DOORS,
        BODY,
        YEAR_LIMIT,
        NOTE,
      },
    });

    if (response.status === 200) {
      return response.data.result;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getItemCode request:", error.message);
    return null;
  }
};

const getCategorisByCar = async (data) => {
  try {
    const MANUFACTURER = data.MANUFACTURER ? data.MANUFACTURER : "";
    const MODEL = data.MODEL ? data.MODEL : "";
    const MANUFACTURE_YEAR = data.MANUFACTURE_YEAR ? data.MANUFACTURE_YEAR : "";
    const ENGINE_MODEL = data.ENGINE_MODEL ? data.ENGINE_MODEL : "";
    const CAPACITY = data.CAPACITY ? data.CAPACITY : "";
    const GAS = data.GAS ? data.GAS : "";
    const GEAR = data.GEAR ? data.GEAR : "";
    const PROPULSION = data.PROPULSION ? data.PROPULSION : "";
    const DOORS = data.DOORS ? data.DOORS : "";
    const BODY = data.BODY ? data.BODY : "";
    const YEAR_LIMIT = data.YEAR_LIMIT ? data.YEAR_LIMIT : "";
    const NOTE = data.NOTE ? data.NOTE : "";

    let response = await axios.get(`${IP}/cars/FindCategorisByCar/`, {
      params: {
        MANUFACTURER,
        MODEL,
        MANUFACTURE_YEAR,
        ENGINE_MODEL,
        CAPACITY,
        GAS,
        GEAR,
        PROPULSION,
        DOORS,
        BODY,
        YEAR_LIMIT,
        NOTE,
      },
    });

    if (response.status === 200) {
      return response.data.result;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getItemCode request:", error.message);
    return null;
  }
};

const getProdactsByPARENT_GROUP = async (data) => {
  try {
    const MANUFACTURER = data.MANUFACTURER ? data.MANUFACTURER : "";
    const MODEL = data.MODEL ? data.MODEL : "";
    const MANUFACTURE_YEAR = data.MANUFACTURE_YEAR ? data.MANUFACTURE_YEAR : "";
    const ENGINE_MODEL = data.ENGINE_MODEL ? data.ENGINE_MODEL : "";
    const CAPACITY = data.CAPACITY ? data.CAPACITY : "";
    const GAS = data.GAS ? data.GAS : "";
    const GEAR = data.GEAR ? data.GEAR : "";
    const PROPULSION = data.PROPULSION ? data.PROPULSION : "";
    const DOORS = data.DOORS ? data.DOORS : "";
    const BODY = data.BODY ? data.BODY : "";
    const YEAR_LIMIT = data.YEAR_LIMIT ? data.YEAR_LIMIT : "";
    const NOTE = data.NOTE ? data.NOTE : "";
    const PARENT_GROUP = data.PARENT_GROUP ? data.PARENT_GROUP : "";

    let response = await axios.get(`${IP}/cars/FindProductsByPARENT_GROUP/`, {
      params: {
        MANUFACTURER,
        MODEL,
        MANUFACTURE_YEAR,
        ENGINE_MODEL,
        CAPACITY,
        GAS,
        GEAR,
        PROPULSION,
        DOORS,
        BODY,
        YEAR_LIMIT,
        NOTE,
        PARENT_GROUP,
      },
    });

    if (response.status === 200) {
      return response.data.result;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getItemCode request:", error.message);
    return null;
  }
};

const getProdactsByITEM_GROUP = async (data) => {
  try {
    const MANUFACTURER = data.MANUFACTURER ? data.MANUFACTURER : "";
    const MODEL = data.MODEL ? data.MODEL : "";
    const MANUFACTURE_YEAR = data.MANUFACTURE_YEAR ? data.MANUFACTURE_YEAR : "";
    const ENGINE_MODEL = data.ENGINE_MODEL ? data.ENGINE_MODEL : "";
    const CAPACITY = data.CAPACITY ? data.CAPACITY : "";
    const GAS = data.GAS ? data.GAS : "";
    const GEAR = data.GEAR ? data.GEAR : "";
    const PROPULSION = data.PROPULSION ? data.PROPULSION : "";
    const DOORS = data.DOORS ? data.DOORS : "";
    const BODY = data.BODY ? data.BODY : "";
    const YEAR_LIMIT = data.YEAR_LIMIT ? data.YEAR_LIMIT : "";
    const NOTE = data.NOTE ? data.NOTE : "";
    const PARENT_GROUP = data.PARENT_GROUP ? data.PARENT_GROUP : "";
    const ITEM_GROUP = data.ITEM_GROUP ? data.ITEM_GROUP : "";

    let response = await axios.get(`${IP}/cars/FindProductsByITEM_GROUP/`, {
      params: {
        MANUFACTURER,
        MODEL,
        MANUFACTURE_YEAR,
        ENGINE_MODEL,
        CAPACITY,
        GAS,
        GEAR,
        PROPULSION,
        DOORS,
        BODY,
        YEAR_LIMIT,
        NOTE,
        PARENT_GROUP,
        ITEM_GROUP,
      },
    });

    if (response.status === 200) {
      return response.data.result;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getItemCode request:", error.message);
    return null;
  }
};
const carModel = {
  getCarInfo,
  getProdactsByCar,
  getCategorisByCar,
  getProdactsByPARENT_GROUP,
  getProdactsByITEM_GROUP,
};

export default carModel;
