import { createSlice} from "@reduxjs/toolkit";


const coursesPageSlice=createSlice({
    name:"coursesPageSlice",
    initialState:{page:1},
    reducers:{
      setPageNo:(state,action)=>{
        state.page=action.payload;
      }
    },

})
export const {setPageNo}=coursesPageSlice.actions;
export default coursesPageSlice.reducer;