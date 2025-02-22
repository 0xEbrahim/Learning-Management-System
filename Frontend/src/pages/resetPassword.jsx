import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
function ResetPassword(){
    const apiUrl = import.meta.env.VITE_API_URL;
    const {token}=useParams();
    let [password,setPassword]=useState("");
    let [confirmPassword,setConfirmPassword]=useState("");
    let [error,setError]=useState("");
    let[response,setResponse]=useState("");
    // console.log(token);

let handlePassowrd=(value)=>{
    setPassword(value)
}
let handleConfirmPassowrd=(value)=>{
    setConfirmPassword(value)
}



function sendResetData(){
    if(confirmPassword!==password){
        setError("Passwords do not match!");
        return;
       
    }
    axios({
      method: 'post',
      url: `${apiUrl}/auth/reset-password`,
      data: {
        token:token,
        password:password,
        confirmPassword:confirmPassword
      },
      headers:{
        Accept:'applicaton/json',
        "Content-Type":'application/json'
      }
    }).then((response)=>{
      setResponse(response.data.message);
    }).catch((err)=>{
      setError(err.response.data.message.slice(0,60));
    });
  }
    return(
<div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-lg">
    <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">Set New Password</h1>

    <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
      Must be at Least 6 characters
    </p>

    <form action="#" className="mt-6 mb-0 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8" onSubmit={(e)=>{e.preventDefault()}}>
      <p className="text-center text-lg font-medium">Reset Password</p>

      <div>
        <label htmlFor="email" className="sr-only">Password</label>

        <div className="relative">
          <input
            type="password"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
            placeholder="Enter password"
            onChange={(e)=>{ handlePassowrd(e.target.value)}}
          />

<span className="absolute inset-y-0 end-0 grid place-content-center px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="password" className="sr-only">Confirm Password</label>

        <div className="relative">
          <input
            type="password"
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
            placeholder="Enter confirm password"
            onChange={(e)=>{ handleConfirmPassowrd(e.target.value)}}

          />

          <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </span>
        </div>
      </div>
      {error && <p className='text-red-500 col-span-6'>{error}</p>}
      {response&&<p className='text-indigo-600 col-span-6'>{response}</p>}
      <button
        type="submit"
        className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white cursor-pointer"
        onClick={()=>{sendResetData()}}
      >
        Reset Password
      </button>
        <Link to="/login" className="items-center flex justify-center gap-2 text-gray-500 tracking-tight"><FaArrowLeft className="text-sm"/>Go back to login</Link>
    </form>
  </div>
</div>
    );
}
export default ResetPassword;