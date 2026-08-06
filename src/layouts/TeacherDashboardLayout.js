import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { LayoutDashboard, BookOpen, Calendar, ClipboardCheck, Users } from "lucide-react";

const teacherLinks = [
  { label: "Overview", to: "/dashboard/teacher", icon: LayoutDashboard },
  { label: "Classes", to: "/dashboard/teacher/classes", icon: BookOpen },
  { label: "Grades", to: "/dashboard/teacher/grades", icon: ClipboardCheck },
  { label: "Attendance", to: "/dashboard/teacher/attendance", icon: Calendar },
  { label: "Students", to: "/dashboard/teacher/students", icon: Users },
];

const TeacherDashboardLayout = () => {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar title="Teacher Portal" links={teacherLinks} />
      <main className="flex-1 bg-background p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherDashboardLayout;