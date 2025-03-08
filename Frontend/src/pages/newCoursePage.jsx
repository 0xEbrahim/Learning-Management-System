import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from "axios";
import { useState } from "react";
import { FaPlusSquare } from "react-icons/fa";
function NewCourse(){
    const navigate=useNavigate();
    return(
        <>
            <h1 className="font-bold text-2xl">Add New Course</h1>
            <div className="flex items-center justify-end gap-1">
                <button onClick={()=>navigate("/homePage/courses")} className=" font-bold btn bg-indigo-100 hover:bg-indigo-200 text-indigo-600 px-3 py-2 rounded-lg text-md cursor-pointer mt-8">Cancel</button>
                <button className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-md cursor-pointer mt-8">Save & Continue</button>
            </div>
            <form className="grid lg:grid-cols-3 gap-3 sm:grid-cols-1 mt-4">
                <div className="col-span-2 bg-white p-4 rounded-lg">
                    <div className="w-full">
                        <div className="mb-4">
                            <label htmlFor="default-input" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Course Title</label>
                            <input type="text" id="default-input" className="outline-none border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Enter...."/>
                        </div>
                        <p className='mb-3 text-md font-medium text-gray-900'>Course Category</p>
                        <div className="mb-4 grid grid-cols-2 grid-rows-2">
                                <div className="flex items-center">
                                    <input id="software" type="checkbox" value="" className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-indigo-500  accent-indigo-600"/>
                                    <label htmlFor="software" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Software</label>
                                </div>
                                <div className="flex items-center">
                                    <input  id="physics" type="checkbox" value="" className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-indigo-500 accent-indigo-600"/>
                                    <label htmlFor="physics" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Physics</label>
                                </div>
                                <div className="flex items-center">
                                    <input  id="Chemistry" type="checkbox" value="" className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-indigo-500 accent-indigo-600"/>
                                    <label htmlFor="Chemistry" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Chemistry</label>
                                </div>
                                <div className="flex items-center">
                                    <input  id="Language" type="checkbox" value="" className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-indigo-500 accent-indigo-600"/>
                                    <label htmlFor="Language" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Language</label>
                                </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Course Price</label>
                            <input type="text" id="price" className="outline-none border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Enter...."/>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Course Description</label>
                            <textarea id="description" rows="4" className=" outline-none block p-2.5 w-full text-sm text-gray-90 rounded-lg border border-gray-300" placeholder="Description..."></textarea>
                        </div>
                        
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-1 h-[200px] bg-white border-dashed border-2 border-indigo-600 p-2 rounded-lg ">
                    <div className="flex items-center justify-center flex-col">
                        <label className="cursor-pointer flex items-center justify-center rounded-full text-black">
                            <FaPlusSquare className="text-5xl"/>
                            <input
                            type="file"
                            className="hidden"
                            />
                        </label>
                        <p className="mt-3 text-amber-400">upload Thumbnail</p>
                    </div>
                </div>
            </form>
        </>
    );
}export default NewCourse;