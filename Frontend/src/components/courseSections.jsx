import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useSelector } from "react-redux";
function CourseSection(){
    const sections=useSelector((state)=>state.sections.sections);
    return(
        <>
          {
                sections?.map((section)=>{
                    return(
                       <div className="sections" key={section.id}>
                             <div className=" section-info w-full flex items-center justify-between border-b-1 p-2 border-gray-200 bg-gray-200/30" key={section.id}>
                            <p className="text-gray-600 ">{section.name}</p>
                            <button className="cursor-pointer"><MdOutlineKeyboardArrowDown/></button>
                        </div>
                       </div>
                    )
                })
          }
        </>
    );
}

export default CourseSection;