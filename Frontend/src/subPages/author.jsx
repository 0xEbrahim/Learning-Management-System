import { useEffect , useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../axiosInstance";
import Loading from "../components/loading";
import { CiStar } from "react-icons/ci";
import { Link } from "react-router-dom";

function Author(){
    const authorId=useSelector((state)=>state.authorId.id);
    const { courseId }=useParams();
    const [loading,setLoading]=useState(true);
    const [courses,setCourses]=useState([]);
    const [author,setAuthor]=useState({});

    useEffect(()=>{
        setLoading(true);
        const getAurthorData=async()=>{
            try{
                const res= await api.get(`/courses/${courseId}/users/${authorId}`);
                setCourses(res.data.data.user.publishedCourses.slice(0,5));
                setAuthor(res.data.data.user);
            }catch(error){
                console.log(error)
            }finally{
                setLoading(false);
            }
        }
        getAurthorData();
    },[])

    const topCourses=courses.map((course)=>{
        return(
            <div key={course.id} className="border-gray-200 border-1  rounded-lg">
                <div className="course-img w-full mb-1 overflow-hidden"><Link to={`../../courses/course/${course.id}`}><img className="w-full h-[160px] object-cover rounded-t-md cursor-pointer" src={course.thumbnail}/></Link></div>
                <div className="course-info flex items-center justify-between p-2">
                    <p className="lg:text-lg font-[500]">{course.name}</p>
                    <p className="flex items-center gap-1 mb-2"><CiStar className="text-amber-400 text-lg"/><span className="block">{course.averageRatings.toFixed(2)}</span></p>
                </div>
                <span className="text-indigo-600 block text-sm font-[600] p-2 mb-2">${course.price}</span>
            </div>
        );
    })

    return(
     <>
          {loading ? <Loading/> :
        <div>
        <h3 className="mb-3 text-xl font-[500]">About Author</h3>
        <div className="author-info flex items-center gap-2 mb-3">
            <div><img className="w-12 h-12 rounded-full object-cover" src={author.avatar}/></div>
            <p className="font-[600]">{author.name}</p>
        </div>
        <div className="courses">
            <h4 className="tracking-tight text-gray-500 mb-3">Top Rated Courses</h4>
            <div className="grid lg:grid-cols-3 grid-cols-2 gap-2">
                {topCourses}
            </div>
        </div>
    </div>
       }
     </>
    )
}

export default Author;