import Loading from "../components/loading";
import { useState , useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import api from "../axiosInstance";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2'

function Reviews(){
    const [addReview,setAddReview]=useState(false);
    const [review,setReview]=useState("");
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);     // Selected rating  
    const {courseId}=useParams();
    const [reviews,setReviews] = useState([]);
    const [reviewerId,setReviewerId]=useState();
    const [reviewDate,setReviewDate]=useState("");
    useEffect(()=>{

        const getReview=async()=>{
            try{
                const res=await api.get(`courses/${courseId}/reviews`);
                setReviews(res.data.data.reviews);
                setReviewerId(res.data.data.userId);
            }catch(error){
                console.log(error)
            }
        }

        getReview();

    },[]);

    const handleReviewChange=(value)=>{
        setReview(value);
    }

    const postReview=async()=>{

       try{
            const res= await api.post(`/courses/${courseId}/reviews`,{
                review:review,
                rating:rating
            })

            if(res.status === 201 || res.status === 200){
                setAddReview(false);
                Swal.fire({
                    title: "review posted successfully",
                    icon: "success",
                  });
            }

       }catch(error){

        Swal.fire({
            title: "cant post your review",
            icon: "error",
          });
       }

    }

    const reviewsList=reviews.map((review)=>{
        return(
            <div className="review-box p-4 max-w-[600px] mb-3 border-b-1 border-gray-200" key={review.id}>
                <div className="review-info flex justify-between items-center">
                    <ReviewerData reviewerId={review.userId} reviewDate={review.createdAt.slice(0,10)}/>
                    <div className="rating flex items-center gap-1"><CiStar className="text-yellow-400"/><span className="block text-sm">{review.rating}</span></div>
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


function ReviewerData({reviewerId , reviewDate}){
    const [avatar,setAvatar]=useState();
    const [userName,setUserName]=useState("");
    const currentDate=new Date;
    
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
                <p className="font-bold">{userName}</p>
                <p className="text-gray-500 text-sm">{reviewDate}</p>
            </div>
        </div>
    )
}
export default Reviews;