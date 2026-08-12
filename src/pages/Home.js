import {
  GraduationCap,
  HeartHandshake,
  Landmark,
  Newspaper,
} from "lucide-react";
import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Button from "../components/Button";
import VacationBanner from "../components/VacationBanner";
import campusImage from "../assets/images/stis-campus.webp";
import { getNewsPosts } from "../services/newsService";

const ICON_PROPS = { className: "h-9 w-9", strokeWidth: 1.75 };

const FEATURES = [
  {
    title: "Academic Excellence",
    description: "A challenging curriculum guided by experienced, dedicated educators.",
    Icon: GraduationCap,
    iconBg: "bg-primary/10 group-hover:bg-primary",
    delay: "animate-slide-up",
  },
  {
    title: "Vibrant Community",
    description: "A supportive environment where every student is known and valued.",
    Icon: HeartHandshake,
    iconBg: "bg-secondary/15 group-hover:bg-secondary",
    delay: "animate-slide-up-delay-1",
  },
  {
    title: "Modern Facilities",
    description: "Purpose-built spaces for learning, sport, arts, and collaboration.",
    Icon: Landmark,
    iconBg: "bg-accent/10 group-hover:bg-accent",
    delay: "animate-slide-up-delay-2",
  },
];

// Fallback shown until Supabase news_posts has content
const FALLBACK_NEWS = [
  {
    id: "f1",
    title: "August Vacation School 2026",
    excerpt: "Form 1–6 revision classes in Commercials, Arts & Sciences. 12 Aug – 1 Sept.",
  },
  {
    id: "f2",
    title: "Admissions Open for New Term",
    excerpt: "Applications are now open — spaces are limited, apply early.",
  },
  {
    id: "f3",
    title: "Science Fair Winners",
    excerpt: "Congratulations to our students for their outstanding projects.",
  },
];

const Home = () => {
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    getNewsPosts()
      .then((posts) => {
        if (posts.length > 0) setNewsItems(posts.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const preview = newsItems.length > 0 ? newsItems : FALLBACK_NEWS;
  return (
    <div>
      <Hero
        title="Welcome to S.T.I.S"
        subtitle="Nurturing excellence, character, and lifelong learning."
        backgroundImage={campusImage}
      >
        <Button variant="secondary" to="/admissions">
          Apply Now
        </Button>
        <Button variant="outline" to="/about" className="border-white text-white hover:bg-white/10">
          Learn More
        </Button>
      </Hero>

      <VacationBanner />

      {/* Why Choose Us */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
            <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
              Why Choose Us
            </h2>
            <div className="mt-4 h-1 w-20 bg-secondary mx-auto rounded-full" />
            <p className="mt-6 font-body text-lg text-textSecondary leading-relaxed">
              We provide an enriching environment that balances rigorous academics with the personal growth and well-being of every student.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className={`text-center group ${feature.delay}`}>
                <div
                  className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl text-primary transition-all duration-300 group-hover:-translate-y-2 group-hover:text-white group-hover:shadow-xl group-hover:shadow-primary/20 ${feature.iconBg}`}
                >
                  <feature.Icon {...ICON_PROPS} />
                </div>
                <h3 className="mt-8 font-heading text-xl font-bold text-textPrimary transition-colors group-hover:text-primary">
                  {feature.title}
                </h3>
                <p className="mt-3 font-body text-base leading-relaxed text-textSecondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News preview */}
      <section className="bg-background px-4 py-24 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 animate-slide-up">
            <div>
              <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
                Latest News
              </h2>
              <div className="mt-4 h-1 w-16 bg-accent rounded-full" />
            </div>
            <div className="mt-6 sm:mt-0">
              <Button variant="outline" to="/news">
                View All News
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {preview.map((item, idx) => (
              <div key={item.id || item.title} className={`animate-slide-up-delay-${(idx % 3) + 1}`}>
                <Card
                  title={item.title}
                  description={item.excerpt || item.description || ""}
                  icon={Newspaper}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;