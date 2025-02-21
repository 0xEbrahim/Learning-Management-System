import { useParams } from "react-router-dom";


function ResetPassword(){
    const {token}=useParams();
    return(
        <h2>invalid</h2>
    );
}
export default ResetPassword;