import { MdEmail } from "react-icons/md";
import {useState}  from "react";
import axios from "axios";

function ForgotPassword(){
    const apiUrl = import.meta.env.VITE_API_URL;
    let [userEmail,setUserEmail]=useState("");
    let [response,setResponse]=useState("");
    let [error,setError]=useState("");

    let handleUserEmail=(value)=>{
        setUserEmail(value);
    }


    let sendEmail=async()=>{
        try{
            let response= await axios.patch(`${apiUrl}/auth/forgot-password`,{
                "email":userEmail
          })
          console.log(response);
          setResponse(response.data.message);
        }catch(error){
            setError(error.response.data.message);
        }

    }

    return(
<div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-lg">
    <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">Forgot your password?</h1>

    <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
       enter your email to confirm changing your password
    </p>

    <form action="#" className="mt-6 mb-0 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8" onSubmit={(e)=>{e.preventDefault()}}>

      <div>
        <label htmlFor="email" className="sr-only">Email</label>

        <div className="relative">
          <input
            type="email"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
            placeholder="Enter email"
            onChange={(e)=>{handleUserEmail(e.target.value)}}
          />


        </div>
      </div>


      <button
        type="submit"
        className="flex w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white justify-center items-center gap-2 cursor-pointer"
        onClick={()=>{sendEmail()}}

      >
        Send Email<MdEmail className="text-lg"/>
      </button>
      {error && <p className='text-red-500 col-span-6'>{error}</p>}
      {response && <p className='text-indigo-500 col-span-6'>{response}</p>}
    </form>
  </div>
</div>
    );
}

export default ForgotPassword