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

const getAllOrdersList = async (data) => {
  try {
    const CARDCODE = data.CARDCODE ? data.CARDCODE : "";
    const STARTDATE = data.STARTDATE ? data.STARTDATE : "";
    const ENDDATE = data.ENDDATE ? data.ENDDATE : "";
    const CARDNAME = data.CARDNAME ? data.CARDNAME : "";
    const PAGE_SIZE = data.PAGE_SIZE ? data.PAGE_SIZE : 50;
    const PAGE_NUMBER = data.PAGE_NUMBER ? data.PAGE_NUMBER : 1;
    console.log("====================================");
    console.log("CARDCODE = ", CARDCODE);
    console.log("STARTDATE = ", STARTDATE);
    console.log("ENDDATE = ", ENDDATE);
    console.log("CARDNAME = ", CARDNAME);
    console.log("PAGE_SIZE = ", PAGE_SIZE);
    console.log("PAGE_NUMBER = ", PAGE_NUMBER);
    console.log("====================================");

    let response = await axios.get(
      `http://app.record.a-zuzit.co.il:8085/order/data/getAllOrdersList`,
      {
        params: {
          CARDCODE,
          STARTDATE,
          ENDDATE,
          CARDNAME,
          PAGE_SIZE,
          PAGE_NUMBER,
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

const getAppOrderByDocNum = async (data) => {
  try {
    const DOCNUM = data.DOCNUM ? data.DOCNUM : "";

    let response = await axios.get(
      `http://app.record.a-zuzit.co.il:8085/order/data/getAppOrderByDocNum`,
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
    console.error("Error during getAppOrderByDocNum request:", error.message);
    return [];
  }
};
const ordersModel = {
  getOrdersList,
  getItemsByDocNum,
  getAllOrdersList,
  getAppOrderByDocNum,
};

export default ordersModel;
