import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userDataReducer from "./slices/userSlice";
import coursesPageReducer from "./slices/coursesPageNo";
import courseAuthorIdReducer from "./slices/courseAuthorID";
import notificationsReducer from "./slices/socketNotifcationsSlice"
import courseSectionsReducer from "./slices/courseSections"
import playedVideoSlice from "./slices/playedVideoSlice"
const store = configureStore({
  reducer:{
    auth:authReducer,
    user:userDataReducer,
    pageNo:coursesPageReducer,
    authorId:courseAuthorIdReducer,
    notifications:notificationsReducer,
    sections:courseSectionsReducer,
    videoData:playedVideoSlice
  },
});

export default store;