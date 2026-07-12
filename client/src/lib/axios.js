import axios from "axios";

// In development: use localhost
// In production: use VITE_API_URL env variable (set in Vercel) OR same origin
const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : import.meta.env.VITE_API_URL || "https://mernchat-xrmx.onrender.com/api";

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("chat_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

