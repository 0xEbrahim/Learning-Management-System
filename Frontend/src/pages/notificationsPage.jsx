import { useState , useEffect } from "react";
import { useDispatch , useSelector } from "react-redux";
import { markAsRead } from "../rtk/slices/socketNotifcationsSlice";
import Loading from "../components/loading"; 
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function NotificationsPage(){
    //each notification message contains notificationData (id , recieverId , opened? , text , createdAtDate ) , reviewId
    const notifications=useSelector((state)=>state.notifications.messages);
    const unreadNotifications=useSelector((state)=>state.notifications.unreadNotifications);
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const notificationList=notifications.map((n)=>{
        const { id , opened , text , createdAt } = n.notification;
        return(
            <div onClick={()=>{dispatch(markAsRead(id)) ; navigate(`../courses/course/${n.courseId}/reviews` , { state: { scrollToReview: n.reviewId }});} } className={`p-3 cursor-pointer ${ opened ? "bg-gray-50" : "bg-white" }`} key={ n.reviewId }>
                <div  className="flex items-center gap-3">
                    { !opened ? <div className="w-2 h-2 rounded-full bg-indigo-600"></div> : null }
                  <div>
                  <p className={`${ opened ? "font-normal" : "font-[500]" }`}>{text}</p>
                  <span className="block text-gray-400 text-sm">{createdAt.slice(0,10)}</span>
                  </div>
                </div>
            </div>
        )
    })
    return(
        <div>
            <h1 className="text-2xl font-bold mb-1">Notifications</h1>
            <p className="text-gray-500 mb-5 tracking-tight">Stay Updated With Your Latest Notifications</p>
            <div className="flex items-center justify-between p-3 bg-gray-100">
                <div className="flex items-center gap-2">
                    <p className="font-bold">All</p>
                    <p className="text-gray-600 font-[500]">unread ({unreadNotifications})</p>
                </div>
                <button className="flex items-center gap-1 cursor-pointer"><IoCheckmarkDoneSharp className="text-blue-500" /><span className="block text-gray-600 tracking-tighter">Mark all as read</span></button>
            </div>
           {/* map */}
            {notificationList}
        </div>
    )
}

export default NotificationsPage;