import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userDataReducer from "./slices/userSlice"
import coursesPageReducer from "./slices/coursesPageNo"
const store = configureStore({
  reducer:{
    auth:authReducer,
    user:userDataReducer,
    pageNo:coursesPageReducer
  },
});

export default store;