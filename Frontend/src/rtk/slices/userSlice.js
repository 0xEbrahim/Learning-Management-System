import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: 'user',
    initialState:JSON.parse(window.localStorage.getItem("user")),
    reducers:{
   logIn:(state,action)=>{
        window.localStorage.setItem("user",JSON.stringify(action.payload));
        state=action.payload;
   },
   logOut:(state,action)=>{
    window.localStorage.removeItem("user");
    return{email:"", id:""};
    },
    },
  });
  
  export const { logIn, logOut} = userSlice.actions
  export default userSlice.reducer;