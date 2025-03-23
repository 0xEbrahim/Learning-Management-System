import { useEffect , useState } from "react";
import api from "../axiosInstance";
import { useSelector } from "react-redux";

function useGetCourses(){
    const [courses,setCourses]=useState([]);
    const accessToken=useSelector((state)=>state.auth.token);

    useEffect(()=>{
        const getCourses=async()=>{
            try{
                const res=await api.get(`/courses`);
                setCourses(res.data.data.courses);
            }catch(error){
                console.log(error);
            }
        }
        
        if(accessToken){
            getCourses();
        }
    },[accessToken])

    return courses;

}

export default useGetCourses;