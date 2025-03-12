import axios from "axios";
import store from "./rtk/store";
import { refreshAccessToken } from "./rtk/slices/authSlice";



const apiUrl=import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: apiUrl, // Your API URL
  headers:{ "Content-Type": "application/json" }
});
//add accessToken if exists to api requests
api.interceptors.request.use((config)=>{
    //get accessToken from redux state
    const state=store.getState();
    const accessToken=state.auth.token;
    if(accessToken){
        config.headers.Authorization=`Bearer ${accessToken}`
    }
    return config;
});

api.interceptors.response.use((response)=>response,
    async(error)=>{
        const originalRequest=error.config;
        if(error.response?.status === 403 && !originalRequest._retry){
            originalRequest._retry=true;
            
            try{
                const newAccessToken=await store.dispatch(refreshAccessToken());
                if(newAccessToken){
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                }
            }catch(error){
                const state=store.getState();
                state.auth.token=null;
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default api;