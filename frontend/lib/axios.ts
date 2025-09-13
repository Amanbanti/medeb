import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL + "/api",
  withCredentials: true,
});
