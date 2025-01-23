import axios from "axios";
const IP = "http://128.140.125.244:8080";

const login = async (data) => {
  const userName = data.userName ? data.userName : "";
  const Password = data.Password ? data.Password : "";

  try {
    const response = await axios.get(`${IP}/users/logIn`, {
      params: {
        userName,
        Password,
      },
    });

    if (response.status === 200) {
      return response.data.result;
    } else {
      console.error("Unexpected status code:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error during login request:", error);
    return [];
  }
};

const usersModel = {
  login,
};

export default usersModel;
