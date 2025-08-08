import axios, {
  type AxiosInstance,
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

interface FailedQueueItem {
  resolve: (value: string | null) => void;
  reject: (reason?: AxiosError | unknown) => void;
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(
          (resolve: (value: string | null) => void, reject) => {
            failedQueue.push({ resolve, reject });
          }
        )
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`
        );
        const { accessToken } = response.data.payload;
        localStorage.setItem("auth-token", accessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        localStorage.removeItem("auth-token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
