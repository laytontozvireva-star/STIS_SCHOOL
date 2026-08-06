import { BookOpen, Users, Building } from "lucide-react";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Button from "../components/Button";

const FEATURES = [
  {
    title: "Academic Excellence",
    description: "A challenging curriculum guided by experienced, dedicated educators.",
    Icon: BookOpen,
    delay: "animate-slide-up",
  },
  {
    title: "Vibrant Community",
    description: "A supportive environment where every student is known and valued.",
    Icon: Users,
    delay: "animate-slide-up-delay-1",
  },
  {
    title: "Modern Facilities",
    description: "Purpose-built spaces for learning, sport, arts, and collaboration.",
    Icon: Building,
    delay: "animate-slide-up-delay-2",
  },
];

const NEWS_PREVIEW = [
  {
    title: "Annual Sports Day Announced",
    description: "Join us for a full day of athletics, team spirit, and school pride.",
  },
  {
    title: "Admissions Open for New Term",
    description: "Applications are now open — spaces are limited, apply early.",
  },
  {
    title: "Science Fair Winners",
    description: "Congratulations to our students for their outstanding projects.",
  },
];

const Home = () => {
  return (
    <div>
      <Hero
        title="Welcome to S.T.I.S"
        subtitle="Nurturing excellence, character, and lifelong learning."
      >
        <Button variant="secondary" to="/admissions">
          Apply Now
        </Button>
        <Button variant="outline" to="/about" className="border-white text-white hover:bg-white/10">
          Learn More
        </Button>
      </Hero>

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
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/5 text-secondary transition-all duration-300 group-hover:-translate-y-2 group-hover:bg-primary group-hover:text-white group-hover:shadow-xl group-hover:shadow-primary/20">
                  <feature.Icon className="h-10 w-10" />
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
            {NEWS_PREVIEW.map((item, idx) => (
              <div key={item.title} className={`animate-slide-up-delay-${(idx % 3) + 1}`}>
                <Card title={item.title} description={item.description} className="h-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;