import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import api from "../axiosInstance";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import axios from "axios";
const apiUrl=import.meta.env.VITE_API_URL;
function DashboardPage(){
    const navigate=useNavigate();
    const accessToken=useSelector((state)=>state.auth.token);
    const userName=useSelector((state)=>state.user.userData?.name);
    const userEmail=useSelector((state)=>state.user.userData?.email);
    const userAvatar=useSelector((state)=>state.user.userData?.avatar||"../../assets/images/unknown.jpg");
    const userId=useSelector((state)=>state.user.userData?.id);
    const [expand,setExpand]=useState(false);
    const [newUserName,setNewUserName]=useState("");
    const [newAvatar,setNewAvatar]=useState("");

    const handleUserNameChange=(value)=>{
        setNewUserName(value);
    }

    const handleNewAvatar=(value)=>{
        setNewAvatar(value);
        console.log(value);
    }

    useEffect(()=>{
        if(newAvatar){

            const uploadAvatar=async()=>{
                try{
                    const formData=new FormData();
                    formData.append("image",newAvatar);
                    formData.append("remove",false);
                    const res= await  api.patch(`/users/${userId}/update/pic`,formData,
                    {
                        headers:{
                            "Content-Type": "multipart/form-data",
                        }
                    });
                    console.log(res);
                }catch(error){
                    console.log(error);
                }
            }
            uploadAvatar();
        }
    },[newAvatar])
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
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-3 gap-3 mt-4 ">
            <div className="col-span-2">
                
            </div>
            <div className="bg-white rounded-xl p-2 flex items-center flex-col gap-2">
                <div className=" relative user-avatar mt-4">
                    <img className=" cursor-pointer w-35 h-35 rounded-full" src={userAvatar} alt="user photo"/>
                    <div className="absolute top-[70%] left-[10px]">
                    <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="cursor-pointer text-white font-medium rounded-lg text-sm px-1.5 py-1 text-center inline-flex items-center gap-1 bg-gray-400"><MdModeEdit/>Edit</button>
                        <div id="dropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                            <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
                            <li>
                                <button className="flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 w-full dark:hover:text-white">Remove avatar</button>
                            </li>
                            <li>
                                {/* <button className="flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 w-full dark:hover:text-white">Upload photo</button> */}
                               <form onSubmit={(e)=>{e.preventDefault()}}>
                               <label htmlFor="image" className="flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 w-full dark:hover:text-white">
                                    Upload photo
                                    <input id="image" type="file" className="hidden" onChange={(e)=>{handleNewAvatar(e.target.files[0])}}/>
                                </label>
                                {/* <button className="flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 w-full dark:hover:text-white">Upload photo</button> */}
                               </form>
                            </li>
                            </ul>
                        </div>
                    </div>
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
                    <p className="font-bold mb-1">{userName}</p>
                    <p className="text-sm">{userEmail}</p>
                </div>
                <div >
                    <button onClick={()=>setExpand(true)} className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-md cursor-pointer mt-3 mb-3">Edit Profile</button>
                </div>
                </>
                )}
            </div>
        </div>
       </>
    )
}
export default DashboardPage;