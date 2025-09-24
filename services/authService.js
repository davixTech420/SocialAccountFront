import axios from "axios";

/* const API = "https://datech.alwaysdata.net/SocialAccount"; */
const API = "http://192.168.0.111:3000";
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};


