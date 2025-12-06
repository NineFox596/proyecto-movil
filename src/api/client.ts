import axios from "axios";
import Constants from "expo-constants";

// Obtener la URL del .env (inyectada por app.config.js)
const API_URL = Constants.expoConfig?.extra?.API_URL as string; 

console.log("API_URL cargada:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos
});

export default api;
