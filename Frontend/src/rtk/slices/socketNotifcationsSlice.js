import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice=createSlice({
    name:"notificationsSlice",
    initialState:{
        messages:[],
        unreadNotifications:0
    },
    
    reducers:{
        //add notification reducer
        addNotification: ( state , action )=>{
            state.messages.push({
                //action returns Notification reviewText && reviewId
                id:Date.now(),
                ...action.payload,
                read:false
            })

            state.unreadNotifications+=1;
        },

        //make notification as read reducer
        makeAsRead:( state , action )=>{
            const notification=state.messages.find((n)=>n.id === action.payload.id)
            if(notification){
                notification.read=true;
                state.unreadNotifications-=1;
            }
        },

        removeNotification:( state , action )=>{
                //remove this notification
                state.messages.filter((n)=>n.id !== action.payload.id);
                state.unreadNotifications-=1;

        },

        clearAllNotification:( state )=>{
            state.messages=[];
            state.unreadNotifications=0;
        }
    }
})

export const { 
    addNotification, 
    markAsRead, 
    removeNotification, 
    clearAll 
  } = notificationsSlice.actions;

  export default notificationsSlice.reducer;