
import {useSelector} from "react-redux";
import { useEffect } from "react";
import AppNavBar from "../components/appnavbar";
import SideBar from "../components/sidebar";
import { initFlowbite } from "flowbite";
import "./homePage.css";
function HomePage(){
  useEffect(()=>{
    initFlowbite()
  },[])
    return(
      <>
        <AppNavBar/> 
        <SideBar/> 
        
      </>
    //  userEmail?<h4>loggedIn</h4>:<h4>loggedOut</h4>
    );
}
export default HomePage;