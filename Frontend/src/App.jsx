
import Register from "./components/register.jsx"
import { Route,Routes} from 'react-router-dom'
import Login from './components/login.jsx'
import VerifyEmail from "./components/verifyEmail.jsx";
import HomePage from "./pages/homePage.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";
import ResetPassword from "./pages/resetPassword.jsx";
function App() {

  return (
    <>
      <Routes>
        <Route path="/homePage" element={<HomePage/>}/>
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/verifyEmail/:token" element={<VerifyEmail/>}/>
        <Route path="/forgotPassword" element={<ForgotPassword/>}/>
        <Route path="/resetPassword/:token" element={<ResetPassword/>}/>
    </Routes>
    </>
  )
}

export default App
