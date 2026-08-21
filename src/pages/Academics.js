import { useState } from "react";
import { Users, ClipboardCheck, BookOpen, ChevronDown, ChevronUp, GraduationCap } from "lucide-react";
import Hero from "../components/Hero";
import learningImage from "../assets/images/gallery/stis-19.webp";

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
    Icon: BookOpen,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Small Class Sizes",
    description: "More individual attention and stronger teacher-student relationships.",
    Icon: Users,
    color: "bg-secondary/15 text-secondary",
  },
  {
    title: "Continuous Assessment",
    description: "Regular tests and feedback that build toward strong examination performance.",
    Icon: ClipboardCheck,
    color: "bg-accent/10 text-accent",
  },
];

const SUBJECTS_BY_DEPT = [
  {
    name: "Sciences",
    description: "Fostering empirical research and technological skills.",
    subjects: ["Mathematics", "Biology", "Chemistry", "Physics", "Computer Science", "Combined Science"],
  },
  {
    name: "Commercials",
    description: "Developing business acumen and financial literacy.",
    subjects: ["Accounting", "Business Studies", "Economics", "Commerce"],
  },
  {
    name: "Arts & Humanities",
    description: "Exploring human culture, expression, and communication.",
    subjects: ["English Language & Literature", "History", "Geography", "Shona", "Visual Arts", "Music"],
  },
];

const Academics = () => {
  const [expandedDept, setExpandedDept] = useState(null);

  const toggleDept = (name) => {
    setExpandedDept(expandedDept === name ? null : name);
  };

  return (
    <div>
      <Hero
        title="Academics"
        subtitle="A curriculum built to challenge, support, and inspire every student, from Form 1 through A'Level."
        backgroundImage={learningImage}
      />

      {/* Grade levels - Timeline style */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center font-heading text-3xl font-extrabold text-textPrimary sm:text-4xl">
          Levels of Study
        </h2>
        <div className="mt-4 h-1 w-20 bg-secondary mx-auto rounded-full mb-16" />

        <div className="relative border-l-2 border-border ml-4 sm:ml-12 space-y-12">
          {GRADE_LEVELS.map((level, idx) => (
            <div key={idx} className="relative pl-8 sm:pl-12 group">
              {/* Timeline marker */}
              <div className="absolute -left-[13px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-surface border-2 border-primary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                <GraduationCap className="h-3 w-3" />
              </div>
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <span className="inline-block rounded-xl bg-primary/10 px-3 py-1 font-body text-xs font-semibold text-primary">
                  {level.range}
                </span>
                <h3 className="mt-3 font-heading text-xl font-bold text-textPrimary">
                  {level.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-textSecondary">
                  {level.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Teaching approach */}
      <section className="bg-background px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl font-extrabold text-textPrimary sm:text-4xl">
              Our Teaching Approach
            </h2>
            <div className="mt-4 h-1 w-20 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {TEACHING_APPROACH.map((item) => (
              <div key={item.title} className="text-center group bg-surface rounded-2xl border border-border p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-xl mb-6 transition-all duration-300 ${item.color} group-hover:scale-110`}>
                  <item.Icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-textPrimary">
                  {item.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-textSecondary">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expandable Subjects Section */}
      <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-3xl font-extrabold text-textPrimary sm:text-4xl">
            Subjects Offered
          </h2>
          <div className="mt-4 h-1 w-20 bg-accent mx-auto rounded-full" />
          <p className="mt-6 font-body text-sm text-textSecondary">
            Explore our curriculum groupings for O'Level and A'Level studies. Click a department to view specific subjects.
          </p>
        </div>

        <div className="space-y-4">
          {SUBJECTS_BY_DEPT.map((dept) => {
            const isExpanded = expandedDept === dept.name;
            return (
              <div key={dept.name} className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden transition-all duration-300">
                <button
                  type="button"
                  onClick={() => toggleDept(dept.name)}
                  className="flex w-full items-center justify-between p-6 text-left focus:outline-none hover:bg-background/40 transition-colors"
                >
                  <div>
                    <h3 className="font-heading text-lg font-bold text-textPrimary">{dept.name}</h3>
                    <p className="mt-1 font-body text-xs text-textSecondary">{dept.description}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-textSecondary" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-textSecondary" />
                  )}
                </button>
                {isExpanded && (
                  <div className="border-t border-border bg-background/50 px-6 py-6 animate-fade-in">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {dept.subjects.map((subj) => (
                        <div key={subj} className="flex items-center gap-2 bg-surface border border-border/80 rounded-xl px-4 py-2.5 shadow-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                          <span className="font-body text-xs font-semibold text-textPrimary">{subj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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