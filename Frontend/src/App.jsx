import Register from "./components/register.jsx";
import { Route, Routes } from "react-router-dom";
import Login from "./components/login.jsx";
import VerifyEmail from "./components/verifyEmail.jsx";
import HomePage from "./pages/homePage.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";
import ResetPassword from "./pages/resetPassword.jsx";
import CoursesPage from "./pages/coursesPage.jsx";
import SettingsPage from "./pages/settingsPage.jsx";
import DashboardPage from "./pages/dashboard.jsx";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
const socket = io.connect("http://localhost:3000");
function App() {
  const userId = useSelector((state) => state.auth.userId);
  useEffect(() => {
    socket.emit("initNotification", { currentAuthenticatedUserId: userId });
    // return () => socket.disconnect();
  }, [socket]);
  return (
    <>
      <Routes>
        <Route path="/homePage" element={<HomePage />}>
          <Route path="/homePage/courses" element={<CoursesPage />} />
          <Route path="/homePage/dashboard" element={<DashboardPage />} />
          <Route path="/homePage/settings" element={<SettingsPage />} />
        </Route>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verifyEmail/:token" element={<VerifyEmail />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
