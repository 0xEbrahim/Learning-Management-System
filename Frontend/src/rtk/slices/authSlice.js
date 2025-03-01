import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
// import api from "../../axiosInstance";


export const login=createAsyncThunk('auth/login',async(body,{rejectWithValue})=>{
    try{
        const response=await axios({
                method: 'post',
                url: `${apiUrl}/auth/login`,
                data:{
                    "email":body.userEmail,
                    "password":body.password
                },
                headers:{
                  Accept:'applicaton/json',
                  "Content-Type":'application/json'
                }
              },{withCredentials:true})
        return response.data.token;
    }catch(error){
        //considered action.payload for error
        return rejectWithValue(error.response.data.message);
    }
})

export const refreshAccessToken=createAsyncThunk('auth/refresh',async({rejectWithValue})=>{
    try{
        const response=await axios.get(`${apiUrl}/auth/refresh`,{},{withCredentials:true});
        return response.data.token;
    }catch(error){
        return rejectWithValue(error.response.data.message);
    }
})

export const logout=createAsyncThunk('auth/logout',async(userAccessToken)=>{
    await axios.post(`${apiUrl}/auth/logout`,{
        headers:{
            Accept:'applicaton/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${userAccessToken}`
        },
    },{withCredentials:true})
})

const authSlice=createSlice({
    name:'authSlice',
    initialState:{token:localStorage.getItem("token")||null,error:null},
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(login.fulfilled,(state,action)=>{
            localStorage.setItem("token",action.payload);
            state.token=action.payload
            state.error=null
        })
        .addCase(login.rejected,(state,action)=>{
            localStorage.setItem("token",null);
            state.token=null
            state.error=action.payload
        })
        .addCase(refreshAccessToken.fulfilled,(state,action)=>{
            localStorage.setItem("token",action.payload);
            state.token=action.payload
            state.error=null
        })
        .addCase(refreshAccessToken.rejected,(state,action)=>{
            localStorage.setItem("token",null);
            state.token=null
            state.error=action.payload
        })
        .addCase(logout.fulfilled,(state)=>{
            localStorage.removeItem("token");
            state.token=null
        })

    }

})

export default authSlice.reducer;