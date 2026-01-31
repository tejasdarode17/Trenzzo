import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_SOCKET_URL,
    withCredentials: true,
});

// Response Interceptor
api.interceptors.response.use(
    res => res,
    async err => {
        const originalRequest = err.config;

        if (
            err.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/refresh")
        ) {
            originalRequest._retry = true;
            try {
                console.log("refresh fired");
                await api.post("/auth/refresh");
                return api(originalRequest);
            } catch (refreshErr) {
                console.log("refresh failed", refreshErr);
                return Promise.reject(refreshErr);
            }
        }
        return Promise.reject(err);
    }
);


export default api;
