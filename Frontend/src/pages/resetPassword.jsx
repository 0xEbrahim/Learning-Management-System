import { useParams } from "react-router-dom";


function ResetPassword(){
    const {token}=useParams();
    console.log(token);
    return(
        <h2>invalid</h2>
    );
}
export default ResetPassword;