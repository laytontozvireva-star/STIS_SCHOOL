import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getMyTeacher, getStudents, getTeacherClasses } from "../../../services/dashboardService";
import { addGrade, getGradesByStudent } from "../../../services/gradesService";

const TERMS = ["Term 1", "Term 2", "Term 3"];

const Grades = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("Loading your classes...");
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ subject: "", score: "", term: "Term 1" });

  const selectedClass = classes.find((item) => item.id === selectedClassId);
  const classStudents = useMemo(() => students.filter((student) => (
    !selectedClass || (student.grade === selectedClass.grade && student.class === selectedClass.class)
  )), [students, selectedClass]);

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
        setForm((current) => ({ ...current, subject: assignedClasses[0].subject || teacher.subject || "" }));
        setMessage("");
      } catch (error) {
        setMessage(error.message || "Could not load your classes.");
      }
    };
    load();
  }, [user.id]);

  useEffect(() => {
    if (!selectedClass) return;
    setSelectedStudentId("");
    setResults([]);
    setForm((current) => ({ ...current, subject: selectedClass.subject || current.subject }));
  }, [selectedClass]);

  useEffect(() => {
    if (!selectedStudentId) return;
    const loadResults = async () => {
      try {
        setResults(await getGradesByStudent(selectedStudentId));
      } catch (error) {
        setMessage(error.message || "Could not load the student's results.");
      }
    };
    loadResults();
  }, [selectedStudentId]);

  const submit = async (event) => {
    event.preventDefault();
    const score = Number(form.score);
    if (!selectedStudentId) return setMessage("Choose a student before saving a result.");
    if (!form.subject.trim()) return setMessage("Enter the subject.");
    if (!Number.isFinite(score) || score < 0 || score > 100) return setMessage("Score must be between 0 and 100.");

    setIsSaving(true);
    setMessage("");
    try {
      await addGrade({ studentId: selectedStudentId, subject: form.subject.trim(), score, term: form.term });
      setResults(await getGradesByStudent(selectedStudentId));
      setForm((current) => ({ ...current, score: "" }));
      setMessage("Result saved successfully.");
    } catch (error) {
      setMessage(error.message || "Could not save the result.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-textPrimary">Enter Results</h1>
        <Link to="/dashboard/teacher" className="rounded-xl border border-border bg-surface px-4 py-2 font-body text-sm font-semibold text-primary transition hover:bg-primary/5">Back to Dashboard</Link>
      </div>
      <p className="mt-2 font-body text-sm text-textSecondary">Choose one of your assigned classes, then record a student's result.</p>

      {message && <p role="status" className="mt-4 rounded-xl bg-primary/10 p-3 font-body text-sm text-textPrimary">{message}</p>}
      {classes.length > 0 && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <form onSubmit={submit} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="space-y-4">
              <label className="block font-body text-sm font-medium text-textPrimary">Class
                <select value={selectedClassId} onChange={(event) => setSelectedClassId(event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 font-body text-sm text-textPrimary">
                  {classes.map((item) => <option key={item.id} value={item.id}>{item.grade} - {item.class} ({item.subject})</option>)}
                </select>
              </label>
              <label className="block font-body text-sm font-medium text-textPrimary">Student
                <select required value={selectedStudentId} onChange={(event) => setSelectedStudentId(event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 font-body text-sm text-textPrimary">
                  <option value="">Select a student</option>
                  {classStudents.map((student) => <option key={student.id} value={student.id}>{student.profiles?.name || "Unnamed student"}</option>)}
                </select>
              </label>
              <label className="block font-body text-sm font-medium text-textPrimary">Subject
                <input required value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 font-body text-sm text-textPrimary" />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block font-body text-sm font-medium text-textPrimary">Term
                  <select value={form.term} onChange={(event) => setForm({ ...form, term: event.target.value })} className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 font-body text-sm text-textPrimary">
                    {TERMS.map((term) => <option key={term} value={term}>{term}</option>)}
                  </select>
                </label>
                <label className="block font-body text-sm font-medium text-textPrimary">Score (%)
                  <input required type="number" min="0" max="100" step="0.01" value={form.score} onChange={(event) => setForm({ ...form, score: event.target.value })} className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 font-body text-sm text-textPrimary" />
                </label>
              </div>
              <button type="submit" disabled={isSaving} className="w-full rounded-xl bg-primary px-5 py-3 font-body text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? "Saving..." : "Save Result"}</button>
            </div>
          </form>

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-textPrimary">Student Results</h2>
            {!selectedStudentId ? <p className="mt-4 font-body text-sm text-textSecondary">Select a student to view their saved results.</p> : results.length === 0 ? <p className="mt-4 font-body text-sm text-textSecondary">No results recorded for this student yet.</p> : (
              <div className="mt-4 overflow-x-auto"><table className="w-full text-left font-body text-sm"><thead className="border-b border-border text-textSecondary"><tr><th className="pb-3">Subject</th><th className="pb-3">Term</th><th className="pb-3 text-right">Score</th></tr></thead><tbody>{results.map((result) => <tr key={result.id} className="border-b border-border last:border-0"><td className="py-3 font-medium text-textPrimary">{result.subject}</td><td className="py-3 text-textSecondary">{result.term}</td><td className="py-3 text-right font-semibold text-primary">{result.score}%</td></tr>)}</tbody></table></div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default Grades;