import useGetCourses from "../customHooks/useGetCourses";
import { useDispatch , useSelector } from "react-redux";
import { setPageNo } from "../rtk/slices/coursesPageNo";
import styles from "./paginations.module.css";
function Pagination(props){
    const coursesLength=useGetCourses().length;
    let pageNo=useSelector((state)=>state.pageNo.page);
    const dispatch=useDispatch();

    let pages=[];
    for(let i=1 ; i<= Math.ceil(coursesLength / props.coursesLimit ) ; ++i){
        pages.push(i);
    }


    const paginationList=pages.map((page)=>{
        return(
            <button key={page} onClick={()=>{dispatch(setPageNo(page))}} className={pageNo === page ? `${styles.active}` : `${styles.unactive}`}>{page}</button>
        )
    })

    return(
        <div className="paginations flex justify-center">
        <nav aria-label="Page navigation example">
            <ul className="flex items-center -space-x-px h-8 text-sm">
                <li onClick={()=>{
                    if(pageNo === 1){
                        return;
                    }else{
                        dispatch(setPageNo(--pageNo));
                    }
                }}>
                    <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700">
                        <span className="sr-only">Previous</span>
                        <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
                        </svg>
                    </a>
                </li>
            
                {paginationList}

                <li onClick={()=>{
                    if(pageNo === pages.length){
                        return;
                    }else{
                        dispatch(setPageNo(++pageNo));
                    }
                }}>
                    <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700">
                    <span className="sr-only">Next</span>
                    <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
    );
}

export default Pagination;