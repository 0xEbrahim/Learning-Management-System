import { useState } from "react";
import { useSelector } from "react-redux";
import CourseSection from "../components/courseSections";
import { MdAddBox } from "react-icons/md";
import { addSection } from "../services/sectionServices";
import { useParams } from "react-router-dom";
import { useQueryClient , useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";

function CourseContent(){
    const [showForm,setShowForm]=useState(false);
    const [sectionNameInput,setSectionNameInput]=useState("");
    const {courseId}=useParams();
    const userId=useSelector((state)=>state.user.userData?.id);
    const authorId=useSelector((state)=>state.authorId?.id);

    const queryClient=useQueryClient();
    const { isLoading:isAdding , mutate}=useMutation({
        mutationFn:()=> addSection(courseId , sectionNameInput),
        onSuccess:()=>{
            setShowForm(false);
            setSectionNameInput("");
            Swal.fire({
                title: "section has been added successfully",
                icon: "success",
                draggable: true
              })
            queryClient.invalidateQueries({
                queryKey:["courseSections", courseId]
            })
        }
    })
    return(
        <>

            {showForm ? <div className="add-section-form mb-3 px-3">
                                        <input className="bg-gray-50 border-1 border-gray-300 rounded-sm outline-none mt-2 px-2 py-1 text-sm" placeholder="add section" value={sectionNameInput} onChange={(e)=>{setSectionNameInput(e.target.value)}} disabled={isAdding}/>
                                        <button onClick={()=>{mutate()}} className="px-2 py-1 bg-indigo-600 text-white rounded-sm text-[12px] font-[500] cursor-pointer ms-2">add</button>
                                        <button onClick={()=>{setShowForm(false)}} className="px-2 py-1 bg-gray-200 text-indigo-600 rounded-sm text-[12px] font-[500] cursor-pointer ms-1">cancel</button>
                                    </div> :   userId === authorId && <MdAddBox onClick={()=>{setShowForm(true)}} className=" add-section cursor-pointer text-2xl text-indigo-600 mb-3"/>}
            <div className="sections">
            <CourseSection/>
            </div>
        </>
    )
}

export default CourseContent;
