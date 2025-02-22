import {Link} from 'react-router-dom';
import {useState}  from "react";
import axios from 'axios';
import { FaStarOfLife } from "react-icons/fa";
function Register(){
  const apiUrl = import.meta.env.VITE_API_URL;

  let [userName,setUserName]= useState("");
  let [userEmail,setUserEmail]= useState("");
  let [password,setPassword]= useState("");
  let [confirmPassword,setConfirmPassword]=useState("");
  let [userRole,setUserRole]=useState("");
  let [error,setError]=useState("");
  let [response,setResponse]=useState("");



    let handleUserName=(value)=>{
        setUserName(value);
    }
    let handleUserEmail=(value)=>{
      setUserEmail(value);
    }
  let handleUserRole=(value)=>{
    setUserRole(value);
  }
    let handlePassowrd=(value)=>{
    setPassword(value);
  }
    let handleConfirmPassword=(value)=>{
    setConfirmPassword(value);
  }

      // make sure password===confirm password

  function sendRegisterDate(){
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    axios({
      method: 'post',
      url: `${apiUrl}/auth/register`,
      data: {
        name:userName,
        email:userEmail,
        password:password,
        confirmPassword:confirmPassword,
        image:"",
        role:userRole
      },
      headers:{
        Accept:'applicaton/json',
        "Content-Type":'application/json'
      }
    }).then((res)=>{
      setResponse(res.data.message)
    }).catch((err)=>{
      setError(err.response.data.message.slice(0,60));
    });
  }

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
          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700">
              UserName
            </label>

            <input
              type="text"
              id="FirstName"
              name="first_name"
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs"
              onChange={(e)=>{handleUserName(e.target.value) 
              }}
            />
          </div>

          <div className="col-span-6">
            <label htmlFor="Email" className="block text-sm font-medium text-gray-700"> Email </label>

            <input
              type="email"
              id="Email"
              name="email"
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs"
              onChange={(e)=>{handleUserEmail(e.target.value)
              }}
            />
          </div>
            {/* choose your rule */}
            <div className='col-span-6 flex items-center gap-1 mt-3'><FaStarOfLife className='text-indigo-600 text-sm' /><p className='col-span-6 text-md font-bold'>Choose Your Rule</p></div>
            <div className='col-span-3 items-center flex gap-1 mb-3'>
              <input type="radio" id="teacher" name="role" value="TEACHER" className='accent-indigo-600' onChange={(e)=>{handleUserRole(e.target.value)}}></input>
              <label  htmlFor="teacher" className="text-sm font-medium text-gray-700">Teacher</label>
            </div>
            <div className='col-span-3 items-center flex gap-1 mb-3'>
              <input type="radio" id="student" name="role" value="STUDENT" className='accent-indigo-600' onChange={(e)=>{handleUserRole(e.target.value)}}></input>
              <label  htmlFor="student" className="text-sm font-medium text-gray-700">Student</label>
            </div>
          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="Password" className="block text-sm font-medium text-gray-700"> Password </label>

            <input
              type="password"
              id="Password"
              name="password"
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs"
              onChange={(e)=>{handlePassowrd(e.target.value)
              }}
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="PasswordConfirmation" className="block text-sm font-medium text-gray-700">
              Password Confirmation
            </label>

            <input
              type="password"
              id="PasswordConfirmation"
              name="password_confirmation"
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs"
              onChange={(e)=>{handleConfirmPassword(e.target.value)

              }}
            />
          </div>


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

              onClick={()=>{
                sendRegisterDate();
              }}
            >
              Create an account
            </button>

            <p className="mt-4 text-sm text-gray-500 sm:mt-0">
              Already have an account?
              <Link to="/login" className="text-gray-700 underline">Log in</Link>.
            </p>
          </div>
          {/* conditional redering */}
          {error && <p className='text-red-500 col-span-6'>{error}</p>}
          {response && <p className='text-indigo-500 col-span-6'>{response}</p>}
        </form>
      </div>
    </main>
  </div>
</section>
    )
}

export default Register;