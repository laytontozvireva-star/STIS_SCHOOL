import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import LikeButton from "../components/LikeButton";
import eventImage from "../assets/images/gallery/stis-anniversary-team.webp";
import Card from "../components/Card";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { VACATION_PROGRAM } from "../utils/constants";
import { getEvents } from "../services/eventsService";

// ── Fallback data shown until the events table has content ───────────────────
const FALLBACK_UPCOMING = [
  {
    id: 0,
    title: VACATION_PROGRAM.title,
    event_date: "2026-08-12",
    time_label: "Full-day sessions",
    location: "Sir Tshobs International School",
    is_featured: true,
    description: `${VACATION_PROGRAM.subtitle}. Subjects: ${VACATION_PROGRAM.subjects.join(", ")}. ${VACATION_PROGRAM.accommodation}.`,
  },
  {
    id: 1,
    title: "Annual Sports Day",
    event_date: "2026-09-12",
    time_label: "8:00 AM – 3:00 PM",
    location: "Main Sports Field",
  },
  {
    id: 2,
    title: "Parent-Teacher Conference",
    event_date: "2026-09-20",
    time_label: "9:00 AM – 4:00 PM",
    location: "School Hall",
  },
  {
    id: 3,
    title: "Cultural Day Celebration",
    event_date: "2026-10-03",
    time_label: "10:00 AM – 2:00 PM",
    location: "School Grounds",
  },
];

const FALLBACK_PAST = [
  {
    id: 4,
    title: "Science Fair",
    event_date: "2026-07-18",
    description: "Students showcased innovative projects across biology, chemistry, and physics.",
  },
  {
    id: 5,
    title: "Graduation Ceremony",
    event_date: "2026-06-30",
    description: "We celebrated our graduating class and their achievements over the years.",
  },
  {
    id: 6,
    title: "Inter-House Athletics",
    event_date: "2026-06-08",
    description: "A spirited day of competition between our four school houses.",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const TODAY = new Date().toISOString().split("T")[0];

const friendlyDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

// ════════════════════════════════════════════════════════════════════════════
const Events = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    getEvents()
      .then((data) => {
        if (data.length > 0) {
          setAllEvents(data);
        } else {
          setUseFallback(true);
        }
      })
      .catch(() => setUseFallback(true))
      .finally(() => setLoading(false));
  }, []);

  // Split live events into upcoming / past based on date
  const upcoming = useFallback
    ? FALLBACK_UPCOMING
    : allEvents.filter((ev) => ev.event_date >= TODAY);

  const past = useFallback
    ? FALLBACK_PAST
    : allEvents.filter((ev) => ev.event_date < TODAY);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <Hero
        title="Events"
        subtitle="See what's happening on campus — upcoming and past events."
        backgroundImage={eventImage}
      />

      {/* ── Upcoming Events ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-bold text-textPrimary sm:text-3xl">
          Upcoming Events
        </h2>

        {upcoming.length === 0 ? (
          <p className="mt-8 font-body text-sm text-textSecondary">
            No upcoming events at the moment — check back soon.
          </p>
        ) : (
          <div className="mt-8 space-y-4">
            {upcoming.map((event) => (
              <div
                key={event.id}
                className={`flex flex-col gap-4 rounded-xl border p-6 shadow-md sm:flex-row sm:items-center sm:justify-between ${
                  event.is_featured
                    ? "border-secondary/40 bg-gradient-to-r from-primary/5 to-secondary/5"
                    : "border-border bg-surface"
                }`}
              >
                <div>
                  {event.is_featured && (
                    <span className="mb-2 inline-block rounded-full bg-secondary/20 px-3 py-0.5 font-body text-xs font-semibold uppercase tracking-wide text-accent">
                      Featured
                    </span>
                  )}
                  <h3 className="font-heading text-lg font-semibold text-textPrimary">
                    {event.title}
                  </h3>
                  <p className="mt-1 font-body text-sm text-textSecondary">
                    {friendlyDate(event.event_date)}
                    {event.time_label && <> &middot; {event.time_label}</>}
                    {event.location   && <> &middot; {event.location}</>}
                  </p>
                  {event.description && (
                    <p className="mt-2 font-body text-sm text-textSecondary">
                      {event.description}
                    </p>
                  )}
                  <div className="mt-3">
                    <LikeButton contentType="event" contentId={event.id} />
                  </div>
                </div>
                <Button
                  variant={event.is_featured ? "primary" : "outline"}
                  to={event.is_featured ? "/admissions" : "/contact"}
                  className="shrink-0"
                >
                  {event.is_featured ? "Register Now" : "Learn More"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Past Events ─────────────────────────────────────────────── */}
      {past.length > 0 && (
        <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading text-2xl font-bold text-textPrimary sm:text-3xl">
              Past Events
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <Card
                  key={event.id}
                  title={event.title}
                  description={event.description || ""}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-body text-xs text-textSecondary">
                      {friendlyDate(event.event_date)}
                    </span>
                    <LikeButton contentType="event" contentId={event.id} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Events;