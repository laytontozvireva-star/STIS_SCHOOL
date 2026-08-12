import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { GraduationCap, Users, FileText, CalendarDays, CalendarPlus, Images, Newspaper, UserPlus } from "lucide-react";

const adminLinks = [
  { label: "Manage Students", to: "/dashboard/admin", icon: GraduationCap },
  { label: "Manage Teachers", to: "/dashboard/admin/teachers", icon: Users },
  { label: "Manage Admissions", to: "/dashboard/admin/admissions", icon: FileText },
  { label: "Vacation Posts", to: "/dashboard/admin/vacation-posts", icon: CalendarDays },
  { label: "Manage Events", to: "/dashboard/admin/events", icon: CalendarPlus },
  { label: "Manage Gallery", to: "/dashboard/admin/gallery", icon: Images },
  { label: "Manage News", to: "/dashboard/admin/news", icon: Newspaper },
  { label: "Create Accounts", to: "/dashboard/admin/accounts", icon: UserPlus },
];

const AdminDashboardLayout = () => {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar title="Admin Portal" links={adminLinks} />
      <main className="flex-1 bg-background p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout;