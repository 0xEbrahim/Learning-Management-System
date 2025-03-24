import Loading from "../components/loading";
import { useState , useEffect } from "react";
import { MdOutlineRateReview } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { CiStar } from "react-icons/ci";

function Reviews(){
    const [addReview,setAddReview]=useState(false);
    const [rating, setRating] = useState(0);      // Selected rating  
    const [reviews,setReviews] = useState([]);
    return(
       <div>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-[600]">Reviews</h3>
                <button onClick={()=>{setAddReview(true)}} className="px-2 py-1 text-white bg-indigo-600 rounded-lg flex gap-2 items-center cursor-pointer"><FaPlus/>Add Review</button>
            </div>
            {addReview && 
                        <form className="add-review p-4 border-1 border-gray-200 rounded-sm max-w-[600px] mx-auto mt-3 mb-6">
                        <h4>Write Review</h4>
                        <div className="score">
                            <p className="mb-2 text-gray-700">score:</p>
                            <div className="rating flex items-center">
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <label htmlFor="rating" key={index}>
                                            <input id="rating" type="radio" value={starValue} className="hidden" name="rating"/>
                                            <CiStar className="text-2xl text-amber-400 cursor-pointer"/>
                                    </label>
                                );
                            })}
                            </div>
                        </div>
                        <div className="review mb-3">
                            <p>review:</p>
                            <textarea className="border-1 border-gray-200 h-[100px] w-full rounded-sm outline-none p-2"/>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={()=>{setAddReview(false)}} className="px-2 py-0.5 bg-white text-indigo-600 cursor-pointer border-1 border-gray-200 rounded-md hover:text-white hover:bg-indigo-400">Cancel</button>
                            <button className="px-3 py-0.5 bg-indigo-600 text-white cursor-pointer border-1 border-gray-200 rounded-md">Post</button>
                        </div>
                    </form>}
                    <div>
                    <p className="text-gray-600 flex items-center gap-1 mb-3"><span className="block">0</span>Reviews</p>
                    </div>
                    <div className="reviews-box">
                        {/* map reviews */}
                        <div className="review-box p-4 border-gray-100 border-1 rounded-md max-w-[600px] ">
                            {/* add reviewer avatar && rating && review*/}
                            review#1
                        </div>
                    </div>

       </div>
    )
}

export default Reviews;