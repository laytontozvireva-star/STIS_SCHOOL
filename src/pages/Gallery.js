import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import cakeImage from "../assets/images/gallery/stis-anniversary-cake.jpeg";
import teamImage from "../assets/images/gallery/stis-anniversary-team.jpeg";
import celebrationImage from "../assets/images/gallery/stis-anniversary-celebration.jpeg";
import classroom19Image from "../assets/images/gallery/stis-19.jpeg";
import classroom18Image from "../assets/images/gallery/stis-18.jpeg";
import classroom17Image from "../assets/images/gallery/stis-17.jpeg";
import event16Image from "../assets/images/gallery/stis-16.jpeg";
import classroom15Image from "../assets/images/gallery/stis-15.jpeg";
import classroom14Image from "../assets/images/gallery/stis-14.jpeg";
import classroom13Image from "../assets/images/gallery/stis-13.jpeg";
import campus12Image from "../assets/images/gallery/stis-12.jpeg";
import awards11Image from "../assets/images/gallery/stis-11.jpeg";
import football10Image from "../assets/images/gallery/stis-10.jpeg";
import football9Image from "../assets/images/gallery/stis-9.jpeg";
import netball8Image from "../assets/images/gallery/stis-8.jpeg";
import computerLab7Image from "../assets/images/gallery/stis-7.jpeg";
import scienceLab6Image from "../assets/images/gallery/stis-6.jpeg";
import scienceLab5Image from "../assets/images/gallery/stis-5.jpeg";
import campusImage from "../assets/images/stis-campus.jpeg";
import { getGalleryImages } from "../services/galleryService";

const CATEGORIES = ["All", "Campus", "Events", "Sports", "Academics"];

const GALLERY_ITEMS = [
  { id: 1, title: "S.T.I.S Campus", category: "Campus", image: campusImage },
  { id: 2, title: "Campus Entrance", category: "Campus", image: campus12Image },
  { id: 3, title: "Second Anniversary Cake", category: "Events", image: cakeImage },
  { id: 4, title: "Anniversary Celebration", category: "Events", image: teamImage },
  { id: 5, title: "Celebrating Together", category: "Events", image: celebrationImage },
  { id: 6, title: "School Gathering", category: "Events", image: event16Image },
  { id: 7, title: "Learning Together", category: "Academics", image: classroom19Image },
  { id: 8, title: "Classroom Focus", category: "Academics", image: classroom18Image },
  { id: 9, title: "Students in Class", category: "Academics", image: classroom17Image },
  { id: 10, title: "Classroom Session", category: "Academics", image: classroom15Image },
  { id: 11, title: "Engaged Learners", category: "Academics", image: classroom14Image },
  { id: 12, title: "Learning with Confidence", category: "Academics", image: classroom13Image },
  { id: 13, title: "Computer Laboratory", category: "Academics", image: computerLab7Image },
  { id: 14, title: "Science Practical", category: "Academics", image: scienceLab6Image },
  { id: 15, title: "Science Experiment", category: "Academics", image: scienceLab5Image },
  { id: 16, title: "Student Achievement", category: "Sports", image: awards11Image },
  { id: 17, title: "Football Action", category: "Sports", image: football10Image },
  { id: 18, title: "Football Match", category: "Sports", image: football9Image },
  { id: 19, title: "Netball Team", category: "Sports", image: netball8Image },
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [uploadedItems, setUploadedItems] = useState([]);

  useEffect(() => { getGalleryImages().then(setUploadedItems).catch(() => {}); }, []);

  const allItems = [...uploadedItems, ...GALLERY_ITEMS];

  const filteredItems =
    activeCategory === "All"
      ? allItems
      : allItems.filter((item) => item.category === activeCategory);

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
              <img
                src={item.image}
                alt={item.title}
                className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
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