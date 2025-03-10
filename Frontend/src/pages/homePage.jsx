import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import AppNavBar from "../components/appnavbar";
import SideBar from "../components/sidebar";
import { initFlowbite } from "flowbite";
import "./homePage.css";
import { refreshAccessToken } from "../rtk/slices/authSlice";
import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import { getUserDataById } from "../rtk/slices/userSlice";
function HomePage() {
  const accessToken = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    initFlowbite();
  }, []);

  useEffect(()=>{
    if(userId && accessToken){
      dispatch(getUserDataById({userId,accessToken}))
    }
  },[accessToken,userId])

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
      <div className="p-4 sm:ml-64 bg-[#F5EFFF] min-h-[100vh]">
        <div className="p-4 mt-14">
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
}
export default HomePage;
