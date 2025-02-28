import {Link, useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import {useDispatch } from "react-redux";
import { login } from '../rtk/slices/authSlice';
import { useEffect,useState } from 'react';
function Login(){
  let navigate=useNavigate();
  let dispatch=useDispatch();
  // const apiUrl = import.meta.env.VITE_API_URL;
  // console.log(apiUrl);
  let [userEmail,setUserEmail]=useState("");
  let [password,setPassword]=useState("");
  let error=useSelector((state)=>state.auth.error);
  let accessToken=useSelector((state)=>state.auth.token);

  useEffect(()=>{
    if(accessToken){
      navigate("/homePage");
    }
  },[accessToken])

      let handleUserEmail=(value)=>{
        setUserEmail(value);
      }
      let handlePassowrd=(value)=>{
      setPassword(value);
    }

    // function sendLoginData(){
    //   axios({
    //     method: 'post',
    //     url: `${apiUrl}/auth/login`,
    //     data: {
    //       email:userEmail,
    //       password:password,
    //     },
    //     headers:{
    //       Accept:'applicaton/json',
    //       "Content-Type":'application/json'
    //     }
    //   }).then((response)=>{
    //     // let userId=response.data.data.user.id;
    //     setResponse("verified");
    //     console.log(response);
    //     dispatch(logIn(response.data.data.user));
    //   }).catch((err)=>{
    //     setError(err.response.data.message.slice(0,62));
    //   });
    // }


  return(
    <section className="bg-white">
    <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
      <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </aside>
  
      <main
        className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
      >
        <div className="max-w-xl lg:max-w-3xl">
  
          <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Welcome to Learnify
          </h1>
  
          <p className="mt-4 leading-relaxed text-gray-500">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi nam dolorum aliquam,
            quibusdam aperiam voluptatum.
          </p>
  
          <form action="#" className="mt-8 grid grid-cols-6 gap-6" onSubmit={(e)=>{e.preventDefault()}}>
  
            <div className="col-span-6">
              <label htmlFor="Email" className="block text-sm font-medium text-gray-700"> Email </label>
  
              <input
                type="email"
                id="Email"
                name="email"
                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs"
                onChange={(e)=>{handleUserEmail(e.target.value)}}
              />
            </div>
  
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="Password" className="block text-sm font-medium text-gray-700"> Password </label>
  
              <input
                type="password"
                id="Password"
                name="password"
                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs"
                onChange={(e)=>{ handlePassowrd(e.target.value)}}
              />
            </div>
            <Link to="/forgotPassword" className='text-indigo-600 col-span-6'>Forgot password?</Link>
            <div className="col-span-6">
              <p className="text-sm text-gray-500">
                By creating an account, you agree to our
                <a href="#" className="text-gray-700 underline"> terms and conditions </a>
                and
                <a href="#" className="text-gray-700 underline">privacy policy</a>.
              </p>
            </div>
  
            <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
              <button
                className="inline-block shrink-0 rounded-md border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden"
                onClick={()=>{dispatch(login({userEmail,password}))}}
              >
                Continue
              </button>
  
              <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                Dont have account yet?
                <Link to="/" className="text-gray-700 underline">Register</Link>.
              </p>
            </div>
          {/* conditional redering */}
          {error && <p className='text-red-500 col-span-6'>{error}</p>}
          {/* {response==="verified" &&(navigate("/homePage"))} */}
          </form>
        </div>
      </main>
    </div>
  </section>
  )
}
export default Login;