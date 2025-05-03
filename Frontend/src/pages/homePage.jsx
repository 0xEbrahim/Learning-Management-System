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
import { AiFillNotification } from "react-icons/ai";

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
},[ userId ]);

  useEffect(()=>{
    socket.on("notificationSent",(data)=>{
        // const { notification , reviewId } = data;

        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex z-50 absolute top-[60px]`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 cursor-pointer text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200">
                <AiFillNotification />
                </div>
                </div>
                <div className="ml-3 flex-1">
                  {/* <p className="text-sm font-medium text-gray-900">
                    revieweName
                  </p> */}
                  <p className="mt-1 text-sm text-gray-500">
                    {data.notification.text}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className=" cursor-pointer w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 "
              >
                close
              </button>
            </div>
          </div>
        ),{
          position: 'top-right',
          duration: 5000,
        })
        //add notification
        dispatch(addNotification(data.notification));
    })
  },[socket]);

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
        <div className="p-3 mt-14">

          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
}
export default HomePage;
