import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { LayoutDashboard, BookOpen } from "lucide-react";
import { getParentChildren } from "../services/dashboardService";

const parentLinks = [{ label: "Overview", to: "/dashboard/parent", icon: LayoutDashboard }, { label: "Grades", to: "/dashboard/parent/grades", icon: BookOpen }];
const ParentDashboardLayout = () => {
  const [children, setChildren] = useState([]); const [selectedChildId, setSelectedChildId] = useState("");
  useEffect(() => { getParentChildren().then((links) => { const records = links.map((link) => link.students).filter(Boolean); setChildren(records); setSelectedChildId(records[0]?.id || ""); }).catch(() => setChildren([])); }, []);
  const selectedChild = children.find((child) => child.id === selectedChildId) || null;
  return <div className="flex min-h-screen flex-col lg:flex-row"><Sidebar title="Parent Portal" links={parentLinks} /><main className="flex-1 bg-background p-6 lg:p-10">{children.length > 1 && <div className="mb-6 flex items-center gap-3"><label htmlFor="child-select" className="font-body text-sm font-medium text-textPrimary">Viewing:</label><select id="child-select" value={selectedChildId} onChange={(event) => setSelectedChildId(event.target.value)} className="rounded-xl border border-border bg-white px-4 py-2 font-body text-sm text-textPrimary"><>{children.map((child) => <option key={child.id} value={child.id}>{child.profiles?.name}</option>)}</></select></div>}<Outlet context={{ selectedChild }} /></main></div>;
};
export default ParentDashboardLayout;
