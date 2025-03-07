import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
function CoursesPage(){
    return(
        <>
            <div className="flex items-center justify-between">
                    <div> <h1 className="text-2xl font-bold">Courses</h1></div>
                    <div><Link to="/homePage/newCourse" className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-md cursor-pointer flex items-center gap-2"><FaPlus />Add course</Link></div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4 mb-4 items-center">
                <div>
                    <form className="max-w-[300px]">   
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 rounded-lg bg-gray-50 focus:ring-indigo-500  dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 focus:outline-none  " placeholder="Explore Courses" required />
                            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Search</button>
                        </div>
                    </form>
                    </div>
                    <div>
                    <select id="countries" className="bg-gray-50  text-gray-900 text-md rounded-lg  block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:text-white focus:outline-none max-w-[300px]">
                      <option value="all-categories">all categories</option>
                      <option value="software">software</option>
                      <option value="physics">physics</option>
                      <option value="language">language</option>
                      <option value="chemistry">chemistry</option>
                    </select>
                    </div>
                </div>
        </>
    )
}
export default CoursesPage;