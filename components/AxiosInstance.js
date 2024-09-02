// axiosInstance.js
import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://backendmintickets-production.up.railway.app/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json, text/plain, */*",
    Referer: "https://mintickets.up.railway.app/",
    "Sec-CH-UA":
      '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
    "Sec-CH-UA-Mobile": "?0",
    "Sec-CH-UA-Platform": '"Windows"',
  },
  withCredentials: true, // Asegura que las cookies y credenciales se envíen con la solicitud si es necesario
});

export default AxiosInstance;
