import { useState , useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../axiosInstance";

function useGetSections(courseId){
    const [sections,setSections]=useState();
    const accessToken=useSelector((state)=>state.auth.token);
    useEffect(()=>{
        const getSections=async()=>{
            const res=await api.get(`/courses/${courseId}/sections`);
            setSections(res.data.data.sections)
        }

       if(accessToken){
        
            getSections();
       }
    },[ accessToken ])

    return sections;
}

export default useGetSections;