import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useState , useEffect } from "react";
import { RiVideoUploadLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { MdOndemandVideo } from "react-icons/md";

function SectionSlice({index , section}){
    const [expand,setExpand]=useState(false);
    const breakPoint=1279;
    const [currentWidth,setCurrentWidth]=useState(window.innerWidth)
    useEffect(()=>{
        const checkWidth=()=>{
             setCurrentWidth(window.innerWidth);
        }
        checkWidth();
        window.addEventListener('resize', checkWidth);

        return () => window.removeEventListener('resize', checkWidth);
    },[])

    useEffect(()=>{

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
                                            <li  className="cursor-pointer hover:text-indigo-600"><p>{video.title}</p></li>
                                            <p className="flex items-center gap-2 mt-2"><MdOndemandVideo className="text-sm text-gray-400"/><span className="text-[12px] text-gray-400 font-[500]">{video.videoLength} sec</span></p>
                                        </div>
                                    )
                                })}
                            </ul>
                            <Link to={ currentWidth<=breakPoint ? `../uploadVideo/${section.id}` : `uploadVideo/${section.id}` } state={{sectionName:section.name}} className="w-fit flex gap-2 px-2 py-3 items-center cursor-pointer hover:border-b-1 border-indigo-600 transition-all duration-100"><span className="text-indigo-600"><RiVideoUploadLine/></span>upload video</Link>
                    </div>:null}
            </div>
        </div>
    );
}

export default SectionSlice;