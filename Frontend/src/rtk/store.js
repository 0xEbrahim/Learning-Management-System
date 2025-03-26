import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userDataReducer from "./slices/userSlice";
import coursesPageReducer from "./slices/coursesPageNo";
import courseAuthorIdReducer from "./slices/courseAuthorID";

const store = configureStore({
  reducer:{
    auth:authReducer,
    user:userDataReducer,
    pageNo:coursesPageReducer,
    authorId:courseAuthorIdReducer
  },
});

export default store;