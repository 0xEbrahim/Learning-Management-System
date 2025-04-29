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
                ...action.payload,
            })

            state.unreadNotifications+=1;
        },

        //make notification as read reducer
        markAsRead:( state , action )=>{
            const notification=state.messages.find((n)=>n.notification.id === action.payload)
            if(notification){
                notification.notification.opened=true;
                if( state.unreadNotifications !== 0){
                    state.unreadNotifications-=1;
                }
            }
        },

        removeNotification:( state , action )=>{
                //remove this notification
                state.messages.filter((n)=>n.notification.id !== action.payload.notification.id);
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