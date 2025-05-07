import { createSlice } from "@reduxjs/toolkit";

const courseSectionsSlice=createSlice({

    name:"sectionsSlice",
    initialState:{sections:[]},
    reducers:{
        setSections:( state , action )=>{
            state.sections=action.payload
        }
    }

})

export const {setSections}=courseSectionsSlice.actions;
export default courseSectionsSlice.reducer;