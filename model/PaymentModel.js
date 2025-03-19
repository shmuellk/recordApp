import axios from "axios";
const IP = "http://128.140.125.244:8080";

const postNewOrder = async (data) => {
  console.log("====================================");
  console.log(data);
  console.log("====================================");
  try {
    let response = await axios.post(
      `http://app.record.a-zuzit.co.il/XIS_Record.SLWS/SAPB1_API/B1SLW/AddOrder`,
      data, // JSON data sent as the request body
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("====================================");
    console.log(response.data);
    console.log("====================================");

    if (response.status === 200) {
      return true;
    } else {
      console.error("Unexpected status code:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error during postNewOrder request:", error.message);
    return false;
  }
};

// const postNewOrder = async (data) => {
//   return false;
// };

const PaymentModel = {
  postNewOrder,
};

export default PaymentModel;
