import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState , useEffect } from "react";
import api from "../axiosInstance";
function CourseCard(props){
    const accessToken=useSelector((state)=>state.auth.token)
    const [course,setCourse]=useState([]);
    // const [categories,setCategories]=useState([]);
    useEffect(()=>{
        const getCourse=async()=>{
           try{
            const res= await api.get(`/courses/${props.id}`);
            setCourse(res.data?.data?.course);
            // setCategories(course.categories);
           }catch(error){
                console.log(error);
           }
        }

        getCourse();
    },[accessToken])

    // const courseCategories=categories.map((cat)=>{
    //     return(
    //         <li key={cat.categoryName} className="bg-gray-50 px-2 py-1 text-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-gray-800">{cat.categoryName}</li>
    //     )
    // })

    return(
        <div className="bg-white border border-gray-100 rounded-lg cursor-pointer flex flex-col relative min-h-[370px]">
            <Link to={`course/${course.id}`}>
                <div className="image overflow-hidden rounded-t-lg bg-gray-50 border-none"><img className=" w-full h-[180px] object-cover" src={course.thumbnail} alt="" loading="lazy"/></div>
            </Link>
        <div className="p-3">
            <Link to={`course/${course.id}`}>
                <h5 className="mb-1 text-xl font-[600] tracking-tight text-gray-900">{course.name}</h5>
            </Link>
            <p className="text-sm mb-3 text-gray-700">{course.description}</p>
            {/* <ul className="flex items-center gap-1">
                {courseCategories}
            </ul> */}
            <div className="absolute bottom-3">
            <div className="publisher-info flex items-center gap-1">
            <img className="h-[30px] w-[30px] rounded-full object-cover" src={course?.publisher?.avatar}></img>
            <p className="mt-1">{course.publisher?.name}</p>
            </div>
            <span className=" block text-sm text-indigo-600 font-[600] mt-1">Price ${course.price}</span>
            </div>
        </div>
        </div>
    );
}
export default CourseCard;