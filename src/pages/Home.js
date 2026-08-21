import { useEffect, useState } from "react";
import {
  GraduationCap,
  HeartHandshake,
  Landmark,
  Newspaper,
  Quote,
  ArrowRight,
  Users,
  Calendar,
  Layers,
} from "lucide-react";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Button from "../components/Button";
import VacationBanner from "../components/VacationBanner";
import campusImage from "../assets/images/stis-campus.webp";

// Existing gallery image assets for mosaic
import image5 from "../assets/images/gallery/stis-5.webp";
import image6 from "../assets/images/gallery/stis-6.webp";
import image7 from "../assets/images/gallery/stis-7.webp";
import image10 from "../assets/images/gallery/stis-10.webp";
import image13 from "../assets/images/gallery/stis-13.webp";
import image19 from "../assets/images/gallery/stis-19.webp";

import { getNewsPosts } from "../services/newsService";


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

const FALLBACK_NEWS = [
  {
    id: "f1",
    title: "August Vacation School 2026",
    excerpt: "Form 1–6 revision classes in Commercials, Arts & Sciences. 12 Aug – 1 Sept.",
    date: "August 12, 2026",
  },
  {
    id: "f2",
    title: "Admissions Open for New Term",
    excerpt: "Applications are now open — spaces are limited, apply early.",
    date: "August 1, 2026",
  },
  {
    id: "f3",
    title: "Science Fair Winners",
    excerpt: "Congratulations to our students for their outstanding projects.",
    date: "July 22, 2026",
  },
];

const PORTALS = [
  {
    title: "For Parents",
    description: "Access student reports, grade trackers, and stay connected with our community.",
    link: "/login",
    cta: "Parent Portal",
    color: "border-t-4 border-t-primary hover:border-primary/20",
  },
  {
    title: "For Students",
    description: "Explore your academic resources, departments, and extra-curricular clubs.",
    link: "/academics",
    cta: "Academics Overview",
    color: "border-t-4 border-t-secondary hover:border-secondary/20",
  },
  {
    title: "For Prospective Families",
    description: "Learn about our admissions process, required documentation, and deadlines.",
    link: "/admissions",
    cta: "Admissions Center",
    color: "border-t-4 border-t-accent hover:border-accent/20",
  },
];

const MOSAIC_IMAGES = [
  { src: image19, alt: "Classroom Learning" },
  { src: image10, alt: "Sports & Athletics Action" },
  { src: image7, alt: "Computer Laboratory" },
  { src: image6, alt: "Science Laboratory Sessions" },
  { src: image5, alt: "Hands-on Experiments" },
  { src: image13, alt: "Confidence in Education" },
];

const STATS_DATA = [
  { value: "500", label: "Students", suffix: "+", Icon: Users },
  { value: "50", label: "Dedicated Staff", suffix: "+", Icon: HeartHandshake },
  { value: "6", label: "Forms Offered", suffix: " (Form 1-6)", Icon: Layers },
  { value: "2024", label: "Established Year", suffix: "", Icon: Calendar },
];

const CounterItem = ({ targetValue, label, suffix = "", icon: Icon }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isNaN(parseInt(targetValue))) {
      setCount(targetValue);
      return;
    }

    const target = parseInt(targetValue);
    const duration = 1200; // Animation duration in ms
    const steps = 40;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const val = Math.min(target, Math.floor((target / steps) * step));
      setCount(val);
      if (step >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetValue]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-surface rounded-2xl border border-border shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-4xl font-extrabold text-primary font-heading">
        {count}
        {suffix}
      </p>
      <p className="mt-2 text-sm font-semibold font-body text-textSecondary uppercase tracking-wider text-center">{label}</p>
    </div>
  );
};

const Home = () => {
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    getNewsPosts()
      .then((posts) => {
        if (posts.length > 0) {
          const formatted = posts.slice(0, 3).map((post) => ({
            ...post,
            date: new Date(post.published_at || post.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
          }));
          setNewsItems(formatted);
        }
      })
      .catch(() => {});
  }, []);

  const preview = newsItems.length > 0 ? newsItems : FALLBACK_NEWS;
  const heroStats = [
    { label: "Students", value: "500+" },
    { label: "Staff Members", value: "50+" },
    { label: "Curriculum Year", value: "Est. 2024" },
  ];

  return (
    <div>
      <Hero
        title="Welcome to S.T.I.S"
        subtitle="Nurturing excellence, character, and lifelong learning."
        backgroundImage={campusImage}
        stats={heroStats}
      >
        <Button variant="secondary" to="/admissions">
          Apply Now
        </Button>
        <Button variant="outline" to="/about" className="border-white text-white hover:bg-white/10">
          Learn More
        </Button>
      </Hero>

      {/* Portals Section */}
      <section className="-mt-8 relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PORTALS.map((portal) => (
            <div
              key={portal.title}
              className={`rounded-2xl border border-border bg-surface p-8 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${portal.color}`}
            >
              <h3 className="font-heading text-xl font-bold text-textPrimary">
                {portal.title}
              </h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-textSecondary h-12">
                {portal.description}
              </p>
              <div className="mt-6">
                <Button
                  variant="ghost"
                  to={portal.link}
                  className="px-0 font-bold text-primary group"
                >
                  {portal.cta}
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <VacationBanner />

      {/* Why Choose Us */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-20 animate-slide-up">
            <h2 className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">
              Why Choose Us
            </h2>
            <div className="mt-4 h-1 w-20 bg-secondary mx-auto rounded-full" />
            <p className="mt-6 font-body text-lg text-textSecondary leading-relaxed">
              We provide an enriching environment that balances rigorous academics with the personal growth and well-being of every student.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-16 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className={`text-center group ${feature.delay}`}>
                <div
                  className={`mx-auto flex h-24 w-24 items-center justify-center rounded-3xl text-primary transition-all duration-300 group-hover:-translate-y-2 group-hover:text-white group-hover:shadow-2xl group-hover:shadow-primary/35 ${feature.iconBg}`}
                >
                  <feature.Icon className="h-10 w-10" strokeWidth={1.75} />
                </div>
                <h3 className="mt-8 font-heading text-2xl font-bold text-textPrimary transition-colors group-hover:text-primary">
                  {feature.title}
                </h3>
                <p className="mt-4 font-body text-base leading-relaxed text-textSecondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="bg-background py-20 px-4 sm:px-6 lg:px-8 border-t border-b border-border/40">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS_DATA.map((stat) => (
              <CounterItem
                key={stat.label}
                targetValue={stat.value}
                label={stat.label}
                suffix={stat.suffix}
                icon={stat.Icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Campus Life Image Mosaic */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">
              Campus Life Mosaic
            </h2>
            <div className="mt-4 h-1 w-20 bg-secondary mx-auto rounded-full" />
            <p className="mt-6 font-body text-base text-textSecondary">
              Take a visual tour through our state-of-the-art learning facilities, sport pitches, and interactive classrooms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {MOSAIC_IMAGES.map((img, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-border shadow-md h-64 group relative cursor-pointer"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primaryDark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-body text-sm font-semibold uppercase tracking-wider">
                    {img.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" to="/gallery">
              View Entire Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial Quote Section */}
      <section className="bg-[#0D1F45]/5 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <Quote className="mx-auto h-12 w-12 text-secondary/60 mb-6" />
          <blockquote className="font-heading text-xl md:text-2xl font-semibold leading-relaxed text-primaryDark">
            "Sir Tshobs International School was built on the core belief that academic rigor and strong character education go hand-in-hand. We prepare students not just to pass exams, but to thrive in a global community."
          </blockquote>
          <cite className="mt-6 block not-italic font-body text-sm text-textSecondary uppercase tracking-wider font-bold">
            &mdash; S.T.I.S School Motto & Philosophy
          </cite>
        </div>
      </section>

      {/* Latest News preview */}
      <section className="bg-background px-4 py-24 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-16">
            <div>
              <h2 className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">
                Latest News & Updates
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
              <div key={item.id || item.title} className="h-full">
                <Card
                  title={item.title}
                  description={item.excerpt || item.description || ""}
                  icon={Newspaper}
                  category={item.category || "Announcement"}
                  className="h-full"
                >
                  <p className="text-xs text-textSecondary font-semibold font-body mt-2">
                    {item.date}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primaryDark to-primary text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_120%,#F5A623_10%,transparent_50%)]" />
        <div className="relative mx-auto max-w-3xl z-10">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Start Your Child's Journey Today
          </h2>
          <p className="mt-4 max-w-xl mx-auto font-body text-base text-blue-100">
            Admissions are open for O'Level and A'Level students. Join a community dedicated to developing character, leadership, and academic success.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="secondary" to="/admissions">
              Apply Now
            </Button>
            <Button
              variant="outline"
              to="/contact"
              className="border-white text-white hover:bg-white/10"
            >
              Contact Admissions
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;