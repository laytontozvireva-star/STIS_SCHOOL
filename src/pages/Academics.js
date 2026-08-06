import Hero from "../components/Hero";
import Card from "../components/Card";
import Button from "../components/Button";

const GRADE_LEVELS = [
  {
    title: "Form 1 - Form 2",
    range: "O'Level Foundation",
    description: "Building a strong academic base across core and elective subjects ahead of O'Level examinations.",
  },
  {
    title: "Form 3 - Form 4",
    range: "O'Level Examinations",
    description: "Focused preparation and subject specialization leading up to O'Level examinations.",
  },
  {
    title: "Form 5 - Form 6",
    range: "A'Level",
    description: "Advanced study in chosen subject combinations, preparing students for tertiary education.",
  },
];

const TEACHING_APPROACH = [
  {
    title: "Subject Specialization",
    description: "Experienced subject teachers guiding students through the O'Level and A'Level curricula.",
  },
  {
    title: "Small Class Sizes",
    description: "More individual attention and stronger teacher-student relationships.",
  },
  {
    title: "Continuous Assessment",
    description: "Regular tests and feedback that build toward strong examination performance.",
  },
];

const Academics = () => {
  return (
    <div>
      <Hero
        title="Academics"
        subtitle="A curriculum built to challenge, support, and inspire every student, from Form 1 through A'Level."
      />

      {/* Grade levels */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-heading text-2xl font-bold text-textPrimary sm:text-3xl">
          Levels of Study
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {GRADE_LEVELS.map((level) => (
            <Card key={level.title} title={level.title} description={level.description}>
              <span className="inline-block rounded-xl bg-primary/10 px-3 py-1 font-body text-xs font-medium text-primary">
                {level.range}
              </span>
            </Card>
          ))}
        </div>
      </section>

      {/* Teaching approach */}
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-heading text-2xl font-bold text-textPrimary sm:text-3xl">
            Our Teaching Approach
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {TEACHING_APPROACH.map((item) => (
              <div key={item.title} className="text-center">
                <h3 className="font-heading text-lg font-semibold text-textPrimary">
                  {item.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-textSecondary">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-bold text-textPrimary sm:text-3xl">
          Explore Our Departments
        </h2>
        <p className="mx-auto mt-3 max-w-xl font-body text-sm text-textSecondary">
          Take a closer look at the subjects and departments that make up our curriculum.
        </p>
        <div className="mt-6">
          <Button variant="primary" to="/departments">
            View Departments
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Academics;