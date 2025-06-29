import axios from "axios";
// process.config();

const axiosInstance = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
    // baseURL: "https://api.hostastra.com"
    baseURL: "http://localhost:9000"
})

export default axiosInstance