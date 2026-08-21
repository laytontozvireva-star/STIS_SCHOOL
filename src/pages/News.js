import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import Hero from "../components/Hero";
import celebrationImage from "../assets/images/gallery/stis-anniversary-celebration.webp";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import LikeButton from "../components/LikeButton";
import { getNewsPosts } from "../services/newsService";

const GRADIENT_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%231B3F7A;stop-opacity:1' /><stop offset='100%' style='stop-color:%230D1F45;stop-opacity:1' /></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><text x='50%' y='50%' font-family='sans-serif' font-size='32' font-weight='bold' fill='rgba(255,255,255,0.1)' text-anchor='middle' dominant-baseline='middle'>STIS NEWS</text></svg>";

const NEWS_ITEMS = [
  {
    id: 1,
    title: "Admissions Open for New Term",
    date: "August 1, 2026",
    excerpt: "Applications are now open for the upcoming term — spaces are limited, apply early to secure your place.",
    category: "Admissions",
  },
  {
    id: 2,
    title: "Science Fair Winners Announced",
    date: "July 22, 2026",
    excerpt: "Congratulations to our students for their outstanding projects at this year's regional science fair.",
    category: "Academic",
  },
  {
    id: 3,
    title: "New Library Wing Opens",
    date: "July 10, 2026",
    excerpt: "Our expanded library now offers more study spaces, a digital resource center, and a reading lounge.",
    category: "Campus",
  },
  {
    id: 4,
    title: "Staff Recognition Awards",
    date: "June 28, 2026",
    excerpt: "We celebrated the dedication of our teaching staff at this term's recognition ceremony.",
    category: "Staff",
  },
  {
    id: 5,
    title: "Annual Sports Day Recap",
    date: "June 15, 2026",
    excerpt: "A full day of athletics, team spirit, and school pride — see the highlights from this year's event.",
    category: "Sports",
  },
  {
    id: 6,
    title: "Parent-Teacher Conference Schedule",
    date: "June 5, 2026",
    excerpt: "Conference dates for the term have been set — check the schedule for your child's grade level.",
    category: "Community",
  },
];

const News = () => {
  const [publishedNews, setPublishedNews] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => { getNewsPosts().then(setPublishedNews).catch(() => {}); }, []);
  
  const items = publishedNews.length 
    ? publishedNews.map((post) => ({ 
        ...post, 
        date: new Date(post.published_at || post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        category: post.category || "General News"
      })) 
    : NEWS_ITEMS;

  const featuredItem = items[0];
  const otherItems = items.slice(1);

  return (
    <div>
      <Hero
        title="News"
        subtitle="Stay up to date with the latest announcements and happenings at our school."
        backgroundImage={celebrationImage}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Pinned/Featured Article */}
        {featuredItem && (
          <div className="mb-16 rounded-3xl border border-border bg-surface overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl group relative">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto min-h-[320px] bg-primaryDark overflow-hidden">
                <img 
                  src={featuredItem.image_url || GRADIENT_PLACEHOLDER} 
                  alt={featuredItem.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" 
                />
                <span className="absolute top-4 left-4 rounded-lg bg-secondary text-primaryDark text-[10px] font-extrabold font-body uppercase tracking-wider px-3 py-1 shadow-md">
                  Featured
                </span>
              </div>
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold font-body uppercase tracking-widest text-accent mb-2.5 block">
                    {featuredItem.category || "School Announcement"}
                  </span>
                  <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-textPrimary leading-tight group-hover:text-primary transition-colors duration-200">
                    {featuredItem.title}
                  </h3>
                  <p className="mt-4 font-body text-sm leading-relaxed text-textSecondary">
                    {featuredItem.excerpt || featuredItem.description || ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-border">
                  <span className="font-body text-xs text-textSecondary font-semibold flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-secondary" /> {featuredItem.date}
                  </span>
                  <div className="flex items-center gap-2">
                    <LikeButton contentType="news" contentId={featuredItem.id} />
                    <Button variant="primary" className="px-4 py-2 text-xs" onClick={() => setSelectedItem(featuredItem)}>
                      Read More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other News list */}
        {otherItems.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {otherItems.map((item) => (
              <div key={item.id} className="h-full">
                <Card 
                  title={item.title} 
                  description={item.excerpt}
                  image={item.image_url || GRADIENT_PLACEHOLDER}
                  category={item.category || "News"}
                  className="h-full"
                >
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/80">
                    <span className="font-body text-xs text-textSecondary font-semibold">{item.date}</span>
                    <div className="flex items-center gap-2">
                      <LikeButton contentType="news" contentId={item.id} />
                      <Button variant="outline" className="px-3 py-1.5 text-xs" onClick={() => setSelectedItem(item)}>
                        Read More
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Styled Modal */}
      <Modal 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        title={selectedItem?.title}
      >
        <div className="space-y-4 font-body">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="inline-block rounded-lg bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary uppercase">
              {selectedItem?.category || "School News"}
            </span>
            <p className="text-xs font-bold text-textSecondary">{selectedItem?.date}</p>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-textPrimary pt-2">
            {selectedItem?.excerpt}
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default News;