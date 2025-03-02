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
function HomePage() {
  const accessToken = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    initFlowbite();
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      dispatch(refreshAccessToken());
    }, 1000 * 30);
    //clear interval when unmount component to stop refreshing access token
    //keep refreshing every 15 mins when token changes
    return () => clearInterval(interval);
  }, [accessToken]);
  useEffect(() => {
    console.log(accessToken);
    if (accessToken === null) {
      navigate("/login");
    }
  }, [accessToken]);
  return (
    <>
      <AppNavBar />
      <SideBar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 mt-14">
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
}
export default HomePage;
