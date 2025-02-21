
import Register from "./components/register.jsx"
import { Route,Routes} from 'react-router-dom'
import Login from './components/login.jsx'
import VerifyEmail from "./components/verifyEmail.jsx";
import HomePage from "./pages/homePage.jsx";
function App() {

  return (
    <>
      <Routes>
        <Route path="/homePage" element={<HomePage/>}/>
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/verifyEmail/:token" element={<VerifyEmail/>}/>
    </Routes>
    </>
  )
}

export default App
