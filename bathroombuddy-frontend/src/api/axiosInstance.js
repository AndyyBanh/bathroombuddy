import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location = '/login';
            } else if (error.response.status === 500) {
                console.error('Server error. Please try again later.');
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request timeout. Please try again.');
        } else if (!error.response) {
            console.log('Network error. Please check your connection');
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;