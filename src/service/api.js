import axios, { AxiosError } from "axios";
import { envConfig } from "../config/envConfig";
import errorConstants from "../constants/error.constants";
import store from "../state/store";
import { clearAdmin } from "../state/slices/adminSlice";

const axiosPublic = axios.create({
    baseURL: envConfig.API_URL,
    withCredentials: true
});

export const axiosPrivate = axios.create({
    baseURL: envConfig.API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true
});

export const authApi = axios.create({
    baseURL: envConfig.API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true
})

axiosPrivate.interceptors.request.use()

axiosPrivate.interceptors.response.use(
    req => req,
    async (error) => {

        const { response } = error;
    
        if (response?.status === 401 && !error.config?._sent && response.data.error === errorConstants.ERR_INVALID_ACCESS) {
            try {
                error.config._sent = true;
                const res = await authApi.get("/auth/token-refresh");
    
                if (res.data.success) {
                    return axiosPrivate(error.config);
                }
            } catch (error) {
                if (
                    error instanceof AxiosError &&
                    error.response?.data.error === errorConstants.ERR_INVALID_REFRESH
                ) {
                    store.dispatch(clearAdmin());
                    return Promise.reject(error);
                }
            }
        }
    
        return Promise.reject(error);
    }
)

export default axiosPublic;