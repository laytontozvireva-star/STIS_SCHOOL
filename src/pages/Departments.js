import { FlaskConical, Calculator, Landmark, Globe, Palette, Trophy } from "lucide-react";
import Hero from "../components/Hero";
import scienceLabImage from "../assets/images/gallery/stis-6.webp";
import Card from "../components/Card";
import Button from "../components/Button";

const DEPARTMENTS = [
  {
    id: "sciences",
    name: "Sciences",
    description: "Biology, Chemistry, and Physics — building curiosity through experimentation and inquiry.",
    Icon: FlaskConical,
    count: 6,
    borderClass: "border-l-primary",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    description: "A structured curriculum building problem-solving skills from foundational to advanced levels.",
    Icon: Calculator,
    count: 4,
    borderClass: "border-l-secondary",
  },
  {
    id: "humanities",
    name: "Humanities",
    description: "English, History, and Geography — developing critical thinking and communication.",
    Icon: Landmark,
    count: 5,
    borderClass: "border-l-accent",
  },
  {
    id: "languages",
    name: "Languages",
    description: "Local and foreign languages, building communication skills for a connected world.",
    Icon: Globe,
    count: 3,
    borderClass: "border-l-emerald-600",
  },
  {
    id: "arts",
    name: "Arts",
    description: "Visual Art and Music — nurturing creativity and self-expression.",
    Icon: Palette,
    count: 3,
    borderClass: "border-l-pink-600",
  },
  {
    id: "sports",
    name: "Sports",
    description: "Athletics, team sports, and fitness — developing discipline and teamwork.",
    Icon: Trophy,
    count: 4,
    borderClass: "border-l-rose-600",
  },
];

const Departments = () => {
  return (
    <div>
      <Hero
        title="Departments"
        subtitle="Explore the academic departments that shape our curriculum."
        backgroundImage={scienceLabImage}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {DEPARTMENTS.map((department) => (
            <Card
              key={department.id}
              title={department.name}
              description={department.description}
              icon={department.Icon}
              className={`border-l-4 ${department.borderClass}`}
            >
              <div className="flex items-center justify-between mt-4">
                <span className="inline-block rounded-lg bg-background px-2.5 py-1 text-[10px] font-bold font-body text-textSecondary uppercase tracking-wider border border-border">
                  {department.count} Subjects
                </span>
                <Button variant="outline" to="/staff" className="px-3.5 py-1.5 text-xs">
                  Meet the Team
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Departments;