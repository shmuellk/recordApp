import axios from "axios";

const IP = "http://128.140.125.244:8080";

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
    console.error("Error during getCarInfo request:", error.message);
    return null;
  }
};

const getProdactsByCar = async (data) => {
  try {
    const MANUFACTURER = data.MANUFACTURER ? data.MANUFACTURER : "";
    const MODEL = data.MODEL ? data.MODEL : "";
    const MANUFACTURE_YEAR = data.MANUFACTURE_YEAR ? data.MANUFACTURE_YEAR : "";
    const ENGINE_MODEL = data.ENGINE_MODEL ? data.ENGINE_MODEL : "";
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
    console.error("Error during getProdactsByCar request:", error.message);
    return null;
  }
};

const getCategorisByCar = async (data) => {
  try {
    const MANUFACTURER = data.MANUFACTURER ? data.MANUFACTURER : "";
    const MODEL = data.MODEL ? data.MODEL : "";
    const MANUFACTURE_YEAR = data.MANUFACTURE_YEAR ? data.MANUFACTURE_YEAR : "";
    const ENGINE_MODEL = data.ENGINE_MODEL ? data.ENGINE_MODEL : "";
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
    console.error("Error during getCategorisByCar request:", error.message);
    return null;
  }
};

const getProdactsByPARENT_GROUP = async (data) => {
  try {
    const MANUFACTURER = data.MANUFACTURER ? data.MANUFACTURER : "";
    const MODEL = data.MODEL ? data.MODEL : "";
    const MANUFACTURE_YEAR = data.MANUFACTURE_YEAR ? data.MANUFACTURE_YEAR : "";
    const ENGINE_MODEL = data.ENGINE_MODEL ? data.ENGINE_MODEL : "";
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
    console.error(
      "Error during getProdactsByPARENT_GROUP request:",
      error.message
    );
    return null;
  }
};

const getProdactsByITEM_GROUP = async (data) => {
  try {
    const MANUFACTURER = data.MANUFACTURER ? data.MANUFACTURER : "";
    const MODEL = data.MODEL ? data.MODEL : "";
    const MANUFACTURE_YEAR = data.MANUFACTURE_YEAR ? data.MANUFACTURE_YEAR : "";
    const ENGINE_MODEL = data.ENGINE_MODEL ? data.ENGINE_MODEL : "";
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
    console.error(
      "Error during getProdactsByITEM_GROUP request:",
      error.message
    );
    return null;
  }
};

const ProdactsByCHILD_GROUP = async (data) => {
  try {
    const MANUFACTURER = data.MANUFACTURER ? data.MANUFACTURER : "";
    const MODEL = data.MODEL ? data.MODEL : "";
    const MANUFACTURE_YEAR = data.MANUFACTURE_YEAR ? data.MANUFACTURE_YEAR : "";
    const ENGINE_MODEL = data.ENGINE_MODEL ? data.ENGINE_MODEL : "";
    const GEAR = data.GEAR ? data.GEAR : "";
    const PROPULSION = data.PROPULSION ? data.PROPULSION : "";
    const DOORS = data.DOORS ? data.DOORS : "";
    const BODY = data.BODY ? data.BODY : "";
    const YEAR_LIMIT = data.YEAR_LIMIT ? data.YEAR_LIMIT : "";
    const NOTE = data.NOTE ? data.NOTE : "";
    const PARENT_GROUP = data.PARENT_GROUP ? data.PARENT_GROUP : "";
    const ITEM_GROUP = data.ITEM_GROUP ? data.ITEM_GROUP : "";
    const CHILD_GROUP = data.CHILD_GROUP ? data.CHILD_GROUP : "";

    let response = await axios.get(`${IP}/cars/FindProductsByCHILD_GROUP/`, {
      params: {
        MANUFACTURER,
        MODEL,
        MANUFACTURE_YEAR,
        ENGINE_MODEL,
        GEAR,
        PROPULSION,
        DOORS,
        BODY,
        YEAR_LIMIT,
        NOTE,
        PARENT_GROUP,
        ITEM_GROUP,
        CHILD_GROUP,
      },
    });

    if (response.status === 200) {
      return response.data.result;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during ProdactsByCHILD_GROUP request:", error.message);
    return null;
  }
};

const getProdactsById = async (data) => {
  try {
    const CATALOG_NUMBER = data.CATALOG_NUMBER ? data.CATALOG_NUMBER : "";
    let response = await axios.get(`${IP}/cars/FindProductsById/`, {
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
    console.error("Error during getProdactsById request:", error.message);
    return null;
  }
};

const getInfoBySKU = async (data) => {
  try {
    const CATALOG_NUMBER = data.CATALOG_NUMBER ? data.CATALOG_NUMBER : "";
    const CHILD_GROUP = data.CHILD_GROUP ? data.CHILD_GROUP : "";
    const DESCRIPTION_NOTE = data.DESCRIPTION_NOTE ? data.DESCRIPTION_NOTE : "";

    let response = await axios.get(`${IP}/cars/getInfoBySKU/`, {
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
      return null;
    }
  } catch (error) {
    console.error("Error during getInfoBySKU request:", error.message);
    return null;
  }
};

const carModel = {
  getCarInfo,
  getProdactsByCar,
  getCategorisByCar,
  getProdactsByPARENT_GROUP,
  getProdactsByITEM_GROUP,
  ProdactsByCHILD_GROUP,
  getProdactsById,
  getInfoBySKU,
};

export default carModel;
