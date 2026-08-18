import { useEffect, useState } from "react";
import { assignTeacherClass, getAllTeacherClasses, getTeachers, removeTeacherClass } from "../../../services/dashboardService";

const EMPTY_ASSIGNMENT = { teacherId: "", subject: "", grade: "", className: "", room: "" };

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState(EMPTY_ASSIGNMENT);
  const [message, setMessage] = useState("Loading teacher records...");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [teacherRows, assignmentRows] = await Promise.all([getTeachers(), getAllTeacherClasses()]);
      setTeachers(teacherRows);
      setAssignments(assignmentRows);
      setForm((current) => current.teacherId ? current : { ...current, teacherId: teacherRows[0]?.id || "" });
      setMessage(teacherRows.length ? "" : "No teacher records yet. Create a teacher account first.");
    } catch (error) {
      setMessage(error.message || "Could not load teacher records.");
    }
  };

  useEffect(() => { load(); }, []);

  const updateForm = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submitAssignment = async (event) => {
    event.preventDefault();
    if (!form.teacherId || !form.subject.trim() || !form.grade.trim() || !form.className.trim()) {
      setMessage("Choose a teacher and complete subject, grade, and class.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await assignTeacherClass({ ...form, subject: form.subject.trim(), grade: form.grade.trim(), className: form.className.trim(), room: form.room.trim() });
      setForm((current) => ({ ...EMPTY_ASSIGNMENT, teacherId: current.teacherId }));
      await load();
      setMessage("Class assigned successfully.");
    } catch (error) {
      setMessage(error.message || "Could not assign this class. It may already be assigned to this teacher.");
    } finally {
      setSaving(false);
    }
  };

  const removeAssignment = async (id) => {
    if (!window.confirm("Remove this class assignment?")) return;
    try {
      await removeTeacherClass(id);
      await load();
      setMessage("Class assignment removed.");
    } catch (error) {
      setMessage(error.message || "Could not remove this assignment.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-textPrimary">Manage Teachers</h1>
        <p className="mt-2 font-body text-sm text-textSecondary">Assign teachers to the classes and subjects they teach.</p>
      </div>

      {message && <p role="status" className="mb-5 rounded-xl bg-primary/10 p-3 font-body text-sm text-textPrimary">{message}</p>}

      {teachers.length > 0 && (
        <form onSubmit={submitAssignment} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-textPrimary">Assign a class</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block font-body text-sm font-medium text-textPrimary">Teacher
              <select name="teacherId" value={form.teacherId} onChange={updateForm} className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-textPrimary">
                {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.profiles?.name || "Unnamed teacher"}</option>)}
              </select>
            </label>
            <Field label="Subject" name="subject" value={form.subject} onChange={updateForm} placeholder="Mathematics" />
            <Field label="Grade" name="grade" value={form.grade} onChange={updateForm} placeholder="Grade 10" />
            <Field label="Class" name="className" value={form.className} onChange={updateForm} placeholder="A" />
            <Field label="Room (optional)" name="room" value={form.room} onChange={updateForm} placeholder="Room 203" />
          </div>
          <button disabled={saving} className="mt-6 rounded-xl bg-primary px-5 py-3 font-body text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60">{saving ? "Assigning..." : "Assign Class"}</button>
        </form>
      )}

      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-4"><h2 className="font-heading text-lg font-semibold text-textPrimary">Current assignments</h2></div>
        {assignments.length === 0 ? <p className="p-6 font-body text-sm text-textSecondary">No class assignments have been created yet.</p> : (
          <div className="overflow-x-auto"><table className="w-full text-left font-body text-sm"><thead className="bg-background text-textSecondary"><tr><th className="p-4">Teacher</th><th className="p-4">Subject</th><th className="p-4">Grade</th><th className="p-4">Class</th><th className="p-4">Room</th><th className="p-4" aria-label="Actions" /></tr></thead><tbody>{assignments.map((assignment) => <tr key={assignment.id} className="border-t border-border"><td className="p-4 font-medium text-textPrimary">{assignment.teachers?.profiles?.name || "Unnamed teacher"}</td><td className="p-4">{assignment.subject}</td><td className="p-4">{assignment.grade}</td><td className="p-4">{assignment.class}</td><td className="p-4">{assignment.room || "—"}</td><td className="p-4"><button type="button" onClick={() => removeAssignment(assignment.id)} className="text-sm font-semibold text-red-600 hover:underline">Remove</button></td></tr>)}</tbody></table></div>
        )}
      </section>
    </div>
  );
};

const Field = ({ label, ...props }) => <label className="block font-body text-sm font-medium text-textPrimary">{label}<input {...props} required={label !== "Room (optional)"} className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-textPrimary" /></label>;

export default ManageTeachers;