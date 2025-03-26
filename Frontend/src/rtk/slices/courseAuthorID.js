import { createSlice} from "@reduxjs/toolkit";


const courseAuthorId=createSlice({
    name:"courseAuthorId",
    initialState:{id:null},
    reducers:{
      setAuthorId:(state,action)=>{
        state.id=action.payload;
      }
    },

})
export const {setAuthorId}=courseAuthorId.actions;
export default courseAuthorId.reducer;