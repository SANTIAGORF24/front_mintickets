import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://backendmintickets-production.up.railway.app/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default AxiosInstance;
