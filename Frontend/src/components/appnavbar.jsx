import {useSelector} from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../rtk/slices/authSlice";
import { useDispatch } from "react-redux";
function AppNavBar(){
  const userName=useSelector((state)=>state.user.userData?.name);
  const userEmail=useSelector((state)=>state.user.userData?.email);
  const userAvatar=useSelector((state)=>state.user.userData?.avatar||"../../assets/images/unknown.jpg");
  const dispatch=useDispatch();
  const accessToken=useSelector((state)=>state.auth.token);
  
    return(
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                   <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
             </button>
            <Link to="/homePage" className="flex ms-2 md:me-24">
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Learnify</span>
            </Link>         
          </div>
          <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div className="flex items-center gap-6">
                <button type="button" className="cursor-pointer relative inline-flex items-center p-2 rounded-full text-sm text-center text-black hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="sr-only">Notifications</span>
                  {/* add number of notifications */}
                    <div className="absolute inline-flex items-center justify-center w-3.5 h-3.5 text-sm font-bold text-white bg-indigo-600 border-2 border-white rounded-full -top-[-4px] -end-[-4px]"></div>
                  </button>
                  <button type="button" className="cursor-pointer flex text-sm rounded-full" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                    <span className="sr-only">Open user menu</span>
                    <img className="w-12 h-12 rounded-full object-cover" src={userAvatar} alt="user photo"/>
                  </button>
                </div>
                <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
                  <div className="px-4 py-3" role="none">
                    <p className="text-sm text-gray-900 dark:text-white" role="none">
                      {userName}
                    </p>
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                      {userEmail}
                    </p>
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <Link to="/homePage/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/homePage/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Settings</Link>
                    </li>
                    {accessToken?(<li>
                      <Link onClick={()=>dispatch(logout(accessToken))} to="" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">logout</Link>
                    </li>):""}
                  </ul>
                </div>
              </div>
            </div>
        </div>
      </div>
    </nav>
    );
}
export default AppNavBar;