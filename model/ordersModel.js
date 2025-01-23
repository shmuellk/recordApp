import axios from "axios";
const IP = "http://128.140.125.244:8080";

const getOrdersList = async (data) => {
  try {
    const CARDCODE = data.CARDCODE ? data.CARDCODE : "";
    const STARTDATE = data.STARTDATE ? data.STARTDATE : "";
    const ENDDATE = data.ENDDATE ? data.ENDDATE : "";
    const DELIVERYSTTS = data.DELIVERYSTTS ? data.DELIVERYSTTS : "";

    let response = await axios.get(
      `http://app.record.a-zuzit.co.il:8085/order/data/getOrdersList`,
      {
        params: {
          CARDCODE,
          STARTDATE,
          ENDDATE,
          DELIVERYSTTS,
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
    console.error("Error during OrdersList request:", error.message);
    return [];
  }
};

const getItemsByDocNum = async (data) => {
  try {
    const DOCNUM = data.DOCNUM ? data.DOCNUM : "";

    let response = await axios.get(
      `http://app.record.a-zuzit.co.il:8085/order/data/getItemsByDocNum`,
      {
        params: {
          DOCNUM,
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
    console.error("Error during ItemsByDocNum request:", error.message);
    return [];
  }
};

const ordersModel = {
  getOrdersList,
  getItemsByDocNum,
};

export default ordersModel;
