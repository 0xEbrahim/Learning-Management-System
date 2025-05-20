import { useState } from "react";
import { useParams , useLocation } from "react-router-dom";
import { FaPlusSquare } from "react-icons/fa";
import { RiVideoAddFill } from "react-icons/ri";
import Swal from "sweetalert2";
import UploadProgress from "../components/uploadProgress";
import { useQueryClient , useMutation } from "@tanstack/react-query";
import { uploadVideo } from "../services/courseVideosServices";

function UploadVideoPage(){
    const { courseId , sectionId }=useParams();
    const location=useLocation();
    //get sectionName from the state ot the Route
    const {sectionName}=location.state || {};
    const [videoTitle,setVideoTitle]=useState("");
    const [videoImage,setVideoImage]=useState(null);
    const [video,setVideo]=useState(null);
    const [videoLength,setVideoLength]=useState(0);
    const [uploadProgress,setUploadProgress]=useState(0);

    const handleImageChange=(value)=>{
        if(value.type.includes('image')){
            setVideoImage(value)
        }else{
            Swal.fire({
                icon: "error",
                title: "you should upload image",
                draggable: true
              });
        }
    }

    const handleVideoChange=(e)=>{
        const file=e.target.files[0];
        //get video duration
        if (file && file.type.includes('video')) {
            const url = URL.createObjectURL(file);
            const tempVideo = document.createElement('video');
      
            tempVideo.preload = 'metadata';
            tempVideo.src = url;
      
            tempVideo.onloadedmetadata = () => {
                URL.revokeObjectURL(url); 
                if (!isNaN(tempVideo.duration) && tempVideo.duration > 0) {
                    setVideoLength((tempVideo.duration / 60 ).toFixed(2).toString());
                    setVideo(file);
                }
            }

        }else{
            Swal.fire({
                icon: "error",
                title: "you should upload video",
                draggable: true
              });
        }
    }
    const handleTitleChange=(value)=>{
        setVideoTitle(value)
    }

    const queryClient=useQueryClient();
    const {mutate:UploadVideoMutation}=useMutation({
        mutationFn:()=> uploadVideo(video , videoLength , videoImage , videoTitle , sectionId , courseId , setUploadProgress),
        onSuccess:()=>{
            Swal.fire({
                title: "video has been added successfully",
                icon: "success",
                draggable: true
              }).then(()=>{
                setUploadProgress(0);
                setVideoTitle("");
              })

            queryClient.invalidateQueries({
                queryKey:["courseSections", courseId]
            })
        },
        onError:()=>{
            Swal.fire({
                title: "couldnt upload video",
                icon: "error",
                draggable: true
              }).then(()=>{
                setUploadProgress(0);
                setVideoTitle("");
              })
        }
    })


    return(
        <>
            {uploadProgress > 0 && <UploadProgress progress={uploadProgress}/>}
            <h1 className="text-xl font-[600] w-full">Upload video to <span className="text-indigo-600">{sectionName}</span> section</h1>
            <div className="flex items-center justify-end gap-1">
                <button  className=" font-bold btn bg-indigo-100 hover:bg-indigo-200 text-indigo-600 px-3 py-2 rounded-lg text-md cursor-pointer mt-8">Cancel</button>
                <button onClick={()=>{UploadVideoMutation()}} className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-md cursor-pointer mt-8">upload</button>
            </div>
            <form className="grid grid-cols-1 mt-4" onSubmit={(e)=>{e.preventDefault()}}>
                <div className="col-span-2 bg-white p-4 rounded-lg">
                    <div className="md:w-[400px] w-full">
                        <div className="mb-4">
                            <label htmlFor="default-input" className="block mb-2 text-md font-medium text-gray-900">Video Title</label>
                            <input type="text" id="default-input" className="outline-none border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-1.5" value={videoTitle} onChange={(e)=>{handleTitleChange(e.target.value)}} />
                        </div>    
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-1 ">
                    <div className="flex items-center justify-center flex-col  h-[200px] bg-white border-dashed border-2 border-indigo-600 p-2 rounded-lg">
                        <label className="cursor-pointer flex items-center justify-center rounded-full text-black">
                            <FaPlusSquare className="text-5xl"/>
                            <input
                            type="file"
                            className="hidden"
                            onChange={(e)=>{handleImageChange(e.target.files[0])}}
                            />
                        </label>
                        <p className="mt-3 text-amber-400">upload Image</p>
                    </div>
                    <div className="flex items-center justify-center flex-col  h-[200px] bg-white border-dashed border-2 border-indigo-600 p-2 rounded-lg">
                        <label className="cursor-pointer flex items-center justify-center rounded-full text-black">
                            <RiVideoAddFill className="text-6xl"/>
                            <input
                            type="file"
                            className="hidden"
                            onChange={(e)=>{handleVideoChange(e)}}
                            />
                        </label>
                        <p className="mt-3 text-amber-400">upload Video</p>
                    </div>
                </div>
            </form>
        </>
    );
}

export default UploadVideoPage;