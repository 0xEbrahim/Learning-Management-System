import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
// import api from "../../axiosInstance";

export const login = createAsyncThunk(
  "auth/login",
  async (body, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "post",
        url: `${apiUrl}/auth/login`,
        data: { email: body.userEmail, password: body.password },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      //considered action.payload for error
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      return response.data.token;
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        return rejectWithValue("Session expired, please login again");
      }
      return rejectWithValue("Failed to refresh token");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (userAccessToken) => {
    await axios.post(
      `${apiUrl}/auth/logout`,
      {},
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userAccessToken}`,
        },
        withCredentials: true,
      }
    );
  }
);

const authSlice = createSlice({
  name: "authSlice",
  initialState: { token: undefined , userId: localStorage.getItem("userId") || null , error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        // localStorage.setItem("token", action.payload.token);
        localStorage.setItem("userId", action.payload.data.user.id);
        state.userId=action.payload.data.user.id;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        // localStorage.setItem("token", null);
        localStorage.setItem("userId", null);
        state.userId=null;
        state.token = null;
        state.error = action.payload;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        // localStorage.setItem("token", action.payload);
        state.token = action.payload;
        state.error = null;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        // localStorage.setItem("token", null);
        state.token = null;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        // localStorage.removeItem("token");
        localStorage.removeItem("userId");
        state.userId=null;
        state.token = null;
      });
  },
});

export default authSlice.reducer;
