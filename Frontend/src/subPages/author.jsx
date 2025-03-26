import { useEffect , useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../axiosInstance";
import Loading from "../components/loading";

function Author(){
    const authorId=useSelector((state)=>state.authorId.id);
    const { courseId }=useParams();
    const [loading,setLoading]=useState(true);
    const [courses,setCourses]=useState([]);
    const [userAvatar,setUserAvatar]=useState("");

    useEffect(()=>{
        const getAurthorData=async()=>{
            try{
                const res= await api.get(`/courses/${courseId}/users/${authorId}`);
                console.log(res);
            }catch(error){
                console.log(error)
            }
        }
        // getAurthorData();
    },[])

    return(
        <div>
            <h3 className="mb-3 text-xl font-[500]">About Author</h3>
            <div className="author-info">
                {/* author avatar && name */}
            </div>
            <div className="courses">
                <h4 className="text-md tracking-wide text-gray-500">Top Rated Courses</h4>
                <div className="grid grid-cols-5 gap-2">
                    
                </div>
            </div>
        </div>
    )
}

export default Author;