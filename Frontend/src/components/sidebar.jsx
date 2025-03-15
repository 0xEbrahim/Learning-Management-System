import { IoMdSettings } from "react-icons/io";
import { BiLogOutCircle } from "react-icons/bi";
import { FaFileSignature } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { IoHome } from "react-icons/io5";
import { IoMdLogIn } from "react-icons/io";
import { NavLink , Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../rtk/slices/authSlice";
function SideBar(){
   const accessToken=useSelector((state)=>state.auth.token);
   const dispatch=useDispatch();
    return(
        <>
            <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
            <ul className="space-y-2 font-medium h-full relative">
         <li>
            <NavLink to="/homePage/dashboard" className={({ isActive }) =>
          isActive
            ? "active"
            : "unactive"
        } >
            < IoHome className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
               <span className="ms-3">Dashboard</span>
            </NavLink>
         </li>
         <li>
            <NavLink to="/homePage/courses" className={({ isActive }) =>
          isActive
            ? "active"
            : "unactive"
        } >
            < FiShoppingBag className="shrink-0 w-5 h-5 text-indigo-600 transition duration-75 group-hover:text-indigo-600" />
               <span className="flex-1 ms-3 whitespace-nowrap">Courses</span>

            </NavLink>
         </li>
         <li>
            <NavLink to="/homePage/settings" className={({ isActive }) =>
          isActive
            ? "active"
            : "unactive"
        } >
            <IoMdSettings className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
               <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
            </NavLink>
         </li>
         {/* condetional rendering  */}
   {accessToken===null ?
<div className="absolute w-full bottom-[10px]">
<li>
           <NavLink to="/login" className={({ isActive }) =>
          isActive
            ? "active"
            : "unactive"
        } >
           < IoMdLogIn className="shrink-0 w-5 h-5 text-indigo-600 transition duration-75 group-hover:text-indigo-600" />
              <span className="flex-1 ms-3 whitespace-nowrap">login</span>
           </NavLink>
        </li>
        <li>
           <NavLink to="/" className={({ isActive }) =>
          isActive
            ? "active"
            : "unactive"
        } >
           < FaFileSignature className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
              <span className="flex-1 ms-3 whitespace-nowrap">Sign Up</span>
           </NavLink>
        </li>
</div>
:        <li className="absolute bottom-[15px] w-full">
           <Link to="" onClick={()=>dispatch(logout(accessToken))} className="flex items-center hover:bg-[#f5efff] p-2 rounded-lg" >
           < BiLogOutCircle className=" text-red-600 shrink-0 w-5 h-5 transition duration-75 group-hover:text-gray-900" />
              <span className="flex-1 ms-3 whitespace-nowrap">logout</span>
           </Link>
        </li>}

      </ul>
   </div>
</aside>
      </>
    )
}
export default SideBar;
