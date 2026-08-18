import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getMyTeacher, getStudents, getTeacherClasses } from "../../../services/dashboardService";
import { getAttendanceByDate, markAttendance } from "../../../services/attendanceService";

const today = () => new Date().toISOString().slice(0, 10);
const STATUSES = ["present", "absent", "late"];

const Attendance = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [date, setDate] = useState(today());
  const [statuses, setStatuses] = useState({});
  const [message, setMessage] = useState("Loading your assigned classes...");
  const [saving, setSaving] = useState(false);

  const selectedClass = classes.find((item) => item.id === selectedClassId);
  const classStudents = useMemo(
    () => students.filter((student) => !selectedClass || (
      student.grade === selectedClass.grade && student.class === selectedClass.class
    )),
    [students, selectedClass]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const teacher = await getMyTeacher(user.id);
        if (!teacher) {
          setMessage("Your teacher record has not been linked yet.");
          return;
        }
        const [assignedClasses, studentRows] = await Promise.all([
          getTeacherClasses(teacher.id),
          getStudents(),
        ]);
        setClasses(assignedClasses);
        setStudents(studentRows);
        if (!assignedClasses.length) {
          setMessage("No classes have been assigned to you yet.");
          return;
        }
        setSelectedClassId(assignedClasses[0].id);
        setMessage("");
      } catch (error) {
        setMessage(error.message || "Could not load attendance data.");
      }
    };
    load();
  }, [user.id]);

  useEffect(() => {
    const loadExistingAttendance = async () => {
      if (!selectedClassId) return;
      try {
        const records = await getAttendanceByDate(date);
        const savedStatuses = Object.fromEntries(records.map((record) => [record.student_id, record.status]));
        setStatuses(Object.fromEntries(classStudents.map((student) => [student.id, savedStatuses[student.id] || "present"])));
      } catch (error) {
        setMessage(error.message || "Could not load attendance for this date.");
      }
    };
    loadExistingAttendance();
  }, [selectedClassId, date, classStudents]);

  const saveAttendance = async () => {
    if (!classStudents.length) {
      setMessage("There are no students in this class yet.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await Promise.all(classStudents.map((student) => markAttendance({
        studentId: student.id,
        date,
        status: statuses[student.id] || "present",
      })));
      setMessage("Attendance saved successfully.");
    } catch (error) {
      setMessage(error.message || "Could not save attendance.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-textPrimary">Mark Attendance</h1>
          <p className="mt-2 font-body text-sm text-textSecondary">Record attendance for one of your assigned classes.</p>
        </div>
      </div>

      {message && <p role="status" className="mt-4 rounded-xl bg-primary/10 p-3 font-body text-sm text-textPrimary">{message}</p>}

      {classes.length > 0 && (
        <section className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block font-body text-sm font-medium text-textPrimary">Class
              <select value={selectedClassId} onChange={(event) => setSelectedClassId(event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 font-body text-sm text-textPrimary">
                {classes.map((item) => <option key={item.id} value={item.id}>{item.grade} - {item.class} ({item.subject})</option>)}
              </select>
            </label>
            <label className="block font-body text-sm font-medium text-textPrimary">Date
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 font-body text-sm text-textPrimary" />
            </label>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left font-body text-sm">
              <thead className="border-b border-border text-textSecondary"><tr><th className="pb-3">Student</th><th className="pb-3">Status</th></tr></thead>
              <tbody>
                {classStudents.map((student) => (
                  <tr key={student.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium text-textPrimary">{student.profiles?.name || "Unnamed student"}</td>
                    <td className="py-3">
                      <select value={statuses[student.id] || "present"} onChange={(event) => setStatuses((current) => ({ ...current, [student.id]: event.target.value }))} className="rounded-xl border border-border bg-white px-3 py-2 text-sm text-textPrimary">
                        {STATUSES.map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {classStudents.length === 0 && <p className="mt-5 font-body text-sm text-textSecondary">No student records match this class yet.</p>}
          <button type="button" onClick={saveAttendance} disabled={saving || classStudents.length === 0} className="mt-6 rounded-xl bg-primary px-5 py-3 font-body text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </section>
      )}
    </div>
  );
};

export default Attendance;