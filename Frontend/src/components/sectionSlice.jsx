import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useState , useEffect } from "react";
import { RiVideoUploadLine } from "react-icons/ri";
import { Link } from "react-router-dom";
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

    return(
        <div className="sections" key={section.id}>
            <div className=" section-info w-full border-b-1 border-gray-200 bg-gray-200/30" key={section.id}>
            <div className="section-info w-full flex items-center justify-between p-2">
                     <p className="font-[600]">section{index+1}: {section.name}</p>
                    <button onClick={()=>{setExpand((expand)=>!expand)}} className="cursor-pointer"><MdOutlineKeyboardArrowDown/></button>
            </div>
            {expand?<div className="bg-white w-full p-2">
                            {/* choose path based on window width */}
                            <Link to={ currentWidth<=breakPoint ? `../uploadVideo/${section.id}` : `uploadVideo/${section.id}` } state={{sectionName:section.name}} className="w-fit flex gap-2 items-center cursor-pointer hover:border-b-1 hover:pb-1 border-indigo-600 transition-all duration-100"><span className="text-indigo-600"><RiVideoUploadLine/></span>upload video</Link>
                    </div>:null}
            </div>
        </div>
    );
}

export default SectionSlice;