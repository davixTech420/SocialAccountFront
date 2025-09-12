import axios from "axios";

const API = "https://datech.alwaysdata.net/SocialAccount";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API}/login`, { email, password });
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};


