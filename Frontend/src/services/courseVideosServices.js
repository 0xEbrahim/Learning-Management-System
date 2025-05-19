import api from "../axiosInstance";
import Swal from "sweetalert2";

export const deleteVideo=async(courseId , videoId)=>{
    const res=await api.delete(`/courses/${courseId}/videos/${videoId}`);
    return res.data;
}

export const uploadVideo=async(video , videoLength , videoImage , videoTitle , sectionId , courseId , setUploadProgress)=>{
    if(!video || videoLength == 0){
        Swal.fire({
            icon: "error",
            title: "you should upload video",
            draggable: true
          });

        return;
    }else if(!videoImage){
        Swal.fire({
            icon: "error",
            title: "you should upload image",
            draggable: true
          });
          return;
    }else if(!videoTitle){
        Swal.fire({
            icon: "error",
            title: "add title",
            draggable: true
          });
          return;
    }else{
    const formData=new FormData();
    formData.append("image",videoImage);
    formData.append("video",video);
    formData.append("title",videoTitle);
    formData.append("videoLength",videoLength);
    formData.append("sectionId",sectionId);
    const res=await api.post(`/courses/${courseId}/videos` , formData , {
        headers:{
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress:(progressEvent)=>{
            const percent=Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
        }
    });

    return res.data;

}
}