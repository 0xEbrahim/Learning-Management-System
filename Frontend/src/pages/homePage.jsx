import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import AppNavBar from "../components/appnavbar";
import SideBar from "../components/sidebar";
import { initFlowbite } from "flowbite";
import "./homePage.css";
import { refreshAccessToken } from "../rtk/slices/authSlice";
import { logout } from "../rtk/slices/authSlice";
import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";
const socket = io.connect("http://localhost:3000");
function HomePage() {
  const accessToken = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sendTry=()=>{
    socket.emit("try","try");
  }
  
  useEffect(()=>{
    socket.on('success',()=>console.log("success"));
  },[socket])

  useEffect(() => {
    initFlowbite();
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      dispatch(refreshAccessToken());
    }, 1000 * 60 * 14);
    //clear interval when unmount component to stop refreshing access token
    //keep refreshing every 15 mins when token changes
    return () => clearInterval(interval);
  }, [accessToken]);
  useEffect(() => {
    if (accessToken === null) {
      navigate("/login");
    }
  }, [accessToken]);
  return (
    <>
      <AppNavBar />
      <SideBar />
      <div className="p-4 sm:ml-64 bg-[#F5EFFF]">
        <div className="p-4 mt-14">
          <button onClick={()=>sendTry()} className="btn cursor-pointer px-4 py-3 rounded-xl bg-indigo-600 text-white">click</button>
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
}
export default HomePage;
