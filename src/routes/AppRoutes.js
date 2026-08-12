import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import StudentDashboardLayout from "../layouts/StudentDashboardLayout";
import TeacherDashboardLayout from "../layouts/TeacherDashboardLayout";
import ParentDashboardLayout from "../layouts/ParentDashboardLayout";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";

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
import Profile from "../pages/Profile";

import StudentOverview from "../pages/dashboard/student/Overview";
import StudentGrades from "../pages/dashboard/student/Grades";
import StudentSchedule from "../pages/dashboard/student/Schedule";
import StudentAttendance from "../pages/dashboard/student/Attendance";

import TeacherOverview from "../pages/dashboard/teacher/Overview";
import TeacherMyClasses from "../pages/dashboard/teacher/MyClasses";
import TeacherGrades from "../pages/dashboard/teacher/Grades";
import TeacherAttendance from "../pages/dashboard/teacher/Attendance";

import ParentOverview from "../pages/dashboard/parent/Overview";
import ParentGrades from "../pages/dashboard/parent/Grades";

import AdminManageStudents from "../pages/dashboard/admin/ManageStudents";
import AdminManageTeachers from "../pages/dashboard/admin/ManageTeachers";
import AdminManageAdmissions from "../pages/dashboard/admin/ManageAdmissions";
import ManageVacationPosts from "../pages/dashboard/admin/ManageVacationPosts";
import ManageGallery from "../pages/dashboard/admin/ManageGallery";
import ManageNews from "../pages/dashboard/admin/ManageNews";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public site — wrapped in MainLayout (Navbar + Footer) */}
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
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Dashboards — sibling routes, NOT inside MainLayout, so no public Navbar/Footer */}
      <Route
        path="dashboard/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentOverview />} />
        <Route path="grades" element={<StudentGrades />} />
        <Route path="schedule" element={<StudentSchedule />} />
        <Route path="attendance" element={<StudentAttendance />} />
      </Route>

      <Route
        path="dashboard/teacher"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherOverview />} />
        <Route path="classes" element={<TeacherMyClasses />} />
        <Route path="grades" element={<TeacherGrades />} />
        <Route path="attendance" element={<TeacherAttendance />} />
      </Route>

      <Route
        path="dashboard/parent"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <ParentDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ParentOverview />} />
        <Route path="grades" element={<ParentGrades />} />
      </Route>

      <Route
        path="dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminManageStudents />} />
        <Route path="teachers" element={<AdminManageTeachers />} />
        <Route path="admissions" element={<AdminManageAdmissions />} />
        <Route path="vacation-posts" element={<ManageVacationPosts />} />
        <Route path="gallery" element={<ManageGallery />} />
        <Route path="news" element={<ManageNews />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;