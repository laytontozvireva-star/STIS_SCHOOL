import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, BookOpen } from "lucide-react";

const parentLinks = [
  { label: "Overview", to: "/dashboard/parent", icon: LayoutDashboard },
  { label: "Grades", to: "/dashboard/parent/grades", icon: BookOpen },
];

const ParentDashboardLayout = () => {
  const { user } = useAuth();
  const children = user?.children || [];
  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id || null);

  const selectedChild = children.find((c) => c.id === selectedChildId) || null;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar title="Parent Portal" links={parentLinks} />
      <main className="flex-1 bg-background p-6 lg:p-10">
        {children.length > 1 && (
          <div className="mb-6 flex items-center gap-3">
            <label htmlFor="child-select" className="font-body text-sm font-medium text-textPrimary">
              Viewing:
            </label>
            <select
              id="child-select"
              value={selectedChildId || ""}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="rounded-xl border border-border bg-white px-4 py-2 font-body text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <Outlet context={{ selectedChild }} />
      </main>
    </div>
  );
};

export default ParentDashboardLayout;