import { Target, Eye, Calendar, Award, BookOpen } from "lucide-react";
import Hero from "../components/Hero";
import campusImage from "../assets/images/gallery/stis-12.webp";
import campusGroupImage from "../assets/images/gallery/stis-15.webp";

import Button from "../components/Button";

const CORE_VALUES = [
  {
    id: "01",
    title: "Integrity",
    description: "We act with honesty and hold ourselves accountable in everything we do.",
    borderClass: "border-l-primary",
  },
  {
    id: "02",
    title: "Excellence",
    description: "We set high standards and support every student in reaching them.",
    borderClass: "border-l-secondary",
  },
  {
    id: "03",
    title: "Respect",
    description: "We value every voice and treat one another with dignity.",
    borderClass: "border-l-accent",
  },
  {
    id: "04",
    title: "Community",
    description: "We grow stronger together, as students, families, and educators.",
    borderClass: "border-l-emerald-600",
  },
];

const MILESTONES = [
  {
    year: "2024",
    title: "Founding & Vision",
    description: "STIS founded with Cambridge curriculum alignment, enrolling our first Forms 1 & 5 students.",
    Icon: BookOpen,
  },
  {
    year: "2025",
    title: "Infrastructure Growth",
    description: "Inauguration of modern science labs and state-of-the-art computer room to enrich research.",
    Icon: Award,
  },
  {
    year: "2026",
    title: "First Graduation Class",
    description: "Pioneer Form 6 students sat for international examinations with exceptional results.",
    Icon: Calendar,
  },
];

const About = () => {
  return (
    <div>
      <Hero
        title="About Our School"
        subtitle="Learn about our history, mission, and the values that guide us."
        backgroundImage={campusImage}
      />

      {/* Mission & Vision */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* Mission Card */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-lg transition-transform duration-300 hover:-translate-y-1 border-t-4 border-t-primary">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-textPrimary">
              Our Mission
            </h2>
            <p className="mt-4 font-body text-sm leading-relaxed text-textSecondary">
              To provide a nurturing, challenging, and inclusive learning environment
              that equips every student with the knowledge, skills, and character
              needed to thrive in a changing world.
            </p>
          </div>

          {/* Vision Card */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-lg transition-transform duration-300 hover:-translate-y-1 border-t-4 border-t-secondary">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/15 text-secondary mb-6">
              <Eye className="h-6 w-6" />
            </div>
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

      {/* Mid-section Campus Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-96 overflow-hidden rounded-3xl shadow-xl">
          <img
            src={campusGroupImage}
            alt="Students collaborating on campus"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primaryDark/60 via-transparent to-transparent flex items-end p-8">
            <p className="text-white font-heading text-xl md:text-2xl font-bold">
              Collaborative spaces that inspire growth and creativity.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-background px-4 py-24 sm:px-6 lg:px-8 mt-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl font-extrabold text-textPrimary sm:text-4xl">
              Our Core Values
            </h2>
            <div className="mt-4 h-1 w-20 bg-secondary mx-auto rounded-full" />
            <p className="mt-6 font-body text-base text-textSecondary">
              The principles that govern our interactions, academics, and school culture every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map((value) => (
              <div
                key={value.title}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg border-l-4 ${value.borderClass}`}
              >
                <span className="absolute top-4 right-4 text-3xl font-heading font-extrabold text-gray-200 group-hover:text-secondary/20 transition-colors">
                  {value.id}
                </span>
                <h3 className="font-heading text-lg font-bold text-textPrimary group-hover:text-primary transition-colors">
                  {value.title}
                </h3>
                <p className="mt-4 font-body text-sm leading-relaxed text-textSecondary">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story / Timeline Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-3xl font-extrabold text-textPrimary sm:text-4xl">
            Our Journey & Story
          </h2>
          <div className="mt-4 h-1 w-20 bg-accent mx-auto rounded-full" />
        </div>

        <div className="relative border-l-2 border-border/80 ml-4 md:ml-32 max-w-3xl md:mx-auto space-y-12">
          {MILESTONES.map((milestone, idx) => (
            <div key={idx} className="relative pl-8 md:pl-12 group">
              {/* Timeline marker */}
              <div className="absolute -left-[17px] top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-surface border-2 border-primary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                <milestone.Icon className="h-4 w-4" />
              </div>
              <span className="font-heading text-sm font-extrabold text-secondary tracking-widest uppercase">
                {milestone.year}
              </span>
              <h3 className="mt-2 font-heading text-lg font-bold text-textPrimary group-hover:text-primary transition-colors">
                {milestone.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-textSecondary">
                {milestone.description}
              </p>
            </div>
          ))}
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