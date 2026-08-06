import Hero from "../components/Hero";
import Card from "../components/Card";
import Button from "../components/Button";
import { VACATION_PROGRAM } from "../utils/constants";

// Placeholder events — no backend yet. Replace with real data once
// services/api.js is connected.
const UPCOMING_EVENTS = [
  {
    id: 0,
    title: VACATION_PROGRAM.title,
    date: VACATION_PROGRAM.dates,
    time: "Full-day sessions",
    location: "Sir Tshobs International School",
    featured: true,
    description: `${VACATION_PROGRAM.subtitle}. Subjects: ${VACATION_PROGRAM.subjects.join(", ")}. ${VACATION_PROGRAM.accommodation}.`,
  },
  {
    id: 1,
    title: "Annual Sports Day",
    date: "September 12, 2026",
    time: "8:00 AM - 3:00 PM",
    location: "Main Sports Field",
  },
  {
    id: 2,
    title: "Parent-Teacher Conference",
    date: "September 20, 2026",
    time: "9:00 AM - 4:00 PM",
    location: "School Hall",
  },
  {
    id: 3,
    title: "Cultural Day Celebration",
    date: "October 3, 2026",
    time: "10:00 AM - 2:00 PM",
    location: "School Grounds",
  },
];

const PAST_EVENTS = [
  {
    id: 4,
    title: "Science Fair",
    date: "July 18, 2026",
    excerpt: "Students showcased innovative projects across biology, chemistry, and physics.",
  },
  {
    id: 5,
    title: "Graduation Ceremony",
    date: "June 30, 2026",
    excerpt: "We celebrated our graduating class and their achievements over the years.",
  },
  {
    id: 6,
    title: "Inter-House Athletics",
    date: "June 8, 2026",
    excerpt: "A spirited day of competition between our four school houses.",
  },
];

const Events = () => {
  return (
    <div>
      <Hero
        title="Events"
        subtitle="See what's happening on campus — upcoming and past events."
      />

      {/* Upcoming Events */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-bold text-textPrimary sm:text-3xl">
          Upcoming Events
        </h2>
        <div className="mt-8 space-y-4">
          {UPCOMING_EVENTS.map((event) => (
            <div
              key={event.id}
              className={`flex flex-col gap-4 rounded-xl border p-6 shadow-md sm:flex-row sm:items-center sm:justify-between ${
                event.featured
                  ? "border-secondary/40 bg-gradient-to-r from-primary/5 to-secondary/5"
                  : "border-border bg-surface"
              }`}
            >
              <div>
                {event.featured && (
                  <span className="mb-2 inline-block rounded-full bg-secondary/20 px-3 py-0.5 font-body text-xs font-semibold uppercase tracking-wide text-accent">
                    Featured
                  </span>
                )}
                <h3 className="font-heading text-lg font-semibold text-textPrimary">
                  {event.title}
                </h3>
                <p className="mt-1 font-body text-sm text-textSecondary">
                  {event.date} &middot; {event.time} &middot; {event.location}
                </p>
                {event.description && (
                  <p className="mt-2 font-body text-sm text-textSecondary">{event.description}</p>
                )}
              </div>
              <Button variant={event.featured ? "primary" : "outline"} to={event.featured ? "/admissions" : undefined} className="shrink-0">
                {event.featured ? "Register Now" : "Learn More"}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Past Events */}
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-heading text-2xl font-bold text-textPrimary sm:text-3xl">
            Past Events
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PAST_EVENTS.map((event) => (
              <Card key={event.id} title={event.title} description={event.excerpt}>
                <span className="font-body text-xs text-textSecondary">{event.date}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;