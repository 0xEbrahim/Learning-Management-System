import { useSelector } from "react-redux";
import { useState , useEffect } from "react";
import api from "../axiosInstance";

function useGetCategories(){
    const [categories,setCategories]=useState([]);
    const accessToken=useSelector((state)=>state.auth.token);
    
    useEffect(()=>{
        const getCategories=async()=>{
            try{
                const res=await api.get(`/categories`);
                setCategories(res.data.data.categories);
            }catch(error){
                console.log(error);
            }
        }
        
        if(accessToken){
            getCategories();
        }
    },[accessToken]);

    return categories;
}

export default useGetCategories;