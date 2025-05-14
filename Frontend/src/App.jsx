import Register from "./components/register.jsx";
import { Route, Routes } from "react-router-dom";
import Login from "./components/login.jsx";
import VerifyEmail from "./components/verifyEmail.jsx";
import HomePage from "./pages/homePage.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";
import ResetPassword from "./pages/resetPassword.jsx";
import Home from "./pages/home.jsx";
import CoursesPage from "./pages/coursesPage.jsx";
import SettingsPage from "./pages/settingsPage.jsx";
import DashboardPage from "./pages/dashboard.jsx";
import NewCourse from "./pages/newCoursePage.jsx";
import ProfilePage from "./pages/profilePage.jsx";
import CoursePage from "./pages/coursePage.jsx";
import NotificationsPage from "./pages/notificationsPage.jsx";
import OverView from "./subPages/overView.jsx";
import Author from "./subPages/author.jsx";
import Reviews from "./subPages/reviews.jsx";
import FAQ from "./subPages/FAQ.jsx";
import CourseContent from "./subPages/courseContentPage.jsx";
import UploadVideoPage from "./pages/uploadVideoPage.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/homePage" element={<HomePage />}>
          <Route index element={<Home/>}/>
          <Route path="courses" element={<CoursesPage />} />
          <Route path="newCourse" element={<NewCourse />} />
          <Route path="/homePage/courses/course/:courseId" element={<CoursePage/>}>
            <Route index element={<OverView/>}/>
            <Route path="author" element={< Author/>}/>
            <Route path="reviews" element={< Reviews/>}/>
            <Route path="FAQ" element={< FAQ/>}/>
            <Route path="content" element={< CourseContent/>}/>
            <Route path="uploadVideo/:sectionId" element={< UploadVideoPage/>}/>
          </Route>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="Profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage/>}/>
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
