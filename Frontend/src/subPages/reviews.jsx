import Loading from "../components/loading";
import { useState , useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import api from "../axiosInstance";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2'
import { initFlowbite } from "flowbite";
import { io } from "socket.io-client";
import { socket } from "../pages/homePage";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../components/ui/dialog"


function Reviews(){
    const [addReview,setAddReview]=useState(false);
    const [review,setReview]=useState("");
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);     // Selected rating  
    const {courseId}=useParams();
    const [courseName,setCourseName]=useState("");
    const [authorId,setAuthorId]=useState("");
    const [reviews,setReviews] = useState([]);
    const userId=useSelector((state)=>state.user?.userData?.id);
    const [reviewDate,setReviewDate]=useState("");

    useEffect(()=>{
        const getReview=async()=>{
            try{
                const res=await api.get(`courses/${courseId}/reviews`);
                setReviews(res.data.data.reviews);

            }catch(error){
                console.log(error)
            }
        }

        getReview();

    },[userId]);

    useEffect(()=>{
        const getCourseData=async()=>{
           const res=await api.get(`courses/${courseId}`);
            setCourseName(res.data.data.course.name);
            setAuthorId(res.data.data.publisherId);
        }

        if(courseId){
            getCourseData();
        }
        
    },[courseId])

    const handleReviewChange=(value)=>{
        setReview(value);
    }

    const postReview=async()=>{

       try{
            const res= await api.post(`/courses/${courseId}/reviews`,{
                review:review,
                rating:rating
            })
            console.log(res);
            if(res.status === 201 || res.status === 200){
                setAddReview(false);
                Swal.fire({
                    title: "review posted successfully",
                    icon: "success",
                  }).then(()=>{
                    socket.emit("addReviewNotification",{
                        authorId:authorId,
                        courseName:courseName,
                        reviewId:res.data.data.review.id
                    })
                  });

                 
            }


       }catch(error){

        Swal.fire({
            title: "cant post your review",
            icon: "error",
          });
       }

    }

    const reviewsList=reviews.map((review,index)=>{
        return(
            <div className="review-box p-4 max-w-[600px] mb-3 border-b-1 border-gray-200" key={review.id}>
                <div className="review-info flex justify-between items-center">
                    <ReviewerData reviewerId={review.userId} userId={userId} reviewDate={review.createdAt.slice(0,10)} id={index} reviewId={review.id}/>
                    <div className="flex items-center gap-2">
                    <div className="rating flex items-center gap-1"><CiStar className="text-yellow-400"/><span className="block text-[14px] font-[500]">{review.rating}</span></div>
                   
                    </div>
                    
                </div>
                
                <p className="review text-md text-gray-600 mb-5 mt-3">
                        {review.review}
                </p>
                <div className="replies flex item-center gap-4 text-sm text-gray-800 mt-[-15px]">
                        <p className="flex gap-1 text-gray-800"><span className="block">0</span>replies</p>
                        <button className="text-indigo-600 cursor-pointer">reply?</button>
                </div>
            </div>
        )
    })


    return(
       <div>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-[600]">Reviews</h3>
                <button onClick={()=>{setAddReview(true)}} className="px-2 py-1 text-white bg-indigo-600 rounded-lg flex gap-2 items-center cursor-pointer"><FaPlus/>Add Review</button>
            </div>
            {addReview && 
                        <form className="add-review p-4 max-w-[600px]  mt-3 mb-6" onSubmit={(e)=>{e.preventDefault()}}>
                        {/* <h4 className="mb-3">Write Review</h4> */}
                        <div className="score mb-3">
                            <p className="mb-1 text-gray-700">score:</p>
                            <div className="rating flex items-center">
                            {[...Array(5)].map((_, index) => {
                                const value = index + 1;
                                return (
                                    <button
                                      key={value}
                                      onClick={() => setRating(value)}
                                      onMouseEnter={() => setHover(value)}
                                      onMouseLeave={() => setHover(0)}
                                      className="focus:outline-none"
                                    >
                                      <CiStar
                                        className={`text-3xl transition-colors ${
                                          value <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                      />
                                    </button>
                                  );
                            })}
                            </div>
                        </div>
                        <div className="review mb-3">
                            <p className="mb-1 text-gray-700">review:</p>
                            <textarea className="border-1 border-gray-200 h-[100px] w-full rounded-sm outline-none p-2" onChange={(e)=>{handleReviewChange(e.target.value)}}/>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={()=>{setAddReview(false)}} className="px-2 py-0.5 bg-white text-indigo-600 cursor-pointer border-1 border-gray-200 rounded-md hover:text-white hover:bg-indigo-400">Cancel</button>
                            <button onClick={()=>{postReview()}} className="px-3 py-0.5 bg-indigo-600 text-white cursor-pointer border-1 border-gray-200 rounded-md">Post</button>
                        </div>
                    </form>}
                    <div>
                    <p className="text-gray-600 flex items-center gap-1 mb-3 text-sm"><span className="block">{reviews.length}</span>Reviews</p>
                    </div>
                    {reviews?(
                        <>
                         <div className="reviews-box">
                              {reviewsList}
                          </div>
                          <button className="cursor-pointer text-indigo-600 hover:text-indigo-700 text-sm font-[500] ms-1">Show More</button>
                        </>
                    ):<Loading/>}

       </div>
    )
}


function ReviewerData({reviewerId , userId , reviewDate , id , reviewId}){
    const [avatar,setAvatar]=useState();
    const [userName,setUserName]=useState("");

    useEffect(() => {
        initFlowbite();
      }, []);
      
    useEffect(()=>{
        const getReviewerData=async()=>{
            try{
                const res=await api.get(`users/${reviewerId}`);
                setAvatar(res.data.data.user.avatar);
                setUserName(res.data.data.user.name);
            }catch(error){
                console.log(error);
            }
        }
            getReviewerData();
    },[])

    return(
        <div className="flex items-center gap-2">
            <img src={avatar} alt="userAvatar" className="rounded-full w-8 h-8 object-cover"/>
            <div>
                <div className="flex items-center gap-2">
                    <p className="font-bold text-sm">{userName}</p>
                    {userId === reviewerId ? <EditReviewDropDown id={id} reviewId={reviewId}/>:null}
                </div>
                <p className="text-gray-500 text-[12px]">{reviewDate}</p>
            </div>
        </div>
    )
}



function EditReviewDropDown({id , reviewId}){
    const {courseId}=useParams();

    const deleteReview=async()=>{
        try{
            const res=await api.delete(`courses/${courseId}/reviews/${reviewId}`);
            if(res.status === 200){
                Swal.fire({
                  title: "review has been deleted successfully",
                  icon: "success",
                }).then(()=>{
                  window.location.reload();
                });
              }
        }catch(error){
            return;
        }
    }

    return(
        <div>
            <button id={`dropdownMenuIconButton-${id+1}`} data-dropdown-toggle={`dropdownDots-${id+1}`} className="cursor-pointer inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 " type="button">
            <svg className="w-2.5 h-2.5 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
            <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
            </svg>
            </button>
            
            <div id={`dropdownDots-${id+1}`} className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 ">
                <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownMenuIconButton">
                <li className="cursor-pointer">
                <Dialog>
                <DialogTrigger>Update</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Update your Review</DialogTitle>
                    <DialogDescription reviewId={reviewId}>
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
                </Dialog>
                </li>
                <li>
                    <button onClick={()=>{deleteReview()}} className="px-4 py-2 hover:bg-gray-50 w-full flex flex-star cursor-pointer text-red-600">Delete</button>
                </li>
                </ul>
            </div>
        </div>
    )
}

export default Reviews;