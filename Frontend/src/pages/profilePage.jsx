import { useSelector } from "react-redux";
import { useState , useEffect } from "react";
import api from "../axiosInstance";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../rtk/slices/authSlice";
function ProfilePage(){
    const accessToken=useSelector((state)=>state.auth.token);
    const userAvatar=useSelector((state)=>state.user.userData?.avatar||"../../assets/images/unknown.jpg");
    const userName=useSelector((state)=>state.user.userData?.name);
    const userEmail=useSelector((state)=>state.user.userData?.email);
    const userRole=useSelector((state)=>state.user.userData?.role);
    const creationDate=useSelector((state)=>state.user.userData?.createdAt);
    const [newAvatar,setNewAvatar]=useState("");
    const userId=useSelector((state)=>state.user.userData?.id);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const handleNewAvatar=(value)=>{
        setNewAvatar(value);
    }

    const deactivateAccount=async()=>{
        try{
            const res= await api.patch(`users/${userId}/deactivate`);
            if(res.status === 200){
                Swal.fire({
                    title: "your account has been deactivated successfully",
                    icon: "success"
                  }).then(()=>{
                    dispatch(logout(accessToken));
                    navigate("/login");
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
                    
                    if(res.status === 200){
                        Swal.fire({
                            title: "your avatar has been updated successfully",
                            icon: "success",
                            draggable: true
                          }).then(()=>{
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
            uploadAvatar();
        }
    },[newAvatar])

    const removeUserAvatar=async()=>{
        try{
            await api.patch(`/users/${userId}/update/pic`,{remove:true});
            window.location.reload();
        }catch(error){
            return;
        }
    }

    return(
      <div>
          <div className="profile-picture mb-3">
            <h2 className="text-xl font-[600] mb-6">Profile Info</h2>
            <div className="flex lg:items-center lg:flex-row flex-col gap-6 ">
                <img className="w-30 h-30 rounded-full object-cover" src={userAvatar} alt="user-avatar"/>
                <div className="flex items-center gap-1">
                <label htmlFor="avatar" className="md:px-3 md:py-2 px-2 py-1 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-all">
                        Change Avatar
                        <input id="avatar" type="file" className="hidden" onChange={(e)=>{handleNewAvatar(e.target.files[0])}} />
                    </label>
                    <button onClick={()=>{removeUserAvatar()}} className="md:px-3 md:py-2 px-2 py-1 text-indigo-600 bg-white hover:text-white hover:bg-indigo-700 rounded-lg font-[600] cursor-pointer transition-all">Delete Avatar</button>
                </div>
            </div>
        </div>
        <div className="user-info">
            <div className="mb-3">
                <h2 className="mb-1">Profile name</h2>
                <input className="lg:w-[60%] w-full bg-gray-50 rounded-lg outline-none focus-none p-2" type="text" placeholder={userName} readOnly/>
            </div>
            <div className="mb-3">
                <h2 className="mb-1">Email</h2>
                <input className="lg:w-[60%] w-full bg-gray-50 rounded-lg outline-none focus-none p-2" type="text" placeholder={userEmail} readOnly/>
            </div>
            <div className="mb-3 flex lg:items-center lg:gap-6 gap-3 lg:flex-row flex-col">
            <div>
                <h2 className="mb-1">Your Role</h2>
                <input className="flex-1/2 bg-gray-50 rounded-lg outline-none focus-none p-2" type="text" placeholder={userRole} readOnly/>
            </div>
            <div>
                <h2 className="mb-1">account created at:</h2>
                <input className="flex-1/2 bg-gray-50 rounded-lg outline-none focus-none p-2" type="text" placeholder={creationDate?.slice(0,10)} readOnly/>
            </div>
            </div>

        </div>
        <span className="block text-gray-400 text-sm mt-10">Your account will be deleted permanently after 30 days</span>
        <button onClick={()=>{deactivateAccount()}} className="mt-3 px-2 py-2 text-white bg-red-600 rounded-lg hover:text-red-600 hover:bg-white transition-all cursor-pointer font-[600]">Deactivate Account</button>
      </div>

    )
}
export default ProfilePage;