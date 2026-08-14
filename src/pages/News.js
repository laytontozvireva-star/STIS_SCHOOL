import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import celebrationImage from "../assets/images/gallery/stis-anniversary-celebration.webp";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { getNewsPosts } from "../services/newsService";

// Placeholder news items — no backend yet. Replace with data fetched via
// services/api.js once available; Loader would be used for the fetch state.
const NEWS_ITEMS = [
  {
    id: 1,
    title: "Admissions Open for New Term",
    date: "August 1, 2026",
    excerpt: "Applications are now open for the upcoming term — spaces are limited, apply early to secure your place.",
  },
  {
    id: 2,
    title: "Science Fair Winners Announced",
    date: "July 22, 2026",
    excerpt: "Congratulations to our students for their outstanding projects at this year's regional science fair.",
  },
  {
    id: 3,
    title: "New Library Wing Opens",
    date: "July 10, 2026",
    excerpt: "Our expanded library now offers more study spaces, a digital resource center, and a reading lounge.",
  },
  {
    id: 4,
    title: "Staff Recognition Awards",
    date: "June 28, 2026",
    excerpt: "We celebrated the dedication of our teaching staff at this term's recognition ceremony.",
  },
  {
    id: 5,
    title: "Annual Sports Day Recap",
    date: "June 15, 2026",
    excerpt: "A full day of athletics, team spirit, and school pride — see the highlights from this year's event.",
  },
  {
    id: 6,
    title: "Parent-Teacher Conference Schedule",
    date: "June 5, 2026",
    excerpt: "Conference dates for the term have been set — check the schedule for your child's grade level.",
  },
];

const News = () => {
  const [publishedNews, setPublishedNews] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => { getNewsPosts().then(setPublishedNews).catch(() => {}); }, []);
  const items = publishedNews.length ? publishedNews.map((post) => ({ ...post, date: new Date(post.published_at || post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) })) : NEWS_ITEMS;
  return (
    <div>
      <Hero
        title="News"
        subtitle="Stay up to date with the latest announcements and happenings at our school."
        backgroundImage={celebrationImage}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} title={item.title} description={item.excerpt}>
              <div className="flex items-center justify-between mt-4">
                <span className="font-body text-xs text-textSecondary">{item.date}</span>
                <Button variant="outline" className="px-3 py-1.5 text-xs" onClick={() => setSelectedItem(item)}>
                  Read More
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Modal 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        title={selectedItem?.title}
      >
        <p className="mb-4 text-xs font-semibold text-primary">{selectedItem?.date}</p>
        <p className="whitespace-pre-wrap">{selectedItem?.excerpt}</p>
      </Modal>
    </div>
  );
};

export default News;