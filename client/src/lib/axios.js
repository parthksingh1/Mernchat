import axios from "axios";

// In development: use localhost
// In production: use VITE_API_URL env variable (set in Vercel) OR same origin
const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : import.meta.env.VITE_API_URL || "/api";

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

