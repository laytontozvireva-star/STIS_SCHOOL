import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { GraduationCap, Users, FileText } from "lucide-react";

const adminLinks = [
  { label: "Manage Students", to: "/dashboard/admin", icon: GraduationCap },
  { label: "Manage Teachers", to: "/dashboard/admin/teachers", icon: Users },
  { label: "Manage Admissions", to: "/dashboard/admin/admissions", icon: FileText },
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