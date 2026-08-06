import { useState } from "react";
import Hero from "../components/Hero";

const CATEGORIES = ["All", "Campus", "Events", "Sports", "Academics"];

// Placeholder gallery items — no real photos yet, so each uses a labeled
// color block instead of a broken <img> tag. Swap `image` for a real
// imported asset once photos are available (same pattern as logo.png).
const GALLERY_ITEMS = [
  { id: 1, title: "Main Campus Building", category: "Campus" },
  { id: 2, title: "Science Laboratory", category: "Academics" },
  { id: 3, title: "Annual Sports Day", category: "Sports" },
  { id: 4, title: "Graduation Ceremony", category: "Events" },
  { id: 5, title: "Library", category: "Campus" },
  { id: 6, title: "Inter-House Athletics", category: "Sports" },
  { id: 7, title: "Science Fair", category: "Academics" },
  { id: 8, title: "Cultural Day", category: "Events" },
  { id: 9, title: "School Grounds", category: "Campus" },
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div>
      <Hero
        title="Gallery"
        subtitle="Moments from campus life, events, and student achievements."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-xl px-4 py-2 text-sm font-medium font-body transition-colors duration-200 ${
                activeCategory === category
                  ? "bg-primary text-white"
                  : "bg-surface text-textSecondary border border-border hover:bg-background"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Image grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-xl border border-border bg-surface shadow-md transition-shadow duration-200 hover:shadow-lg"
            >
              {/* Placeholder image block — replace with a real <img> once photos exist */}
              <div className="flex h-48 w-full items-center justify-center bg-primary/10 font-body text-xs text-primary">
                Image coming soon
              </div>
              <div className="p-4">
                <h3 className="font-heading text-sm font-semibold text-textPrimary">
                  {item.title}
                </h3>
                <span className="mt-1 inline-block font-body text-xs text-textSecondary">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <p className="mt-10 text-center font-body text-sm text-textSecondary">
            No images in this category yet.
          </p>
        )}
      </section>
    </div>
  );
};

export default Gallery;