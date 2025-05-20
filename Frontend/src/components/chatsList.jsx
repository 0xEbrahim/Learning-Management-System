import { getUsers } from "../services/userServices";
import { useEffect , useState } from "react";
import { useSelector } from "react-redux";
import ScrollToBottom from "react-scroll-to-bottom";

function ChatsList({setReceiverId}){
    const [users,setUsers]=useState([]);
    const accessToken = useSelector((state) => state.auth.token);
    const userId = useSelector((state) => state.auth.userId);

    useEffect(()=>{
        getUsers(setUsers)
    },[userId, accessToken])

    const handleReceiver=(id)=>{
        setReceiverId(id)
    }
    return(
        <div className="chats-container min-h-[100vh] bg-white p-4 border-1 border-gray-200 ">
            <h1 className="text-indigo-600 font-bold text-xl">Chats</h1>
            <div className="max-w-md mx-auto mt-4">   
             <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="search" id="default-search" className="block w-full p-2 ps-10 text-sm text-gray-900 border-1 border-gray-200 outline-none rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500" placeholder="" />
            <button type="submit" className="cursor-pointer text-white absolute end-1 bottom-1.5 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-2 py-1">Search</button>
            </div>
            </div>
            <ul className="users-list w-full mt-3">
                <ScrollToBottom>
                {
                users.map((user)=>{
                    return(

                        user.id === userId ? null :
                        <li onClick={()=>{handleReceiver(user.id)}} key={user.id} className="flex items-start gap-2 p-3 w-full cursor-pointer border-b-1 border-gray-100">
                        <img className="w-7 h-7 rounded-full object-cover" src={user.avatar}/>
                        <p>{user.name}</p>
                        </li>

                    )
                })
            }
                </ScrollToBottom>
            </ul>
        </div>
    );
}

export default ChatsList;