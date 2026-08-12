import { useEffect, useState } from "react";
import { CalendarDays, Plus, Trash2, Star } from "lucide-react";
import { deleteEvent, getEvents, saveEvent } from "../../../services/eventsService";

const TODAY = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

const EMPTY = {
  title: "",
  event_date: "",
  time_label: "",
  location: "Sir Tshobs International School",
  description: "",
  is_featured: false,
};

const ManageEvents = () => {
  const [events, setEvents]   = useState([]);
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      setEvents(await getEvents());
    } catch {
      setMessage("Run the Events SQL block in Supabase to enable event management.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await saveEvent(form);
      setForm(EMPTY);
      await load();
      setMessage("Event saved successfully.");
    } catch (err) {
      setMessage(err.message || "Could not save this event.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (event) => {
    if (!window.confirm(`Delete "${event.title}"?`)) return;
    try {
      await deleteEvent(event.id);
      await load();
    } catch (err) {
      setMessage(err.message || "Could not delete this event.");
    }
  };

  // Split into upcoming vs past by comparing event_date to today
  const upcoming = events.filter((ev) => ev.event_date >= TODAY);
  const past     = events.filter((ev) => ev.event_date  < TODAY);

  const formatDate = (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short", month: "long", day: "numeric", year: "numeric",
    });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-textPrimary">Events</h1>
        <p className="mt-2 font-body text-sm text-textSecondary">
          Add upcoming school events. Events automatically move to "Past Events"
          once their date has passed — no manual action needed.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[.85fr_1.15fr]">
        {/* ── Add event form ──────────────────────────────────────── */}
        <form onSubmit={submit} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-textPrimary">Add event</h2>

          <label className="mt-5 block">
            <span className="font-body text-sm font-medium text-textPrimary">Title *</span>
            <input
              name="title" required value={form.title} onChange={set}
              placeholder="e.g. Annual Sports Day"
              className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 font-body text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="mt-4 block">
            <span className="font-body text-sm font-medium text-textPrimary">Date *</span>
            <input
              type="date" name="event_date" required value={form.event_date} onChange={set}
              className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 font-body text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="mt-4 block">
            <span className="font-body text-sm font-medium text-textPrimary">Time</span>
            <input
              name="time_label" value={form.time_label} onChange={set}
              placeholder="e.g. 8:00 AM – 3:00 PM"
              className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 font-body text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="mt-4 block">
            <span className="font-body text-sm font-medium text-textPrimary">Location</span>
            <input
              name="location" value={form.location} onChange={set}
              className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 font-body text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="mt-4 block">
            <span className="font-body text-sm font-medium text-textPrimary">Description</span>
            <textarea
              name="description" rows={3} value={form.description} onChange={set}
              placeholder="Optional extra details shown on the Events page"
              className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 font-body text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="mt-4 flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox" name="is_featured" checked={form.is_featured} onChange={set}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <span className="font-body text-sm text-textPrimary">
              Mark as Featured <span className="text-textSecondary">(highlighted on Events page)</span>
            </span>
          </label>

          <button
            disabled={saving}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-body text-sm font-semibold text-white hover:bg-primaryDark disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {saving ? "Saving…" : "Add event"}
          </button>

          {message && (
            <p className="mt-4 font-body text-sm text-textSecondary" role="status">{message}</p>
          )}
        </form>

        {/* ── Event list ─────────────────────────────────────────── */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-textPrimary">All events</h2>

          {loading ? (
            <p className="mt-5 font-body text-sm text-textSecondary">Loading events…</p>
          ) : events.length === 0 ? (
            <p className="mt-5 font-body text-sm text-textSecondary">No events yet. Add your first one.</p>
          ) : (
            <div className="mt-5 space-y-6">
              {/* Upcoming */}
              {upcoming.length > 0 && (
                <div>
                  <p className="mb-2 font-body text-xs font-semibold uppercase tracking-wide text-primary">
                    Upcoming ({upcoming.length})
                  </p>
                  <div className="space-y-3">
                    {upcoming.map((ev) => (
                      <EventRow key={ev.id} ev={ev} formatDate={formatDate} onDelete={remove} />
                    ))}
                  </div>
                </div>
              )}

              {/* Past */}
              {past.length > 0 && (
                <div>
                  <p className="mb-2 font-body text-xs font-semibold uppercase tracking-wide text-textSecondary">
                    Past ({past.length})
                  </p>
                  <div className="space-y-3 opacity-70">
                    {past.map((ev) => (
                      <EventRow key={ev.id} ev={ev} formatDate={formatDate} onDelete={remove} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

/* Small reusable row component */
const EventRow = ({ ev, formatDate, onDelete }) => (
  <article className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <CalendarDays className="h-4 w-4" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-sm font-semibold text-textPrimary">{ev.title}</h3>
          {ev.is_featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
        </div>
        <p className="mt-0.5 font-body text-xs text-textSecondary">
          {formatDate(ev.event_date)}
          {ev.time_label && <> &middot; {ev.time_label}</>}
          {ev.location && <> &middot; {ev.location}</>}
        </p>
        {ev.description && (
          <p className="mt-1 font-body text-xs text-textSecondary line-clamp-2">{ev.description}</p>
        )}
      </div>
    </div>
    <button
      type="button"
      onClick={() => onDelete(ev)}
      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
      aria-label={`Delete ${ev.title}`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  </article>
);

export default ManageEvents;
