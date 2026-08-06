import { useState } from "react";
import Hero from "../components/Hero";

const DEPARTMENTS = ["All", "Administration", "Sciences", "Mathematics", "Humanities", "Languages", "Arts", "Sports"];

const STAFF_MEMBERS = [
  { id: 1, name: "Dr. Ellen Marufu", role: "Principal", department: "Administration" },
  { id: 2, name: "Mr. Tapiwa Chikafu", role: "Vice Principal", department: "Administration" },
  { id: 3, name: "Mrs. Grace Moyo", role: "Head of Sciences", department: "Sciences" },
  { id: 4, name: "Mr. Kudakwashe Banda", role: "Mathematics Teacher", department: "Mathematics" },
  { id: 5, name: "Mrs. Nyasha Chirwa", role: "English Teacher", department: "Humanities" },
  { id: 6, name: "Mr. Simbarashe Gata", role: "History Teacher", department: "Humanities" },
  { id: 7, name: "Ms. Ropafadzo Sithole", role: "Art Teacher", department: "Arts" },
  { id: 8, name: "Mr. Farai Ndlovu", role: "Music Teacher", department: "Arts" },
  { id: 9, name: "Mr. Blessing Mutasa", role: "Sports Director", department: "Sports" },
];
const Staff = () => {
  const [activeDepartment, setActiveDepartment] = useState("All");

  const filteredStaff =
    activeDepartment === "All"
      ? STAFF_MEMBERS
      : STAFF_MEMBERS.filter((member) => member.department === activeDepartment);

  return (
    <div>
      <Hero
        title="Our Staff"
        subtitle="Meet the dedicated educators and administrators who guide our students."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Department filter */}
        <div className="flex flex-wrap justify-center gap-3">
          {DEPARTMENTS.map((department) => (
            <button
              key={department}
              type="button"
              onClick={() => setActiveDepartment(department)}
              className={`rounded-xl px-4 py-2 text-sm font-medium font-body transition-colors duration-200 ${
                activeDepartment === department
                  ? "bg-primary text-white"
                  : "bg-surface text-textSecondary border border-border hover:bg-background"
              }`}
            >
              {department}
            </button>
          ))}
        </div>

        {/* Staff grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStaff.map((member) => (
            <div
              key={member.id}
              className="overflow-hidden rounded-xl border border-border bg-surface text-center shadow-md transition-shadow duration-200 hover:shadow-lg"
            >
              {/* Placeholder photo block — replace with a real <img> once photos exist */}
              <div className="flex h-40 w-full items-center justify-center bg-primary/10 font-heading text-2xl font-semibold text-primary">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="p-5">
                <h3 className="font-heading text-base font-semibold text-textPrimary">
                  {member.name}
                </h3>
                <p className="mt-1 font-body text-sm text-textSecondary">{member.role}</p>
                <span className="mt-2 inline-block rounded-xl bg-secondary/10 px-3 py-1 font-body text-xs font-medium text-accent">
                  {member.department}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <p className="mt-10 text-center font-body text-sm text-textSecondary">
            No staff members in this department yet.
          </p>
        )}
      </section>
    </div>
  );
};

export default Staff;