import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import About from "../pages/About";
import Academics from "../pages/Academics";
import Departments from "../pages/Departments";
import Admissions from "../pages/Admissions";
import Gallery from "../pages/Gallery";
import News from "../pages/News";
import Events from "../pages/Events";
import Staff from "../pages/Staff";
import Contact from "../pages/Contact";
import Login from "../pages/Login";

import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import ParentDashboard from "../pages/ParentDashboard";
import AdminDashboard from "../pages/AdminDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="academics" element={<Academics />} />
        <Route path="departments" element={<Departments />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="news" element={<News />} />
        <Route path="events" element={<Events />} />
        <Route path="staff" element={<Staff />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />

        <Route path="dashboard/student" element={<StudentDashboard />} />
        <Route path="dashboard/teacher" element={<TeacherDashboard />} />
        <Route path="dashboard/parent" element={<ParentDashboard />} />
        <Route path="dashboard/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;