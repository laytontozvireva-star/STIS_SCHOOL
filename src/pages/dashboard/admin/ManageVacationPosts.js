import { useEffect, useState } from "react";
import { Edit3, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { deleteVacationPost, getVacationPosts, saveVacationPost, uploadVacationFlyer } from "../../../services/vacationPostsService";

const EMPTY_POST = {
  title: "Vacation School",
  term: "Term 1",
  dates: "",
  subjects: "",
  fees: "",
  accommodation: "",
  image_url: "",
  is_active: true,
};

const ManageVacationPosts = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(EMPTY_POST);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const loadPosts = async () => {
    try {
      setPosts(await getVacationPosts());
    } catch {
      setMessage("Connect the vacation_posts table in Supabase to manage posts here.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const updateField = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFlyerUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file for the flyer.");
      return;
    }
    setIsUploading(true);
    setMessage("");
    try {
      const imageUrl = await uploadVacationFlyer(file);
      setForm((current) => ({ ...current, image_url: imageUrl }));
      setMessage("Flyer added. Save the post to publish it.");
    } catch (error) {
      setMessage(error.message || "Could not upload this flyer.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await saveVacationPost({
        ...form,
        subjects: form.subjects.split(",").map((item) => item.trim()).filter(Boolean),
        fees: form.fees.split(",").map((item) => ({ label: item.trim(), amount: "" })).filter((item) => item.label),
      });
      setForm(EMPTY_POST);
      setMessage("Vacation post saved. The active post appears on the homepage.");
      await loadPosts();
    } catch (error) {
      setMessage(error.message || "Could not save this vacation post.");
    } finally {
      setSaving(false);
    }
  };

  const editPost = (post) => setForm({
    ...post,
    subjects: (post.subjects || []).join(", "),
    fees: (post.fees || []).map((fee) => fee.amount ? fee.label + " " + fee.amount : fee.label).join(", "),
  });

  const removePost = async (id) => {
    if (!window.confirm("Delete this vacation post?")) return;
    try {
      await deleteVacationPost(id);
      if (form.id === id) setForm(EMPTY_POST);
      await loadPosts();
    } catch (error) {
      setMessage(error.message || "Could not delete this post.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-textPrimary">Vacation Posts</h1>
        <p className="mt-2 font-body text-sm text-textSecondary">Create a new announcement each term. Mark one post active to display it on the homepage.</p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_.9fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-lg font-semibold text-textPrimary">{form.id ? "Edit vacation post" : "New vacation post"}</h2>
            {form.id && <button type="button" onClick={() => setForm(EMPTY_POST)} className="font-body text-sm text-primary hover:underline">Create new</button>}
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Title" name="title" value={form.title} onChange={updateField} required />
            <Field label="Term" name="term" value={form.term} onChange={updateField} placeholder="Term 1, August 2026" required />
            <Field label="Dates" name="dates" value={form.dates} onChange={updateField} placeholder="12 August to 1 September" required />
            <Field label="Accommodation" name="accommodation" value={form.accommodation} onChange={updateField} placeholder="Accommodation available" />
            <div className="sm:col-span-2"><Field label="Subjects (separate with commas)" name="subjects" value={form.subjects} onChange={updateField} placeholder="Commercials, Arts, Sciences" required /></div>
            <div className="sm:col-span-2"><Field label="Fees (separate with commas)" name="fees" value={form.fees} onChange={updateField} placeholder="Admin fee $5, O Level $10 per subject" /></div>
            <div className="sm:col-span-2">
              <span className="font-body text-sm font-medium text-textPrimary">Flyer</span>
              {form.image_url ? (
                <div className="mt-2 overflow-hidden rounded-xl border border-border bg-background">
                  <img src={form.image_url} alt="Selected vacation flyer" className="h-40 w-full object-contain" />
                  <button type="button" onClick={() => setForm((current) => ({ ...current, image_url: "" }))} className="flex w-full items-center justify-center gap-2 border-t border-border px-4 py-2.5 font-body text-sm font-semibold text-red-600 hover:bg-red-50">
                    <X className="h-4 w-4" /> Remove flyer
                  </button>
                </div>
              ) : (
                <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-8 font-body text-sm font-semibold text-primary transition-colors hover:bg-primary/10">
                  <ImagePlus className="h-5 w-5" /> {isUploading ? "Uploading flyer..." : "Add flyer"}
                  <input type="file" accept="image/*" onChange={handleFlyerUpload} disabled={isUploading} className="sr-only" />
                </label>
              )}
            </div>
          </div>
          <label className="mt-6 flex items-center gap-3 font-body text-sm font-medium text-textPrimary">
            <input name="is_active" type="checkbox" checked={form.is_active} onChange={updateField} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
            Show this post on the homepage
          </label>
          <button type="submit" disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-primaryDark disabled:opacity-60">
            <Plus className="h-4 w-4" /> {saving ? "Saving..." : form.id ? "Update post" : "Publish post"}
          </button>
          {message && <p className="mt-4 font-body text-sm text-textSecondary" role="status">{message}</p>}
        </form>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <h2 className="font-heading text-lg font-semibold text-textPrimary">Previous posts</h2>
          {loading ? <p className="mt-5 font-body text-sm text-textSecondary">Loading posts...</p> : (
            <div className="mt-5 space-y-3">
              {posts.length === 0 ? <p className="font-body text-sm text-textSecondary">No vacation posts yet.</p> : posts.map((post) => (
                <article key={post.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div><h3 className="font-heading font-semibold text-textPrimary">{post.title}</h3><p className="mt-1 font-body text-sm text-textSecondary">{post.term} - {post.dates}</p></div>
                    {post.is_active && <span className="rounded-full bg-secondary/20 px-2.5 py-1 font-body text-xs font-semibold text-primary">Live</span>}
                  </div>
                  <div className="mt-3 flex gap-3"><button type="button" onClick={() => editPost(post)} className="inline-flex items-center gap-1 font-body text-sm text-primary hover:underline"><Edit3 className="h-4 w-4" /> Edit</button><button type="button" onClick={() => removePost(post.id)} className="inline-flex items-center gap-1 font-body text-sm text-red-600 hover:underline"><Trash2 className="h-4 w-4" /> Delete</button></div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const Field = ({ label, ...props }) => <label className="block"><span className="font-body text-sm font-medium text-textPrimary">{label}</span><input {...props} className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 font-body text-sm text-textPrimary outline-none focus:ring-2 focus:ring-primary" /></label>;

export default ManageVacationPosts;
