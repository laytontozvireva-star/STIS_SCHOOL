import Hero from "../components/Hero";
import Card from "../components/Card";
import Button from "../components/Button";

const CORE_VALUES = [
  {
    title: "Integrity",
    description: "We act with honesty and hold ourselves accountable in everything we do.",
  },
  {
    title: "Excellence",
    description: "We set high standards and support every student in reaching them.",
  },
  {
    title: "Respect",
    description: "We value every voice and treat one another with dignity.",
  },
  {
    title: "Community",
    description: "We grow stronger together, as students, families, and educators.",
  },
];

const About = () => {
  return (
    <div>
      <Hero
        title="About Our School"
        subtitle="Learn about our history, mission, and the values that guide us."
      />

      {/* Mission & Vision */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold text-textPrimary">
              Our Mission
            </h2>
            <p className="mt-4 font-body text-sm leading-relaxed text-textSecondary">
              To provide a nurturing, challenging, and inclusive learning environment
              that equips every student with the knowledge, skills, and character
              needed to thrive in a changing world.
            </p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-textPrimary">
              Our Vision
            </h2>
            <p className="mt-4 font-body text-sm leading-relaxed text-textSecondary">
              To be a leading institution recognized for academic excellence,
              strong values, and the holistic development of confident, capable
              young people.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-heading text-2xl font-bold text-textPrimary sm:text-3xl">
            Our Core Values
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map((value) => (
              <Card key={value.title} title={value.title} description={value.description} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-bold text-textPrimary sm:text-3xl">
          Want to Join Our Community?
        </h2>
        <p className="mx-auto mt-3 max-w-xl font-body text-sm text-textSecondary">
          We welcome families who share our commitment to excellence and growth.
        </p>
        <div className="mt-6">
          <Button variant="primary" to="/admissions">
            Start Your Application
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;