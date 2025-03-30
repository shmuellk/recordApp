import axios from "axios";
const IP = "http://128.140.125.244:8080";
const IP2 = "http://app.record.a-zuzit.co.il:8085";

const getManufacturer = async () => {
  try {
    let response = await axios.get(`${IP}/filter/getAllManufacturer`);
    if (response.status === 200) {
      const manufacturers = response.data.result.map(
        (item) => item.MANUFACTURER
      );
      return manufacturers;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getManufacturer request:", error.message);
    return null;
  }
};

const getAllModel = async (data) => {
  const MANUFACTURER = data.MANUFACTURER;
  try {
    let response = await axios.get(`${IP}/filter/getAllModel`, {
      params: {
        Manufacturer: MANUFACTURER,
      },
    });
    if (response.status === 200) {
      const models = response.data.result.map((item) => item.model);
      return models;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getAllModel request:", error.message);
    return null;
  }
};
const getAllmanufactureYear = async (data) => {
  const MANUFACTURER = data.MANUFACTURER;
  const MODEL = data.MODEL;
  try {
    let response = await axios.get(`${IP}/filter/getAllmanufactureYear`, {
      params: {
        MANUFACTURER,
        MODEL,
      },
    });
    if (response.status === 200) {
      const manufacture_year = response.data.result.map(
        (item) => item.manufacture_year
      );
      return manufacture_year;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getAllmanufactureYear request:", error.message);
    return null;
  }
};
const getAllEngineModel = async (data) => {
  const MANUFACTURER = data.MANUFACTURER;
  const MODEL = data.MODEL;
  const MANUFACTURE_YEAR = data.MANUFACTURE_YEAR;
  try {
    let response = await axios.get(`${IP}/filter/getAllEngineModel`, {
      params: {
        MANUFACTURER,
        MODEL,
        MANUFACTURE_YEAR,
      },
    });
    if (response.status === 200) {
      const engine_model = response.data.result.map(
        (item) => item.engine_model
      );
      return engine_model;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getAllEngineModel request:", error.message);
    return null;
  }
};
const getAllCapacity = async (data) => {
  const MANUFACTURER = data.MANUFACTURER;
  const MODEL = data.MODEL;
  const MANUFACTURE_YEAR = data.MANUFACTURE_YEAR;
  const ENGINE_MODEL = data.ENGINE_MODEL;
  try {
    let response = await axios.get(`${IP}/filter/getAllCapacity`, {
      params: {
        MANUFACTURER,
        MODEL,
        MANUFACTURE_YEAR,
        ENGINE_MODEL,
      },
    });
    if (response.status === 200) {
      const Capacity = response.data.result.map((item) => item.Capacity);
      return Capacity;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getAllCapacity request:", error.message);
    return null;
  }
};
const getAllGas = async (data) => {
  const MANUFACTURER = data.MANUFACTURER;
  const MODEL = data.MODEL;
  const MANUFACTURE_YEAR = data.MANUFACTURE_YEAR;
  const ENGINE_MODEL = data.ENGINE_MODEL;
  const CAPACITY = data.CAPACITY;
  try {
    let response = await axios.get(`${IP}/filter/getAllGas`, {
      params: {
        MANUFACTURER,
        MODEL,
        MANUFACTURE_YEAR,
        ENGINE_MODEL,
        CAPACITY,
      },
    });
    if (response.status === 200) {
      const gas = response.data.result.map((item) => item.gas);
      return gas;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getAllGas request:", error.message);
    return null;
  }
};
const getAllGear = async (data) => {
  const MANUFACTURER = data.MANUFACTURER;
  const MODEL = data.MODEL;
  const MANUFACTURE_YEAR = data.MANUFACTURE_YEAR;
  const ENGINE_MODEL = data.ENGINE_MODEL;
  const CAPACITY = data.CAPACITY;
  const GAS = data.GAS;
  try {
    let response = await axios.get(`${IP}/filter/getAllGear`, {
      params: {
        MANUFACTURER,
        MODEL,
        MANUFACTURE_YEAR,
        ENGINE_MODEL,
        CAPACITY,
        GAS,
      },
    });
    if (response.status === 200) {
      const gear = response.data.result.map((item) => item.gear);
      return gear;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getAllGear request:", error.message);
    return null;
  }
};
const getAllPropulsion = async (data) => {
  const MANUFACTURER = data.MANUFACTURER;
  const MODEL = data.MODEL;
  const MANUFACTURE_YEAR = data.MANUFACTURE_YEAR;
  const ENGINE_MODEL = data.ENGINE_MODEL;
  const CAPACITY = data.CAPACITY;
  const GAS = data.GAS;
  const GEAR = data.GEAR;
  try {
    let response = await axios.get(`${IP}/filter/getAllPropulsion`, {
      params: {
        MANUFACTURER,
        MODEL,
        MANUFACTURE_YEAR,
        ENGINE_MODEL,
        CAPACITY,
        GAS,
        GEAR,
      },
    });
    if (response.status === 200) {
      const Propulsion = response.data.result.map((item) => item.Propulsion);
      return Propulsion;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getAllPropulsion request:", error.message);
    return null;
  }
};
const getAllDoors = async (data) => {
  const MANUFACTURER = data.MANUFACTURER;
  const MODEL = data.MODEL;
  const MANUFACTURE_YEAR = data.MANUFACTURE_YEAR;
  const ENGINE_MODEL = data.ENGINE_MODEL;
  const CAPACITY = data.CAPACITY;
  const GAS = data.GAS;
  const GEAR = data.GEAR;
  const PROPULSION = data.PROPULSION;
  try {
    let response = await axios.get(`${IP}/filter/getAllDoors`, {
      params: {
        MANUFACTURER,
        MODEL,
        MANUFACTURE_YEAR,
        ENGINE_MODEL,
        CAPACITY,
        GAS,
        GEAR,
        PROPULSION,
      },
    });
    if (response.status === 200) {
      const doors = response.data.result.map((item) => item.doors);
      return doors;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getAllDoors request:", error.message);
    return null;
  }
};
const getAllBooy = async (data) => {
  const MANUFACTURER = data.MANUFACTURER;
  const MODEL = data.MODEL;
  const MANUFACTURE_YEAR = data.MANUFACTURE_YEAR;
  const ENGINE_MODEL = data.ENGINE_MODEL;
  const CAPACITY = data.CAPACITY;
  const GAS = data.GAS;
  const GEAR = data.GEAR;
  const PROPULSION = data.PROPULSION;
  const DOORS = data.DOORS;
  try {
    let response = await axios.get(`${IP}/filter/getAllBooy`, {
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
      },
    });
    if (response.status === 200) {
      const body = response.data.result.map((item) => item.body);
      return body;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getAllBooy request:", error.message);
    return null;
  }
};

const getAlternativeSKU = async (data) => {
  const SKU = data.SKU;
  try {
    let response = await axios.get(`${IP}/filter/getAlternativeSKU`, {
      params: {
        SKU,
      },
    });
    if (response.status === 200) {
      let tempArray = response.data.result
        .map((item) => item.result_value.split(",")) // Split each result_value by commas
        .flat() // Flatten the nested arrays into one array
        .map((item) => item.trim()) // Remove any extra spaces around items
        .filter(
          (item, index, self) =>
            self.findIndex((i) => i.toLowerCase() === item.toLowerCase()) ===
            index // Ensure distinct (case-insensitive)
        )
        .filter((item) => item.toLowerCase().includes(SKU.toLowerCase()))
        .sort(); // Case-insensitive filtering
      return tempArray;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getAlternativeSKU request:", error.message);
    return null;
  }
};

const getComplitSerch = async (data) => {
  const search_value = data.search_value;
  try {
    let response = await axios.get(`${IP}/filter/getComplitSerch`, {
      params: {
        search_value,
      },
    });
    if (response.status === 200) {
      let tempArray = response.data.result
        .map((item) => item.result_value.split(",")) // Split each result_value by commas
        .flat() // Flatten the nested arrays into one array
        .map((item) => item.trim()) // Remove any extra spaces around items
        .filter(
          (item, index, self) =>
            self.findIndex((i) => i.toLowerCase() === item.toLowerCase()) ===
            index // Ensure distinct (case-insensitive)
        )
        .filter((item) =>
          item.toLowerCase().includes(search_value.toLowerCase())
        ) // Case-insensitive filtering
        .slice(0, 10); // Take the first 10 items

      console.log("====================================");
      console.log("tempArray : " + tempArray);
      console.log("====================================");
      return tempArray;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error during getAlternativeSKU request:", error.message);
    return null;
  }
};

const getAllDeliverys = async () => {
  try {
    let response = await axios.get(`${IP}/filter/getAllDeliverys`);

    return response.data.result;
  } catch (error) {
    console.error("Error fetching getShippingExitTime data:", error);
    return false;
  }
};

const getShippingExitTime = async (data) => {
  const search_value = data.search_value;
  try {
    let response = await axios.get(`${IP}/filter/getShippingExitTime`, {
      params: {
        search_value,
      },
    });
    return response.data.result; // Return the order array directly
  } catch (error) {
    console.error("Error fetching getShippingExitTime data:", error);
    return false;
  }
};

const filterModel = {
  getManufacturer,
  getAllModel,
  getAllmanufactureYear,
  getAllEngineModel,
  getAllCapacity,
  getAllGas,
  getAllGear,
  getAllPropulsion,
  getAllDoors,
  getAllBooy,
  getAlternativeSKU,
  getComplitSerch,
  getAllDeliverys,
  getShippingExitTime,
};
export default filterModel;
