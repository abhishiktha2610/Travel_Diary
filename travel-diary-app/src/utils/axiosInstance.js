import axios from "axios";
import { BASE_URL } from "./constants";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    if (error.response) {
      // Server responded with a status code outside 2xx
      console.error("API Error:", error.response.data);
      // Handle specific HTTP error codes here (401, 403, etc.)
      if (error.response.status === 401) {
        // Token expired or invalid
        console.error("Unauthorized access. Please login again.");
      }
    } else if (error.request) {
      // No response received
      console.error("Network Error:", error.request);
    } else {
      // Other errors (e.g., setup or configuration errors)
      console.error("Request Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
