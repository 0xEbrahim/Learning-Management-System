import { createSlice} from "@reduxjs/toolkit";


const userSlice=createSlice({
    name:"userSlice",
    initialState:{userData:null},
    reducers:{
      storeUserData:(state,action)=>{
        state.userData=action.payload;
      }
    },

})
export const {storeUserData}=userSlice.actions;
export default userSlice.reducer;