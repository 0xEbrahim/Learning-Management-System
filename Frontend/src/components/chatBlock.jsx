import { useState , useEffect } from "react";
import { socket } from "../pages/homePage";
import { useSelector } from "react-redux";
import { getUserById } from "../services/userServices";
import { BsSendFill } from "react-icons/bs";
import ScrollToBottom from "react-scroll-to-bottom";

function ChatBlock({receiverId}){
    const [message , setMessage]=useState("");
    const [messages , setMessages]=useState([]);
    const [typing , setTyping]=useState(false);
    const [typingUser , setTypingUser]=useState(null);
    const userId = useSelector((state) => state.auth.userId);
    const [recieverData , setRecieverData]=useState(null);
    //send message
    const sendMessage=async()=>{

        if(message){
            const messageData={
                message:message,
                senderId:userId,
                receiverId:receiverId,
                private:true
            }
           await socket.emit("sentMessage", messageData);
           setMessages((messages)=>[...messages,messageData]);
           setMessage("");
        }

    }
    //get recieverData by id
    useEffect(()=>{
       if(receiverId){
        getUserById(receiverId ,setRecieverData);
       }
    },[receiverId])

    //receive message
    useEffect(()=>{
        socket.on(("receiveMessage", (data)=>{
            if(data){
                setMessages((messages)=>[...messages, data])
            }
        }))
    },[socket])

    //handle inputChange and typing event
    const handleInputChange=(value)=>{
        setMessage(value);
        socket.emit("typing" , {userId:userId})
    }

    // receive typing userEvent
    useEffect(()=>{
        socket.on("userTyping" , (data)=>{
            if (data.userId !== userId){
                setTyping(true);
            }
        })
    },[socket])

    return(
        <div className=" chat-block w-full">
            <div className="chat-head bg-white p-4">
              {
                recieverData?.id ?   <div className="receiver-info flex items-start gap-2">
                <img className=" w-10 h-10 rounded-full object-cover" src={recieverData?.avatar}/>
                <div>
                <p className="font-bold">{recieverData?.name}</p>
                <span className="block text-indigo-600 text-sm font-[500]">Typing...</span>
                </div>
                </div> : <h2>chat</h2>
              }
            </div>
            <div className="chat-body bg-[#f5f5f5ba] h-[100vh] border-1 border-gray-200">
                <ScrollToBottom className="messages-container overflow-y-scroll w-full h-full">
                    {messages.map((message)=>{
                        return(
                            <p className="p-2 bg-white w-[300px] mt-3 rounded-xl ml-2" key={message.senderId}>{message.message}</p>
                        )
                    })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer w-full flex sticky bottom-[10px] justify-center ">
                <input className="w-[80%] rounded-md rounded-r-none  bg-white outline-none accent-indigo-600 p-2" value={message}  onChange={(e)=>{handleInputChange(e.target.value)}}/>
                <button onClick={()=>{sendMessage()}} className="text-white bg-indigo-600 px-3 py-2 rounded-md rounded-l-none cursor-pointer"><BsSendFill/></button>
            </div>
        </div>
    );
}

export default ChatBlock;