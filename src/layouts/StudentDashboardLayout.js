import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { LayoutDashboard, BookOpen, Calendar, ClipboardCheck } from "lucide-react";

const studentLinks = [
  { label: "Overview", to: "/dashboard/student", icon: LayoutDashboard },
  { label: "Grades", to: "/dashboard/student/grades", icon: BookOpen },
  { label: "Schedule", to: "/dashboard/student/schedule", icon: Calendar },
  { label: "Attendance", to: "/dashboard/student/attendance", icon: ClipboardCheck },
];

const StudentDashboardLayout = () => {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar title="Student Portal" links={studentLinks} />
      <main className="flex-1 bg-background p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentDashboardLayout;