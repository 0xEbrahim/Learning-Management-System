
import Register from "./components/register.jsx"
import { Route,Routes } from 'react-router-dom'
import Login from './components/login.jsx'
import VerifyEmail from "./components/verifyEmail.jsx";
function App() {

  return (
    <>
    <Routes>
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="verifyEmail" element={<VerifyEmail/>}/>
    </Routes>
    </>
  )
}

export default App
