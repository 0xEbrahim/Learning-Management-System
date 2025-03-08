import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userDataReducer from "./slices/userSlice"
const store = configureStore({
  reducer:{
    auth:authReducer,
    user:userDataReducer,
  },
});

export default store