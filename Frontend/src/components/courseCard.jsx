import { Link } from "react-router-dom";
function CourseCard(){
    return(
        <div className="bg-white border border-gray-100 rounded-lg cursor-pointer">
            <Link to="">
                <img className="rounded-t-lg" src="//" alt="course img" />
                {/* add price */}
            </Link>
        <div className="p-3">
            <Link to="">
                <h5 className="mb-1  text-2xl font-[600] tracking-tight text-gray-900">Course Title</h5>
            </Link>
            <p className="mb-3 font-bold text-indigo-600 text-sm"> Course category</p>
            <div className="flex items-center gap-3">
                <p>lessons</p>
                <p>.hours</p>
            </div>
        </div>
        </div>
    );
}
export default CourseCard;