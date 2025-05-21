import { useSelector , useDispatch } from "react-redux";
import { useEffect , useLayoutEffect } from "react";
import AppNavBar from "../components/appnavbar";
import SideBar from "../components/sidebar";
import { initFlowbite } from "flowbite";
import "./homePage.css";
import { Outlet , useNavigate } from "react-router";
import api from "../axiosInstance";
import { storeUserData } from "../rtk/slices/userSlice";
import { io } from "socket.io-client";
import { addNotification , getNotifications } from "../rtk/slices/socketNotifcationsSlice";
import { Toaster , toast}  from "react-hot-toast";
import Toast from "../components/toast";

export const socket = io.connect("http://localhost:3000");

function HomePage() {
  const accessToken = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    initFlowbite();
  }, []);
  
  useEffect(()=>{
    dispatch(getNotifications());
},[ accessToken ]);

  useEffect(()=>{
    socket.on("notificationSent",(data)=>{
        // const { notification , reviewId } = data;
        //show notification toast
        toast.custom((t) => (
          <Toast t={t} data={data}/>
        ),{
          position: 'top-right',
          duration: 5000,
        })
        //add notification
        dispatch(addNotification(data.notification));
    })
  },[socket]);

  //get msgs notifications from socket

  useEffect(()=>{
    socket.on("msgNotification", (data)=>{
      //show notification toast
      toast.custom((t) => (
        <Toast t={t} data={data}/>
      ),{
        position: 'top-right',
        duration: 5000,
      })
      
    })
  },[socket])

  useLayoutEffect(()=>{
    const getUserDataById=async()=>{
      try{
        const response = await api.get(`/users/${userId}`);
        dispatch(storeUserData(response.data.data.user));
        //initailize socket notifications
        socket.emit("init",{ currentAuthenticatedUserId:userId});

      }catch(error){
        // console.log(error.message);
        return;
      }
          
    }
      getUserDataById();

  },[ accessToken , userId ] );

  useEffect(() => {
    if (accessToken === null) {
      navigate("/login");
    }
  }, [accessToken]);
  return (
    <>
      <AppNavBar />
      <SideBar />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
        }}
      />
      <div className="p-2 sm:ml-64 bg-[#F5EFFF] min-h-[100vh] mt-3">
        <div className="p-2 mt-14">

          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
}
export default HomePage;
