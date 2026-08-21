import { useEffect, useState } from "react";
import { Edit2, Check, X } from "lucide-react";
import { getStudents, updateStudent } from "../../../services/dashboardService";

const ManageStudents = () => {
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("Loading student records...");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ grade: "", class: "" });
  const [saving, setSaving] = useState(false);

  const loadStudents = () => {
    getStudents()
      .then((data) => {
        setRows(data);
        setMessage(data.length ? "" : "No student records yet.");
      })
      .catch((error) => setMessage(error.message));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const startEdit = (student) => {
    setEditingId(student.id);
    setEditForm({ grade: student.grade || "", class: student.class || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleEditChange = (e) => {
    setEditForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const saveEdit = async (studentId) => {
    setSaving(true);
    try {
      await updateStudent(studentId, editForm);
      setEditingId(null);
      loadStudents();
    } catch (err) {
      alert(err.message || "Could not update student.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-textPrimary">Manage Students</h1>
      {message ? (
        <p className="mt-3 font-body text-sm text-textSecondary">{message}</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-left font-body text-sm">
            <thead className="bg-background text-textSecondary">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Email</th>
                <th className="p-4">Grade</th>
                <th className="p-4">Class</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((student) => {
                const isEditing = editingId === student.id;
                return (
                  <tr key={student.id} className="border-t border-border hover:bg-black/[0.01]">
                    <td className="p-4 font-medium text-textPrimary">{student.profiles?.name}</td>
                    <td className="p-4 text-textSecondary">{student.profiles?.email}</td>
                    <td className="p-4">
                      {isEditing ? (
                        <input
                          type="text"
                          name="grade"
                          value={editForm.grade}
                          onChange={handleEditChange}
                          disabled={saving}
                          className="w-28 rounded-lg border border-border px-2.5 py-1.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="e.g. Grade 10"
                        />
                      ) : (
                        student.grade || <span className="text-textSecondary/50 italic">Not set</span>
                      )}
                    </td>
                    <td className="p-4">
                      {isEditing ? (
                        <input
                          type="text"
                          name="class"
                          value={editForm.class}
                          onChange={handleEditChange}
                          disabled={saving}
                          className="w-24 rounded-lg border border-border px-2.5 py-1.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="e.g. A"
                        />
                      ) : (
                        student.class || <span className="text-textSecondary/50 italic">Not set</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => saveEdit(student.id)}
                            disabled={saving}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-60 transition"
                            title="Save"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={saving}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-60 transition"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(student)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary hover:bg-primary/10 transition"
                          title="Edit Grade/Class"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
