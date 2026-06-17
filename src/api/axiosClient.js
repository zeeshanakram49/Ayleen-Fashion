import axios from "axios";
import { getToken, removeToken, removeUser } from "../services/tokenService";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      removeUser();

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("ayleen:unauthorized"));
        window.location.hash = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
