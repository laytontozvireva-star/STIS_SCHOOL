import Hero from "../components/Hero";
import scienceLabImage from "../assets/images/gallery/stis-6.webp";
import Card from "../components/Card";
import Button from "../components/Button";

// Placeholder departments — no backend yet. Replace with real data once available.
const DEPARTMENTS = [
  {
    id: "sciences",
    name: "Sciences",
    description: "Biology, Chemistry, and Physics — building curiosity through experimentation and inquiry.",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    description: "A structured curriculum building problem-solving skills from foundational to advanced levels.",
  },
  {
    id: "humanities",
    name: "Humanities",
    description: "English, History, and Geography — developing critical thinking and communication.",
  },
  {
    id: "languages",
    name: "Languages",
    description: "Local and foreign languages, building communication skills for a connected world.",
  },
  {
    id: "arts",
    name: "Arts",
    description: "Visual Art and Music — nurturing creativity and self-expression.",
  },
  {
    id: "sports",
    name: "Sports",
    description: "Athletics, team sports, and fitness — developing discipline and teamwork.",
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

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DEPARTMENTS.map((department) => (
            <Card
              key={department.id}
              title={department.name}
              description={department.description}
            >
              <Button variant="outline" to="/staff" className="px-3 py-1.5 text-xs">
                Meet the Team
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Departments;