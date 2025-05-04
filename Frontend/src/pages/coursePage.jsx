import { useParams } from "react-router-dom";
import { useState , useEffect, useLayoutEffect } from "react";
import api from "../axiosInstance";
import Loading from "../components/loading";
import { FiShoppingBag } from "react-icons/fi";
import { FaRegCirclePlay } from "react-icons/fa6";
import { TbClockHour4 } from "react-icons/tb";
import { CiStar } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosLock } from "react-icons/io";
import { NavLink , Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import styles from "./coursePage.module.css";
import { useDispatch } from "react-redux";
import { setAuthorId } from "../rtk/slices/courseAuthorID";
import { useSelector } from "react-redux";
import { MdAddBox } from "react-icons/md";

function CoursePage(){
    const dispatch=useDispatch();
    const {courseId}=useParams();
    const [ course , setCourse ]=useState({});
    const [showForm,setShowForm]=useState(false);
    const [ loading , setLoading]=useState(true);
    const [sectionNameInput,setSectionNameInput]=useState("");

    //re-render when refresh
    const userData=useSelector((state)=>state.user.userData);
    useEffect(()=>{
        const getCourseData=async()=>{
            try{
                const res= await api.get(`/courses/${courseId}`);
                setCourse(res.data.data.course);
                dispatch(setAuthorId(res.data.data.course.publisherId));
            }catch(error){
                return;
            }finally{
                setLoading(false);
            }
        }
        getCourseData();
    },[courseId , userData])

    const addSection=async()=>{
        const res=await api.post(`/sections` ,{
            courseId:courseId,
            name:sectionNameInput
        })
    }
    return(
        <div>
            {/* add loading effect using conditional rendering */}
            <div>
                <div className="course-title flex items-center justify-between mb-4 mt-1">
                    <h1 className="text-md text-gray-700 font-[500] flex items-center gap-1"><FiShoppingBag/>courses <span className="text-gray-400">/</span> category  <span className="text-gray-400">/</span> {course.name}</h1>
                </div>
                <div className="flex items-center gap-2 mb-2 ">
                    <h2 className="font-[600] text-xl flex items-center gap-2"><span className="block p-1.5 border-1 border-gray-300 text-sm text-gray-500 bg-white rounded-sm"><Link to="../courses"><IoIosArrowBack/></Link></span>{course.name}</h2>
                    <p className=" rounded-2xl px-4 py-0.5 bg-gray-100 border-1 border-gray-400 text-[12px] text-gray-600 font-[500]">category</p>
                </div>
                <div className="flex md:items-center md:justify-between md:flex-row flex-col gap-2 mb-3">
                <div className=" course-info flex items-center gap-2">
                    <div className="lessons flex items-center gap-1"><FaRegCirclePlay className="text-indigo-600"/><p className="text-gray-500 text-sm">Lessons</p></div>
                    <div className="lessons flex items-center gap-1"><TbClockHour4 className="text-indigo-600"/><p className="text-gray-500 text-sm">Duration</p></div>
                    <div className="lessons flex items-center gap-1"><CiStar className="text-indigo-600"/><p className="text-gray-500 text-sm">Rating-Reviews</p></div>
                </div>
                <div>
                    <button className="md:w-fit w-full cursor-pointer text-white text-md px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-md  flex items-center gap-1 justify-center"><IoIosLock/>Enroll Now</button>
                </div>
                </div>
                <div className="layout grid xl:grid-cols-4 grid-cols-1">
                    <div className="xl:col-span-3 col-span-1">
                        <div className="video overflow-hidden mb-3">
                            {/* add chosen video */}
                            <img className="w-full h-auto object-cover" src={course.thumbnail} alt="chosen video"/>
                        </div>
                        <ul className="flex items-center gap-3 mb-3">
                        <li><NavLink to="" end className={({ isActive }) =>
                                                        isActive
                                                            ? `${styles.active}`
                                                            : `${styles.unactive}`
                                                        }>Overview                
                                </NavLink>
                            </li>
                            <li><NavLink to="author" className={({ isActive }) =>
                                                        isActive
                                                            ?`${styles.active}`
                                                            : `${styles.unactive}`
                                                        }>Author                
                                </NavLink>
                            </li>
                            <li><NavLink to="reviews" className={({ isActive }) =>
                                                        isActive
                                                            ? `${styles.active}`
                                                            : `${styles.unactive}`
                                                        }>Reviews               
                                </NavLink>
                            </li>
                            <li><NavLink to="FAQ" className={({ isActive }) =>
                                                        isActive
                                                            ? `${styles.active}`
                                                            : `${styles.unactive}`
                                                        }>FAQ                
                                </NavLink>
                            </li>
                        </ul>
                        <div className="bg-white p-4 border-1 border-gray-200">
                            <Outlet/>
                        </div>
                    </div>
                    <div className=" course-content col-span-1 bg-white p-2 h-fit">
                       <div className="flex justify-between items-center">
                            <h2 className="font-[600]">Course Content</h2>
                            <MdAddBox onClick={()=>{setShowForm(true)}} className=" add-section cursor-pointer text-2xl text-indigo-600"/>
                       </div>
                        {showForm ? <div className="add-section-form mt-3">
                                        <input className="bg-gray-50 border-1 border-gray-300 rounded-sm outline-none mt-2 px-2 py-1 text-sm" placeholder="add section" value={sectionNameInput} onChange={(e)=>{setSectionNameInput(e.target.value)}}/>
                                        <button onClick={()=>{addSection()}} className="w-full px-2 py-1 bg-indigo-600 text-white mt-2 rounded-sm text-[12px] font-[500] cursor-pointer">add</button>
                                        <button onClick={()=>{setShowForm(false)}} className="w-full px-2 py-1 bg-gray-200 text-indigo-600 mt-1 rounded-sm text-[12px] font-[500] cursor-pointer">cancel</button>
                                    </div> : null}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default CoursePage;