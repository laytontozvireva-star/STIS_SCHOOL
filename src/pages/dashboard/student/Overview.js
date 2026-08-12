import { useEffect, useState } from "react";
import { BookOpen, CalendarCheck, GraduationCap } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { getMyStudent, getStudentAttendance, getStudentGrades } from "../../../services/dashboardService";

const Overview = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("Loading your dashboard...");
  useEffect(() => { (async () => { try {
    const student = await getMyStudent(user.id);
    if (!student) { setMessage("Your student record has not been linked yet."); return; }
    const [grades, attendance] = await Promise.all([getStudentGrades(student.id), getStudentAttendance(student.id)]);
    const average = grades.length ? Math.round(grades.reduce((sum, item) => sum + Number(item.score), 0) / grades.length) : null;
    setData({ student, grades, attendance, average });
  } catch (error) { setMessage(error.message); } })(); }, [user.id]);
  if (!data) return <div><h1 className="font-heading text-2xl font-bold text-textPrimary">Student Dashboard</h1><p className="mt-2 font-body text-sm text-textSecondary">{message}</p></div>;
  return <div><h1 className="font-heading text-2xl font-bold text-textPrimary">Welcome, {data.student.profiles?.name || user.name}</h1><p className="mt-2 font-body text-sm text-textSecondary">{data.student.grade}{data.student.class ? " - " + data.student.class : ""}</p><div className="mt-8 grid gap-5 sm:grid-cols-3"><Stat icon={GraduationCap} label="Average grade" value={data.average === null ? "No grades yet" : data.average + "%"} /><Stat icon={BookOpen} label="Recorded grades" value={data.grades.length} /><Stat icon={CalendarCheck} label="Attendance records" value={data.attendance.length} /></div></div>;
};
const Stat = ({ icon: Icon, label, value }) => <div className="rounded-2xl border border-border bg-surface p-5"><Icon className="h-5 w-5 text-primary" /><p className="mt-4 font-body text-sm text-textSecondary">{label}</p><p className="mt-1 font-heading text-2xl font-bold text-textPrimary">{value}</p></div>;
export default Overview;
