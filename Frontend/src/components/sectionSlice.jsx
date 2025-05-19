import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useState , useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RiVideoUploadLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { MdOndemandVideo } from "react-icons/md";
import { setVideoData } from "../rtk/slices/playedVideoSlice";
import { MdDelete } from "react-icons/md";
import { useQueryClient , useMutation } from "@tanstack/react-query";
import { deleteVideo } from "../services/courseVideosServices";
import Swal from "sweetalert2";


function SectionSlice({index , section}){
    const {courseId}=useParams();
    const dispatch=useDispatch();
    const [expand,setExpand]=useState(false);
    const breakPoint=1279;
    const [currentWidth,setCurrentWidth]=useState(window.innerWidth);
    const userId=useSelector((state)=>state.user.userData?.id);
    const authorId=useSelector((state)=>state.authorId?.id);
    //window resize
    useEffect(()=>{
        const checkWidth=()=>{
             setCurrentWidth(window.innerWidth);
        }
        checkWidth();
        window.addEventListener('resize', checkWidth);

        return () => window.removeEventListener('resize', checkWidth);
    },[])
     //mutate query when delete video
    const queryClient=useQueryClient();
    const {mutate:deleteMutation}=useMutation({
        mutationFn:(videoId)=> deleteVideo(courseId , videoId),
        onSuccess:()=>{
            Swal.fire({
                title: "video has been deleted successfully",
                icon: "success",
                draggable: true
              })
            queryClient.invalidateQueries({
                queryKey:["courseSections", courseId]
            })
        }
    })

    return(
        <div className="sections" key={section.id}>
            <div className=" section-info w-full border-b-1 border-gray-200 bg-gray-200/30" key={section.id}>
            <div className="section-info w-full flex items-center justify-between p-2">
                     <p className="font-[600]">section{index+1}: {section.name}</p>
                    <button onClick={()=>{setExpand((expand)=>!expand)}} className="cursor-pointer"><MdOutlineKeyboardArrowDown/></button>
            </div>
            {expand?<div className="bg-white w-full p-2">
                            {/* choose path based on window width */}
                            <ul>
                            {section.Video.map((video)=>{
                                    return(
                                        <div key={video.id} className="px-2 py-3 border-b">
                                            <li onClick={()=>{dispatch(setVideoData({courseId :courseId ,videoUrl:video.videoUrl , videoThumbnail:video.videoThumbnail}))}} className="cursor-pointer hover:text-indigo-600 overflow-hidden"><p>{video.title}</p></li>
                                            <div className="flex items-end justify-between"><p className="flex items-center gap-2 mt-2"><MdOndemandVideo className="text-sm text-gray-400"/><span className="text-[12px] text-gray-400 font-[500]">{video.videoLength} sec</span></p>{ userId === authorId && <MdDelete onClick={()=>{deleteMutation(video.id)}} className="text-gray-500 cursor-pointer"/>}</div>
                                        </div>
                                    )
                                })}
                            </ul>
                            { userId === authorId && <Link to={ currentWidth<=breakPoint ? `../uploadVideo/${section.id}` : `uploadVideo/${section.id}` } state={{sectionName:section.name}} className="w-fit flex gap-2 px-2 py-3 items-center cursor-pointer hover:border-b-1 border-indigo-600 transition-all duration-100"><span className="text-indigo-600"><RiVideoUploadLine/></span>upload video</Link>}
                    </div>:null}
            </div>
        </div>
    );
}

export default SectionSlice;