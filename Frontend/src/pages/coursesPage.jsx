import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetCategories from "../customHooks/useGetCategories";
import api from "../axiosInstance";
import { useEffect, useState } from "react";
import CourseCard from "../components/courseCard";
import Pagination from "../components/paginations";


function CoursesPage(){
    const currentPageNo=useSelector((state)=>state.pageNo.page);
    const accessToken=useSelector((state)=>state.auth.token);
    const userRole=useSelector((state)=>state.user.userData?.role);
    const categories=useGetCategories();
    const [courses,setCourses]=useState([]);
    const coursesLimit=6;
    const [loading,setLoading]=useState(true);
    const categoriesList=categories.map((cat)=>{
        return(
            <button onClick={()=>{getCategoryCourses(cat.id)}} key={cat.id} className="bg-gray-50 px-3 py-1 text-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-gray-800">{cat.name}</button>
        )
    })

    const coursesList=courses.map((course)=>{
       return(
        <CourseCard key={course.id} id={course.id}/>
       )
    })

    const getCategoryCourses=async(categoryId)=>{
        try{
            const res= await api.get(`/categories/${categoryId}`);
            // setCourses(res.data?.data?.category?.courses);
            console.log(res);
        }catch(error){
            console.log(error);
        }
    }
    useEffect(()=>{
        const getCourses=async()=>{
            try{
                const res= await api.get(`/courses?limit=${coursesLimit}&page=${currentPageNo}`);
                 setCourses(res.data?.data?.courses);
            }catch(error){
                console.log(error);
            }finally{
                setLoading(false);
            }
        }

        getCourses();
    },[accessToken , currentPageNo])



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
                    {loading?<>
                        <div className="flex items-center justify-center w-65 h-65 mx-auto mt-30 ">
                            <div role="status">
                                <svg aria-hidden="true" className="w-17 h-17 text-white animate-spin  fill-indigo-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                            </div>
                        </div>
                            </>:
                            <>
                            <div className="mt-6 grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1  gap-3">
                                {coursesList}
                            </div>      
                            <Pagination coursesLimit={coursesLimit} />
                            </>}
                       
                </div>
        </>
    )
}
export default CoursesPage;
