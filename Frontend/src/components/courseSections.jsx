import SectionSlice from "./sectionSlice";
import { useQuery } from "@tanstack/react-query";
import { getSections } from "../services/sectionServices";
import { useParams } from "react-router-dom";
function CourseSection(){
    const {courseId}=useParams();
    const {isLoading , data:sections }=useQuery({
        queryKey:["courseSections" , courseId],
        queryFn:()=>getSections(courseId),
    })

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