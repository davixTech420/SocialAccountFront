import axios from "axios";

/* const API = "https://datech.alwaysdata.net/SocialAccount"; */
const API = "http://localhost:3000";
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};


