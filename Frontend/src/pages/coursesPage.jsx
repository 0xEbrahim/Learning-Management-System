import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetCategories from "../customHooks/useGetCategories";
import api from "../axiosInstance";
import { useEffect, useState } from "react";
import CourseCard from "../components/courseCard";

function CoursesPage(){
    const accessToken=useSelector((state)=>state.auth.token);
    const userRole=useSelector((state)=>state.user.userData?.role);
    const categories=useGetCategories();
    const [courses,setCourses]=useState([]);

    const categoriesList=categories.map((cat)=>{
        return(
            <button key={cat.id} className="bg-gray-50 px-3 py-1 text-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-gray-800">{cat.name}</button>
        )
    })


    const coursesList=courses.map((course)=>{
       return(
        <CourseCard key={course.id} id={course.id}/>
       )
    })

    useEffect(()=>{
        const getCourses=async()=>{
            try{
                const res= await api.get(`/courses`);
                setCourses(res.data?.data?.courses);
            }catch(error){
                console.log(error);
            }
        }

        getCourses();
    },[accessToken])

    return(
        <>
            <div className="flex items-center justify-between">
                    <div> <h1 className="text-2xl font-bold">Courses</h1></div>
                    {userRole==="TEACHER"&&<div><Link to="/homePage/newCourse" className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-md cursor-pointer flex items-center gap-2"><FaPlus />Add course</Link></div>}
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4 mb-4 items-center">
                <div>
                    <form className="max-w-[300px]">   
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="search" id="default-search" className="block w-full p-3 ps-10 text-sm text-gray-900 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:outline-none " placeholder="Explore Courses" required />
                            <button type="submit" className="text-white absolute end-2 bottom-1 bg-indigo-600 hover:bg-indigo-700 focus:ring-3 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-2 py-2">Search</button>
                        </div>
                    </form>
                    </div>
                    <div>
                        <ul className="flex items-center gap-1 flex-wrap">
                            {categoriesList}
                        </ul>
                    </div>
                    <div className="mt-6 grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1  gap-3">
                        {coursesList}
                    </div>
                </div>
        </>
    )
}
export default CoursesPage;