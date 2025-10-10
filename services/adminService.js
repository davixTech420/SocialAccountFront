import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { router} from "expo-router"

const port = 3000;
const baseURL = "http://localhost:" + port + "/admin";
/* const baseURL = "https://preferred-bridgette-datech-4537e683.koyeb.app/admin"; */
// Helpers para manejar el token de forma multiplataforma
const setToken = async (key, value) => {
  if (Platform.OS === "web") {
    await localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getToken = async (key) => {
  if (Platform.OS === "web") {
    return await localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const deleteToken = async (key) => {
  if (Platform.OS === "web") {
    await localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

// Función genérica para hacer peticiones al backend
const makeRequest = async (method, url, data = null) => {
  try {
    const token = await getToken("auth_token");
    if (!token) {
      throw new Error("No se encontró el token");
    }

    const config = {
      method,
      url: `${baseURL}${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("❌ Error en makeRequest:", error);
    throw error;
  }
};

export { makeRequest, setToken, getToken, deleteToken };



export const getUsers = async () => {
  return await makeRequest("GET", "/users");
}
export const createUser = async (user) => {
  return await makeRequest("POST", "/users", user);
}
export const updateUser = async (id, user) => {
  return await makeRequest("PUT", `/users/${id}`, user);
}
export const deleteUser = async (id) => {
  return await makeRequest("DELETE", `/users/${id}`);
}


export const getCredentials = async () => {
  return await makeRequest("GET", "/credentials");
}
export const createCredentials = async (credential) => {
  return await makeRequest("POST", "/credentials", credential);
}
export const updateCredentials = async (id, credential) => {
  return await makeRequest("PUT", `/credentials/${id}`, credential);
}
export const deleteCredentials = async (id) => {
  return await makeRequest("DELETE", `/credentials/${id}`);
}


export const loginGoogle = async () => {
  router.push("https://preferred-bridgette-datech-4537e683.koyeb.app/auth");
}

export const uploadVideoToServer = async (data) => {
  try {
   const token = await getToken("auth_token");
    if (!token) {
      throw new Error("No se encontró el token");
    }
    const response = await axios.post(`https://preferred-bridgette-datech-4537e683.koyeb.app/socialAccounts/upload-video`,data, {
      headers: {
        Authorization: `Bearer ${token}`,
        /* "Content-Type": "multipart/form-data", */
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};






