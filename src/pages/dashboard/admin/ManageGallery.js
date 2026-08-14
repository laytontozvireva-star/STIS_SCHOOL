import { useEffect, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { deleteGalleryImage, getGalleryImages, saveGalleryImage, uploadGalleryImage } from "../../../services/galleryService";

const CATEGORIES = ["Campus", "Events", "Sports", "Academics"];
const EMPTY_FORM = { title: "", category: "Academics" };

const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadImages = async () => {
    try { setImages(await getGalleryImages()); }
    catch { setMessage("Run the Gallery & News SQL setup in Supabase to manage gallery images."); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadImages(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!file) return setMessage("Choose an image first.");
    if (!file.type.startsWith("image/")) return setMessage("Please choose an image file.");
    setSaving(true); setMessage("");
    try {
      const upload = await uploadGalleryImage(file);
      await saveGalleryImage({ title: form.title.trim() || "School moment", category: form.category, image_url: upload.image_url, storage_path: upload.path });
      setForm(EMPTY_FORM); setFile(null); event.target.reset(); await loadImages(); setMessage("Gallery image published.");
    } catch (error) { setMessage(error.message || "Could not add this image."); }
    finally { setSaving(false); }
  };

  const remove = async (image) => {
    if (!window.confirm(`Delete “${image.title}” from the gallery?`)) return;
    try { await deleteGalleryImage(image); await loadImages(); }
    catch (error) { setMessage(error.message || "Could not delete this image."); }
  };

  return <div className="mx-auto max-w-6xl">
    <div className="mb-8"><h1 className="font-heading text-2xl font-bold text-textPrimary">Gallery Images</h1><p className="mt-2 font-body text-sm text-textSecondary">Upload school photos and remove images when they are no longer needed.</p></div>
    <div className="grid gap-8 xl:grid-cols-[.85fr_1.15fr]">
      <form onSubmit={submit} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-textPrimary">Add an image</h2>
        <label className="mt-5 block"><span className="font-body text-sm font-medium text-textPrimary">Title</span><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Science practical" className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 font-body text-sm outline-none focus:ring-2 focus:ring-primary" /></label>
        <label className="mt-5 block"><span className="font-body text-sm font-medium text-textPrimary">Category</span><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 font-body text-sm outline-none focus:ring-2 focus:ring-primary">{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-8 font-body text-sm font-semibold text-primary hover:bg-primary/10"><ImagePlus className="h-5 w-5" />{file ? file.name : "Choose image"}<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="sr-only" /></label>
        <button disabled={saving} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-body text-sm font-semibold text-white hover:bg-primaryDark disabled:opacity-60"><Upload className="h-4 w-4" />{saving ? "Publishing..." : "Publish image"}</button>
        {message && <p className="mt-4 font-body text-sm text-textSecondary" role="status">{message}</p>}
      </form>
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm"><h2 className="font-heading text-lg font-semibold text-textPrimary">Uploaded images</h2>{loading ? <p className="mt-5 font-body text-sm text-textSecondary">Loading images...</p> : <div className="mt-5 grid gap-4 sm:grid-cols-2">{images.length ? images.map((image) => <article key={image.id} className="overflow-hidden rounded-xl border border-border"><img src={image.image_url} alt={image.title} className="aspect-[4/3] w-full object-cover object-center" loading="lazy" decoding="async" /><div className="flex items-center justify-between gap-3 p-3"><div><h3 className="font-heading text-sm font-semibold text-textPrimary">{image.title}</h3><p className="font-body text-xs text-textSecondary">{image.category}</p></div><button type="button" onClick={() => remove(image)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${image.title}`}><Trash2 className="h-4 w-4" /></button></div></article>) : <p className="font-body text-sm text-textSecondary">No uploaded images yet.</p>}</div>}</section>
    </div>
  </div>;
};
export default ManageGallery;
