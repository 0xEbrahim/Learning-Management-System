
import {useSelector} from "react-redux";
import { useEffect } from "react";
import AppNavBar from "../components/appnavbar";
import SideBar from "../components/sidebar";
import { initFlowbite } from "flowbite";
import "./homePage.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "../rtk/slices/authSlice";
import { logout } from "../rtk/slices/authSlice";
function HomePage(){
  const accessToken=useSelector((state)=>state.auth.token);
  const dispatch=useDispatch();
  useEffect(()=>{
    initFlowbite()
  },[])

  useEffect(()=>{
    let interval=setInterval(()=>{
      dispatch(refreshAccessToken());

    },1000*60);
    //clear interval when unmount component to stop refreshing access token
    //keep refreshing every 15 mins when token changes
    return ()=>clearInterval(interval);
  },[accessToken])
  // useEffect(()=>{
  //   if(accessToken===null){
  //     dispatch(logout());
  //   }
  // })
    return(
      <>
        <AppNavBar/> 
        <SideBar/> 
      </>
    );
}
export default HomePage;