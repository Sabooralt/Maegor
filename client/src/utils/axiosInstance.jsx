import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.43.248:5000/api",
});

export default axiosInstance;
