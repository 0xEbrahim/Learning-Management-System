import api from "../axiosInstance";
import Swal from "sweetalert2";


export const getSections=async(courseId)=>{
   const res= await api.get(`/courses/${courseId}/sections`);
   return res.data.data.sections;
}

export const addSection=async(courseId , sectionNameInput)=>{
   const res= await api.post(`/courses/${courseId}/sections` ,{
        name:sectionNameInput
    })
     return res
}