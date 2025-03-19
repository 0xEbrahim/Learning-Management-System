import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { FaPlusSquare } from "react-icons/fa";
import api from "../axiosInstance";
import { useState} from "react";
import useGetCategories from "../customHooks/useGetCategories";

function NewCourse(){
    const navigate=useNavigate();
    //get categories from useGetCategories custom hook
    const categories=useGetCategories();
    const [courseName,setCourseName]=useState("");
    const [coursePrice,setCoursePrice]=useState("");
    const [courseDescription,setCourseDescription]=useState("");
    const [courseCategories,setCourseCategories]=useState([]);
    const [courseImage,setCourseImage]=useState(null);
    const [error,setError]=useState("");

    const handleCourseNameChange=(value)=>{
        setCourseName(value);
    }
    const handleCoursePriceChange=(value)=>{
        setCoursePrice(value);
    }
    const handleCourseDescriptionChange=(value)=>{
        setCourseDescription(value);
    }

    const handleCourseCategoriesChange=(val)=>{
        const { value, checked } = val;
        if (checked) {
        setCourseCategories([...courseCategories, value]);
        } else {
        setCourseCategories(courseCategories.filter((category) => category !== value));
        }
    }

    const handleCourseImageChange=(value)=>{
        setCourseImage(value);
       
    }

    const addNewCourse=async()=>{
        const formData=new FormData();
        formData.append("name",courseName);
        formData.append("price",coursePrice);
        formData.append("description",courseDescription);
        formData.append("categories",JSON.stringify(courseCategories));
        formData.append("image",courseImage);
        console.log(formData);
        try{
            const res=await api.post(`/courses`,formData,{
                headers:{
                            "Content-Type": "multipart/form-data",
                        }
            })

            if(res.status === 201){
                Swal.fire({
                    title: "course added successfully",
                    icon: "success"
                  }).then(()=>{
                    navigate("/homePage/courses");
                  });
            }
            
        }catch(error){
            if(error.response?.status === 400){
                Swal.fire({
                    icon: "error",
                    text: `${error.response?.data?.message?.slice(18,64)}`,
                  })
            }

            if(error.response?.status === 403){
                Swal.fire({
                    icon: "error",
                    text: "Session expired, please login again",
                  }).then(()=>{
                    navigate("/login");
                  });
            }

            if(error.response?.status === 500){
                Swal.fire({
                    icon: "error",
                    text: "Error while creating course",
                  })
            }

        }
    }


    const categoriesList=categories.map((category)=>{
        return(
            <div key={category.id} className="flex items-center">
            <input  id="Language" type="checkbox" value={category.name} checked={courseCategories.includes(category.name)} onChange={(e)=>handleCourseCategoriesChange(e.target)} className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-indigo-500 accent-indigo-600"/>
            <label htmlFor="Language" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{category.name}</label>
            </div>
        )
    })

    return(
        <>
            <h1 className="font-bold text-2xl">Add New Course</h1>
            <div className="flex items-center justify-end gap-1">
                <button onClick={()=>navigate("/homePage/courses")} className=" font-bold btn bg-indigo-100 hover:bg-indigo-200 text-indigo-600 px-3 py-2 rounded-lg text-md cursor-pointer mt-8">Cancel</button>
                <button onClick={()=>addNewCourse()} className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-md cursor-pointer mt-8">Save & Continue</button>
            </div>
            <form className="grid lg:grid-cols-3 gap-3 sm:grid-cols-1 mt-4" onSubmit={(e)=>{e.preventDefault()}}>
                <div className="col-span-2 bg-white p-4 rounded-lg">
                    <div className="w-full">
                        <div className="mb-4">
                            <label htmlFor="default-input" className="block mb-2 text-md font-medium text-gray-900">Course Title</label>
                            <input type="text" id="default-input" className="outline-none border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Enter...." onChange={(e)=>{handleCourseNameChange(e.target.value)}}/>
                        </div>
                        <p className='mb-3 text-md font-medium text-gray-900'>Course Category</p>
                        <div className="mb-4 grid grid-cols-2 grid-rows-2">
                                {categoriesList}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Course Price</label>
                            <input type="text" id="price" className="outline-none border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Enter...." onChange={(e)=>{handleCoursePriceChange(e.target.value)}}/>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Course Description</label>
                            <textarea id="description" rows="4" className=" outline-none block p-2.5 w-full text-sm text-gray-90 rounded-lg border border-gray-300" placeholder="Description..." onChange={(e)=>{handleCourseDescriptionChange(e.target.value)}}></textarea>
                        </div>
                        
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-1 h-[200px] bg-white border-dashed border-2 border-indigo-600 p-2 rounded-lg ">
                    <div className="flex items-center justify-center flex-col">
                        <label className="cursor-pointer flex items-center justify-center rounded-full text-black">
                            <FaPlusSquare className="text-5xl"/>
                            <input
                            type="file"
                            className="hidden"
                            onChange={(e)=>{handleCourseImageChange(e.target.files[0])}}
                            />
                        </label>
                        <p className="mt-3 text-amber-400">upload Thumbnail</p>
                    </div>
                </div>
            </form>
        </>
    );
}export default NewCourse;