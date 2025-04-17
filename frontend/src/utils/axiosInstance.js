import axios from "axios";
// process.config();

const axiosInstance = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
    baseURL: "http://localhost:9000"
})

export default axiosInstance