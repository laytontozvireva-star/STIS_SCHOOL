import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Hero from "../components/Hero";
import galleryHeroImage from "../assets/images/gallery/stis-18.webp";
import cakeImage from "../assets/images/gallery/stis-anniversary-cake.webp";
import teamImage from "../assets/images/gallery/stis-anniversary-team.webp";
import celebrationImage from "../assets/images/gallery/stis-anniversary-celebration.webp";
import classroom19Image from "../assets/images/gallery/stis-19.webp";
import classroom18Image from "../assets/images/gallery/stis-18.webp";
import classroom17Image from "../assets/images/gallery/stis-17.webp";
import event16Image from "../assets/images/gallery/stis-16.webp";
import classroom15Image from "../assets/images/gallery/stis-15.webp";
import classroom14Image from "../assets/images/gallery/stis-14.webp";
import classroom13Image from "../assets/images/gallery/stis-13.webp";
import campus12Image from "../assets/images/gallery/stis-12.webp";
import awards11Image from "../assets/images/gallery/stis-11.webp";
import football10Image from "../assets/images/gallery/stis-10.webp";
import football9Image from "../assets/images/gallery/stis-9.webp";
import netball8Image from "../assets/images/gallery/stis-8.webp";
import computerLab7Image from "../assets/images/gallery/stis-7.webp";
import scienceLab6Image from "../assets/images/gallery/stis-6.webp";
import scienceLab5Image from "../assets/images/gallery/stis-5.webp";
import campusImage from "../assets/images/stis-campus.webp";
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
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => { getGalleryImages().then(setUploadedItems).catch(() => {}); }, []);

  const allItems = [...uploadedItems.map((item) => ({ ...item, image: item.image_url })), ...GALLERY_ITEMS];

  const filteredItems =
    activeCategory === "All"
      ? allItems
      : allItems.filter((item) => item.category === activeCategory);

  const getCategoryCount = (cat) => {
    if (cat === "All") return allItems.length;
    return allItems.filter((item) => item.category === cat).length;
  };

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const navigateLightbox = (direction) => {
    if (lightboxIndex === null) return;
    let nextIndex = lightboxIndex + direction;
    if (nextIndex < 0) nextIndex = filteredItems.length - 1;
    if (nextIndex >= filteredItems.length) nextIndex = 0;
    setLightboxIndex(nextIndex);
  };

  const isLightboxOpen = lightboxIndex !== null;

  return (
    <div>
      <Hero
        title="Gallery"
        subtitle="Moments from campus life, events, and student achievements."
        backgroundImage={galleryHeroImage}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`flex items-center rounded-xl px-4 py-2 text-sm font-semibold font-body transition-all duration-200 cursor-pointer ${
                activeCategory === category
                  ? "bg-primary text-white shadow-md"
                  : "bg-surface text-textSecondary border border-border hover:bg-background hover:text-textPrimary"
              }`}
            >
              <span>{category}</span>
              <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                activeCategory === category ? "bg-white text-primary" : "bg-primary/10 text-primary"
              }`}>
                {getCategoryCount(category)}
              </span>
            </button>
          ))}
        </div>

        {/* Masonry Image grid */}
        <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 space-y-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => openLightbox(idx)}
              className="break-inside-avoid inline-block w-full group overflow-hidden rounded-2xl border border-border bg-surface shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" 
                  loading="lazy"
                />
                {/* Title overlay animation on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primaryDark/80 via-primaryDark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-[10px] font-bold font-body uppercase tracking-widest text-secondary mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-heading text-base font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="mt-16 rounded-2xl border border-border bg-surface p-12 text-center shadow-sm max-w-md mx-auto">
            <ImageIcon className="mx-auto h-12 w-12 text-textSecondary/40 mb-4" />
            <p className="font-body text-sm font-semibold text-textSecondary">
              No images in this category yet.
            </p>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 text-white animate-fade-in select-none">
          {/* Close button */}
          <button 
            type="button" 
            onClick={closeLightbox} 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-white/10"
            aria-label="Close lightbox"
          >
            <X className="h-7 w-7" />
          </button>

          {/* Navigation buttons */}
          <button 
            type="button" 
            onClick={() => navigateLightbox(-1)} 
            className="absolute left-4 md:left-10 text-white/70 hover:text-white transition-colors cursor-pointer p-3 rounded-full hover:bg-white/10"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button 
            type="button" 
            onClick={() => navigateLightbox(1)} 
            className="absolute right-4 md:right-10 text-white/70 hover:text-white transition-colors cursor-pointer p-3 rounded-full hover:bg-white/10"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Lightbox content */}
          <div className="max-w-4xl max-h-[80%] px-4 flex flex-col items-center">
            <img 
              src={filteredItems[lightboxIndex].image} 
              alt={filteredItems[lightboxIndex].title} 
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl animate-fade-in" 
            />
            <div className="text-center mt-6">
              <h3 className="font-heading text-lg font-bold text-white">
                {filteredItems[lightboxIndex].title}
              </h3>
              <p className="mt-1 font-body text-xs text-secondary tracking-widest uppercase font-semibold">
                {filteredItems[lightboxIndex].category}
              </p>
              <span className="text-[10px] text-white/50 mt-2 block font-body">
                {lightboxIndex + 1} of {filteredItems.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;