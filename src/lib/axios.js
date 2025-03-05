import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3030/api/v1",
  timeout: 10000,
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accesstoken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosInstance;
