import axios from "axios";
import Constants from "expo-constants";

// -------------------------------
// Base URL from app.config.js
// -------------------------------
const API_URL = Constants.expoConfig?.extra?.API_URL;

if (!API_URL) {
  console.warn("⚠️ API_URL is not defined in app.config.js or .env");
}

// -------------------------------
// Axios Instance
// -------------------------------
export const api = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// -------------------------------
// Interceptors (Optional but recommended)
// -------------------------------

// Request interceptor (can add auth headers later)
api.interceptors.request.use(
  (config) => {
    // Example: Add token later if needed
    // const token = authStore.getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle API errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        "❌ API Error:",
        error.response.status,
        error.response.data
      );
    } else {
      console.error("❌ Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);
