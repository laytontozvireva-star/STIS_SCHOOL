import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, MapPin, Clock, CheckCircle } from "lucide-react";
import Hero from "../components/Hero";
import LikeButton from "../components/LikeButton";
import eventImage from "../assets/images/gallery/stis-anniversary-team.webp";
import Card from "../components/Card";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { VACATION_PROGRAM } from "../utils/constants";
import { getEvents } from "../services/eventsService";

// Fallback data with categories
const FALLBACK_UPCOMING = [
  {
    id: 0,
    title: VACATION_PROGRAM.title,
    event_date: "2026-08-12",
    time_label: "Full-day sessions",
    location: "Sir Tshobs International School",
    is_featured: true,
    category: "Academic",
    description: `${VACATION_PROGRAM.subtitle}. Subjects: ${VACATION_PROGRAM.subjects.join(", ")}. ${VACATION_PROGRAM.accommodation}.`,
  },
  {
    id: 1,
    title: "Annual Sports Day",
    event_date: "2026-09-12",
    time_label: "8:00 AM – 3:00 PM",
    location: "Main Sports Field",
    category: "Sports",
  },
  {
    id: 2,
    title: "Parent-Teacher Conference",
    event_date: "2026-09-20",
    time_label: "9:00 AM – 4:00 PM",
    location: "School Hall",
    category: "Community",
  },
  {
    id: 3,
    title: "Cultural Day Celebration",
    event_date: "2026-10-03",
    time_label: "10:00 AM – 2:00 PM",
    location: "School Grounds",
    category: "Community",
  },
];

const FALLBACK_PAST = [
  {
    id: 4,
    title: "Science Fair",
    event_date: "2026-07-18",
    category: "Academic",
    description: "Students showcased innovative projects across biology, chemistry, and physics.",
  },
  {
    id: 5,
    title: "Graduation Ceremony",
    event_date: "2026-06-30",
    category: "Community",
    description: "We celebrated our graduating class and their achievements over the years.",
  },
  {
    id: 6,
    title: "Inter-House Athletics",
    event_date: "2026-06-08",
    category: "Sports",
    description: "A spirited day of competition between our four school houses.",
  },
];

const TODAY = new Date().toISOString().split("T")[0];
const CATEGORIES = ["All", "Academic", "Sports", "Community"];

const friendlyDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const parseEventDate = (dateStr) => {
  const dateObj = new Date(dateStr + "T00:00:00");
  const day = dateObj.toLocaleDateString("en-US", { day: "2-digit" });
  const month = dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  return { day, month };
};

const Events = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

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

  const upcoming = useFallback
    ? FALLBACK_UPCOMING
    : allEvents.filter((ev) => ev.event_date >= TODAY);

  const past = useFallback
    ? FALLBACK_PAST
    : allEvents.filter((ev) => ev.event_date < TODAY);

  // Filter upcoming events dynamically
  const filteredUpcoming = upcoming.filter((event) => {
    if (activeCategory === "All") return true;
    const cat = event.category || (event.title.toLowerCase().includes("sport") ? "Sports" : "Academic");
    return cat.toLowerCase() === activeCategory.toLowerCase();
  });

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
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-textPrimary sm:text-4xl">
              Upcoming Events
            </h2>
            <div className="mt-3 h-1 w-16 bg-secondary rounded-full" />
          </div>

          {/* Category filter tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-background border border-border rounded-2xl p-1">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold font-body transition-all duration-200 cursor-pointer ${
                  activeCategory === category
                    ? "bg-primary text-white shadow"
                    : "text-textSecondary hover:bg-background hover:text-textPrimary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredUpcoming.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center shadow-sm">
            <CalendarIcon className="mx-auto h-12 w-12 text-textSecondary/40 mb-4" />
            <p className="font-body text-sm font-semibold text-textSecondary">
              No upcoming events in this category at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredUpcoming.map((event) => {
              const { day, month } = parseEventDate(event.event_date);
              return (
                <div
                  key={event.id}
                  className={`flex flex-col gap-6 rounded-2xl border p-6 shadow-md md:flex-row md:items-center md:justify-between transition-all duration-300 hover:shadow-lg ${
                    event.is_featured
                      ? "border-secondary/40 bg-gradient-to-r from-primary/5 to-secondary/5"
                      : "border-border bg-surface"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    {/* Calendar Badge */}
                    <div className="flex flex-col items-center justify-center bg-primary text-white rounded-2xl h-16 w-16 shrink-0 border border-primary/25 shadow-md">
                      <span className="text-2xl font-extrabold font-heading leading-none">{day}</span>
                      <span className="text-[10px] font-bold font-body uppercase tracking-wider mt-0.5 text-secondary">{month}</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        {event.is_featured && (
                          <span className="inline-block rounded-lg bg-secondary/20 px-2.5 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider text-accent">
                            Featured
                          </span>
                        )}
                        <span className="inline-block rounded-lg bg-primary/10 px-2.5 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider text-primary">
                          {event.category || "Event"}
                        </span>
                      </div>
                      
                      <h3 className="mt-2.5 font-heading text-lg font-bold text-textPrimary">
                        {event.title}
                      </h3>
                      
                      <div className="mt-2 flex flex-wrap items-center gap-y-1.5 gap-x-4 font-body text-xs text-textSecondary">
                        <span className="flex items-center gap-1.5">
                          <CalendarIcon className="h-3.5 w-3.5 text-secondary" />
                          {friendlyDate(event.event_date)}
                        </span>
                        {event.time_label && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-secondary" />
                            {event.time_label}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-secondary" />
                            {event.location}
                          </span>
                        )}
                      </div>

                      {event.description && (
                        <p className="mt-3 font-body text-sm leading-relaxed text-textSecondary max-w-3xl">
                          {event.description}
                        </p>
                      )}
                      
                      <div className="mt-4">
                        <LikeButton contentType="event" contentId={event.id} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex md:self-center shrink-0">
                    <Button
                      variant={event.is_featured ? "primary" : "outline"}
                      to={event.is_featured ? "/admissions" : "/contact"}
                      className="w-full sm:w-auto"
                    >
                      {event.is_featured ? "Register Now" : "Enquire"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Past Events ─────────────────────────────────────────────── */}
      {past.length > 0 && (
        <section className="bg-background px-4 py-24 sm:px-6 lg:px-8 border-t border-border/40">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12">
              <h2 className="font-heading text-3xl font-extrabold text-textPrimary sm:text-4xl">
                Past Events
              </h2>
              <div className="mt-3 h-1 w-16 bg-accent rounded-full" />
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <div key={event.id} className="relative group">
                  <Card
                    title={event.title}
                    description={event.description || ""}
                    category={event.category || "Completed"}
                    className="filter grayscale hover:grayscale-0 transition-all duration-500 h-full"
                  >
                    {/* Completed overlay badge */}
                    <span className="absolute top-4 right-4 flex items-center gap-1 rounded-lg bg-gray-200 px-2.5 py-1 text-[10px] font-bold font-body uppercase tracking-wider text-gray-700 shadow-sm">
                      <CheckCircle className="h-3 w-3 text-emerald-600" /> Completed
                    </span>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/80">
                      <span className="font-body text-xs text-textSecondary font-semibold">
                        {friendlyDate(event.event_date)}
                      </span>
                      <LikeButton contentType="event" contentId={event.id} />
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Events;