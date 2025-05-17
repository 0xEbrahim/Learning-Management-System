import { createSlice } from "@reduxjs/toolkit";

const playedVideoSlice=createSlice({

    name:"playedVideoSlice",
    initialState:{courseId:"" , videoUrl:"" , videoThumbnail:""},
    reducers:{
        setVideoData:( state , action )=>{
            state.courseId=action.payload.courseId;
            state.videoUrl=action.payload.videoUrl;
            state.videoThumbnail=action.payload.videoThumbnail
        },

    }

})

export const {setVideoData}=playedVideoSlice.actions;
export default playedVideoSlice.reducer;