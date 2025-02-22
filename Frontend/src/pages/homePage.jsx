
import {useSelector} from "react-redux";
function HomePage(){
    //consider userEmail&&userId undefined if there is no value for email
let userEmail=useSelector((state)=>state.user?.email);
let userId=useSelector((state)=>state.user?.id);
    return(
     userEmail?<h4>loggedIn</h4>:<h4>loggedOut</h4>
    );
}
export default HomePage;