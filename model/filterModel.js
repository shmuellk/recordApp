import axios from "axios";
const IP = "http://128.140.125.244:8080";

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
    console.error("Error during getItemCode request:", error.message);
    return null;
  }
};

const getAllModel = async (data) => {
  const MANUFACTURER = data.MANUFACTURER;
  try {
    let response = await axios.get(`${IP}/filter/getAllModel`, {
      params: {
        MANUFACTURER,
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
    console.error("Error during getItemCode request:", error.message);
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
    console.error("Error during getItemCode request:", error.message);
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
    console.error("Error during getItemCode request:", error.message);
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
    console.error("Error during getItemCode request:", error.message);
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
    console.error("Error during getItemCode request:", error.message);
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
    console.error("Error during getItemCode request:", error.message);
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
    console.error("Error during getItemCode request:", error.message);
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
    console.error("Error during getItemCode request:", error.message);
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
    console.error("Error during getItemCode request:", error.message);
    return null;
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
};
export default filterModel;
