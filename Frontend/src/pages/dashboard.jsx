import { useSelector } from "react-redux";
import { useState } from "react";
import api from "../axiosInstance";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { PiNotepadFill } from "react-icons/pi";
import { IoCloudDone } from "react-icons/io5";
import { PiCertificateFill } from "react-icons/pi";
import { TbClockHour10Filled } from "react-icons/tb";
import CourseCard from "../components/courseCard";
import { Link } from "react-router-dom";
function DashboardPage(){
    const navigate=useNavigate();
    const userName=useSelector((state)=>state.user.userData?.name);
    // const userEmail=useSelector((state)=>state.user.userData?.email);
    const userAvatar=useSelector((state)=>state.user.userData?.avatar||"../../assets/images/unknown.jpg");
    const userId=useSelector((state)=>state.user.userData?.id);
    const [expand,setExpand]=useState(false);
    const [newUserName,setNewUserName]=useState("");

    const handleUserNameChange=(value)=>{
        setNewUserName(value);
    }

    const updateUserName=async()=>{
        try{
            const res=await api.patch(`/users/${userId}/update`,{
                name:newUserName
            });

            if(res.status === 200){
                Swal.fire({
                    title: "your name is updated successfully",
                    icon: "success",
                    draggable: true
                  }).then(()=>{
                    setExpand(false);
                    window.location.reload();
                  });
               }
            
        }catch(error){
            if(error.response?.status === 403 || error.response?.status === 401){
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Session expired, please login again",
                  }).then(()=>{
                    navigate("/login");
                  });
            }
        }
    }

    return(
        <>
        <h1 className="text-2xl font-bold mb-3">Dashboard</h1>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2 mb-6">
                <div className=" bg-white rounded-lg p-2 lg:p-3"><div className=" w-full flex items-center gap-1"><PiNotepadFill className="text-blue-600 text-2xl"/><p className="md:text-md font-[600] text-sm">Ongoing</p></div><span className="block lg:text-3xl font-bold mt-8">0</span></div>
                <div className=" bg-white rounded-lg p-2 lg:p-3"><div className=" w-full flex items-center gap-1"><IoCloudDone className="text-green-600 text-2xl"/><p className="md:text-md font-[600] text-sm">Completed</p></div><span className="block lg:text-3xl font-bold mt-8">0</span></div>
                <div className=" bg-white rounded-lg p-2 lg:p-3"><div className="w-full flex items-center gap-1"><PiCertificateFill className="text-yellow-600 text-2xl"/><p className="md:text-md font-[600] text-sm">Certificate</p></div><span className="block lg:text-3xl font-bold mt-8">0</span></div>
                <div className="bg-white rounded-lg p-2 lg:p-3"><div className="w-full flex items-center gap-1"><TbClockHour10Filled className="text-indigo-600 text-2xl"/><p className="md:text-md font-[600] text-sm">Hours</p></div><span className="block lg:text-3xl font-bold mt-8">0</span></div>
        </div>
        <div className="grid lg:grid-cols-4 gap-2 md:grid-cols-3 mb-3">
            <div className="lg:col-span-3 md:col-span-2 col-span-4 md:order-first order-last ">
                <div>
                    <div className="flex items-center justify-between"><h2 className="mb-3 font-bold text-xl">Popular Courses</h2><Link className="text-indigo-600 hover:text-indigo-700 font-[600]">View All</Link></div>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-2">
                        <CourseCard/>
                        <CourseCard/>
                        <CourseCard/>
                    </div>
                </div>
            </div>
            <div className="md:col-span-1 col-span-4">
            <div className="bg-white rounded-xl p-3 flex items-center flex-col gap-2 mb-3">
<div className=" relative user-avatar mt-4">
    <img className="lg:w-30 lg:h-30 w-25 h-25 cursor-pointer rounded-full object-cover" src={userAvatar} alt="user photo"/>
</div>
{expand?( <div>
    <form className="w-full bg-white" onSubmit={(e)=>e.preventDefault()}>
    <div className="mb-4">
            <input type="text" id="name" className="outline-none border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Edit userName.." onChange={(e)=>{handleUserNameChange(e.target.value)}}/>
        </div>
        <div className="flex items-center gap-1">
            <button onClick={()=>{updateUserName()}} className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded-lg text-md cursor-pointer mb-3">Save</button>
            <button onClick={()=>setExpand(false)} className="btn bg-indigo-300 hover:bg-indigo-400 text-white px-2 py-1 rounded-lg text-md cursor-pointer mb-3" >Cancel</button>
        </div>
    </form>
</div>
):(
    <>
    <div className="user-info flex items-center flex-col text-sm">
    <p className="font-bold  text-md">{userName}</p>
    {/* <p className="lg:text-sm md:text-[12px] text-[8px] p-2 text-wrap">{userEmail}</p> */}
</div>
<div >
    <button onClick={()=>setExpand(true)} className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-md cursor-pointer">Edit Profile</button>
</div>
</>
)}
</div>
</div>
</div>
<div className="grid grid-cols-4 gap-2">
        <div className="lg:col-span-3 col-span-4 mb-3">
            <div>
                <h3 className="text-xl font-bold mb-3">My Courses</h3>
                <div className="relative overflow-auto">
    <table className="w-full text-md text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Course
                </th>
                <th scope="col" className="px-6 py-3">
                    Category
                </th>
                <th scope="col" className="px-6 py-3">
                    Lessons
                </th>
                <th scope="col" className="px-6 py-3">
                    Status
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="bg-white border-b border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    Frontend
                </th>
                <td className="px-6 py-4">
                    Software
                </td>
                <td className="px-6 py-4">
                    15/15
                </td>
                <td className="px-6 py-4">
                    completed
                </td>
            </tr>
            <tr className="bg-white border-b border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    Frontend
                </th>
                <td className="px-6 py-4">
                    Software
                </td>
                <td className="px-6 py-4">
                    15/15
                </td>
                <td className="px-6 py-4">
                    completed
                </td>
            </tr>
            <tr className="bg-white border-b border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    Frontend
                </th>
                <td className="px-6 py-4">
                    Software
                </td>
                <td className="px-6 py-4">
                    15/15
                </td>
                <td className="px-6 py-4">
                    completed
                </td>
            </tr>
            <tr className="bg-white border-b border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    Frontend
                </th>
                <td className="px-6 py-4">
                    Software
                </td>
                <td className="px-6 py-4">
                    15/15
                </td>
                <td className="px-6 py-4">
                    completed
                </td>
            </tr>

        </tbody>
    </table>
</div>
            </div>
        </div>
        <div className="continue-watching lg:col-span-1 col-span-4">
            <h3 className="text-xl font-bold mb-3">Continue Watching</h3>
            <ul className="w-full space-y-2">
                <li className="bg-white p-4 rounded-xl text-indigo-600 font-[600]"><Link to="">Frontend</Link></li>
                <li className="bg-white p-4 rounded-xl text-indigo-600 font-[600]"><Link to="">Backend</Link></li>
                <li className="bg-white p-4 rounded-xl text-indigo-600 font-[600]"><Link to="">UI/UX</Link></li>
                <li className="bg-white p-4 rounded-xl text-indigo-600 font-[600]"><Link to="">Cyber security</Link></li>
            </ul>
        </div>
        </div>
        </>
    );
}
export default DashboardPage;

