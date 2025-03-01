import { IoMdSettings } from "react-icons/io";
import { BiLogOutCircle } from "react-icons/bi";
import { FaFileSignature } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { IoHome } from "react-icons/io5";
import { IoMdLogIn } from "react-icons/io";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../rtk/slices/authSlice";
function SideBar(){
   const accessToken=useSelector((state)=>state.auth.token);
   const dispatch=useDispatch();
    return(
        <>
            <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
   <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <ul className="space-y-2 font-medium">
         <li>
            <Link href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            < IoHome className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-900 group-hover:text-gray-900 dark:group-hover:text-white" />
               <span className="ms-3">Dashboard</span>
            </Link>
         </li>
         <li>
            <Link to="/courses" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            < FiShoppingBag className="shrink-0 w-5 h-5 text-indigo-600 transition duration-75 dark:text-indigo-600 group-hover:text-indigo-600 dark:group-hover:text-white" />
               <span className="flex-1 ms-3 whitespace-nowrap">Courses</span>

            </Link>
         </li>
         <li>
            <Link href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <IoMdSettings className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
               <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
            </Link>
         </li>
         {/* condetional rendering  */}
{accessToken===null?<>
   <li>
           <Link to="/login" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
           < IoMdLogIn className="shrink-0 w-5 h-5 text-indigo-600 transition duration-75 dark:text-indigo-600 group-hover:text-indigo-600 dark:group-hover:text-white" />
              <span className="flex-1 ms-3 whitespace-nowrap">login</span>
           </Link>
        </li>
        <li>
           <Link to="/" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
           < FaFileSignature className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-red-700 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="flex-1 ms-3 whitespace-nowrap">Sign Up</span>
           </Link>
        </li>
</>:         <li>
            <button onClick={()=>dispatch(logout(accessToken))} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            < BiLogOutCircle className="shrink-0 w-5 h-5 text-red-600 transition duration-75 dark:text-red-700 group-hover:text-red-600 dark:group-hover:text-white" />
               <span className="flex-1 ms-3 whitespace-nowrap">log out</span>
            </button>
         </li>}

      </ul>
   </div>
</aside>
      </>
    )
}
export default SideBar;