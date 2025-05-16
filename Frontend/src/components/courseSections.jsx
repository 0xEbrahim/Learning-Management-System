import { useSelector } from "react-redux";
import SectionSlice from "./sectionSlice";
function CourseSection(){
    const sections=useSelector((state)=>state.sections.sections);
    return(
        <>
          {
                sections?.map((section , index)=>{
                    return(
                        <SectionSlice section={section} index={index} key={section.id}/>
                    )
                })
          }
        </>
    );
}

export default CourseSection;