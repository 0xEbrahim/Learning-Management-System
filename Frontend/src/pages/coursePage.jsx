import { useParams } from "react-router-dom";
import { useState , useEffect  } from "react";
import { useDispatch } from "react-redux";
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
import { setAuthorId } from "../rtk/slices/courseAuthorID";
import { useSelector } from "react-redux";
import { MdAddBox } from "react-icons/md";
import { RiVideoAddLine } from "react-icons/ri";
import { addSection } from "../services/sectionServices";
import CourseSection from "../components/courseSections";
import Swal from "sweetalert2";

function CoursePage(){
    const dispatch=useDispatch();
    const {courseId}=useParams();
    const [ course , setCourse ]=useState({});
    const [showForm,setShowForm]=useState(false);
    const [ loading , setLoading]=useState(true);
    const [sectionNameInput,setSectionNameInput]=useState("");
    const [showContentRoute,setShowContentRoute]=useState(false);
    //re-render when refresh
    const userData=useSelector((state)=>state.user.userData);
    const authorId=useSelector((state)=>state.authorId.id);
    const videoUrl=useSelector((state)=>state.videoData.videoUrl);
    const videoThumbnail=useSelector((state)=>state.videoData.videoThumbnail);
    const videoCourseId=useSelector((state)=>state.videoData.courseId);
    const [demoVideo , setDemoVideo]=useState(null);
    const breakPoint=1279;
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

    useEffect(()=>{
        const checkWidth=()=>{
            const currentWidth=window.innerWidth;
            setShowContentRoute(currentWidth<=breakPoint)
        }
        checkWidth();
        window.addEventListener('resize', checkWidth);

        return () => window.removeEventListener('resize', checkWidth);
    },[])

    // upload choosen demo video
    useEffect(()=>{
        const uploadDemoVideo=async()=>{
            const formData=new FormData();
            formData.append("video", demoVideo);
            const res =  await api.post(`/courses/${courseId}/demo` , formData,{
                headers:{
                            "Content-Type": "multipart/form-data",
                        }})
            if(res.status === 200 || res.status === 201){
                setDemoVideo(null);
                Swal.fire({
                    title: "video has been posted successfully",
                    icon: "success",
                    draggable: true
                  })
            }
        }

        if(demoVideo){
            uploadDemoVideo();
        }

    } , [demoVideo])


    const handleVideoChange=(e)=>{
        const file=e.target.files[0];

            if (file && file.type.includes('video')) {
                setDemoVideo(file)
        }else{
            Swal.fire({
                icon: "error",
                title: "you should upload video",
                draggable: true
                });
        }

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
                            {videoUrl && courseId===videoCourseId ? <video className="w-full" poster={videoThumbnail} src={videoUrl} controls autoPlay></video> : <div className="relative"><img className="w-full h-auto object-cover" src={course.thumbnail} alt="chosen video"/>{ (userData?.id === authorId && course.thumbnail) && <label className="text-sm text-indigo-600 absolute bg-white bottom-1 right-1 z-50 flex items-center gap-2 font-[500] py-1 px-1.5 rounded-sm hover:text-white hover:bg-indigo-600 cursor-pointer"><RiVideoAddLine/>add Demo <input className="hidden" type="file" onChange={(e)=>{handleVideoChange(e)}}/></label>}</div>}
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
                            {showContentRoute ?  <li><NavLink to="content" className={({ isActive }) =>
                                                        isActive
                                                            ? `${styles.active}`
                                                            : `${styles.unactive}`
                                                        }>Content                
                                </NavLink>
                            </li> : null}
                        </ul>
                        <div className="bg-white p-4 border-1 border-gray-200">
                            <Outlet/>
                        </div>
                    </div>
                    <div className=" course-content col-span-1 bg-white  h-fit xl:block hidden border-1 border-gray-200 shadow-sm">
                       <div className="flex justify-between items-center p-3">
                            <h2 className="font-[600]">Course Content</h2>
                           { userData?.id === authorId &&  <MdAddBox onClick={()=>{setShowForm(true)}} className=" add-section cursor-pointer text-2xl text-indigo-600"/> }
                       </div>
                        {showForm ? <div className="add-section-form mb-3 px-3">
                                        <input className="bg-gray-50 border-1 border-gray-300 rounded-sm outline-none mt-2 px-2 py-1 text-sm" placeholder="add section" value={sectionNameInput} onChange={(e)=>{setSectionNameInput(e.target.value)}}/>
                                        <button onClick={()=>{addSection( courseId , sectionNameInput )}} className="w-full px-2 py-1 bg-indigo-600 text-white mt-2 rounded-sm text-[12px] font-[500] cursor-pointer">add</button>
                                        <button onClick={()=>{setShowForm(false)}} className="w-full px-2 py-1 bg-gray-200 text-indigo-600 mt-1 rounded-sm text-[12px] font-[500] cursor-pointer">cancel</button>
                                    </div> : null}
                        <div className="sections w-full">
                            <CourseSection />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default CoursePage;