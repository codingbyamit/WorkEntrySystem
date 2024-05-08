import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://10.0.0.177:5003",
    withCredentials: true,
});
// const axiosClient = axios.create({
//     baseURL: "http://10.0.0.5:5003",
//     withCredentials: true,
// });

export default axiosClient;
