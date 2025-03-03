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
      return response.data.token;
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
  initialState: { token: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.token = null;
        state.error = action.payload;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.token = action.payload;
        state.error = null;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.token = null;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
      });
  },
});

export default authSlice.reducer;
