import ChatBlock from "../components/ChatBlock";
import ChatsList from "../components/ChatsList";
import { useEffect , useState } from "react";

function ChatsPage(){
    const [receiverId , setReceiverId]=useState(null);
    useEffect(() => {
        document.body.style.overflowY = 'hidden'; // disable vertical scroll
      
        return () => {
          document.body.style.overflowY = 'auto'; // restore on cleanup
        };
      }, []);
    return(
       <div className="grid grid-cols-4 w-full ">
            <div className="col-span-1"><ChatsList className="w-full" setReceiverId={setReceiverId}/></div>
            <div className="col-span-3"><ChatBlock className="w-full" receiverId={receiverId} /></div>
       </div>
    )
}

export default ChatsPage;