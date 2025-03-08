import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const getUserDataById=createAsyncThunk(
    "user/getData",
    async ({ userId, accessToken }, { rejectWithValue }) => {
        try {
          const response = await axios.get(`${apiUrl}/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          return response.data.data;
        }catch(error){
          if(error.response.status === 403){
            return rejectWithValue("Session expired, please login again");
          }
          return rejectWithValue("cant get userData");
        }
    }
);

const userSlice=createSlice({
    name:'userSlice',
    initialState:{userData:null,error:null},
    reducers:{},
    extraReducers: (builder)=>{
        builder
        .addCase(getUserDataById.fulfilled,(state,action)=>{
            state.userData=action.payload;
            state.error=null;
        })
        .addCase(getUserDataById.rejected,(state,action)=>{
            state.userData=null;
            state.error=action.payload;
        })
    }
})

export default userSlice.reducer;