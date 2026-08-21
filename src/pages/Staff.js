import { useState } from "react";
import { Mail, Users } from "lucide-react";
import Hero from "../components/Hero";
import celebrationImage from "../assets/images/gallery/stis-anniversary-celebration.webp";

const DEPARTMENTS = ["All", "Administration", "Sciences", "Mathematics", "Humanities", "Languages", "Arts", "Sports"];

const DEPT_COLORS = {
  Administration: "bg-blue-100 text-blue-800 border-blue-200",
  Sciences: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Mathematics: "bg-indigo-100 text-indigo-800 border-indigo-200",
  Humanities: "bg-amber-100 text-amber-800 border-amber-200",
  Languages: "bg-purple-100 text-purple-800 border-purple-200",
  Arts: "bg-pink-100 text-pink-800 border-pink-200",
  Sports: "bg-rose-100 text-rose-800 border-rose-200",
};

const STAFF_MEMBERS = [
  { id: 1, name: "Dr. Ellen Marufu", role: "Principal", department: "Administration", email: "e.marufu@stis.ac.zw", bio: "Leading STIS with 15+ years of education leadership experience." },
  { id: 2, name: "Mr. Tapiwa Chikafu", role: "Vice Principal", department: "Administration", email: "t.chikafu@stis.ac.zw", bio: "Fostering discipline, excellence, and curriculum management." },
  { id: 3, name: "Mrs. Grace Moyo", role: "Head of Sciences", department: "Sciences", email: "g.moyo@stis.ac.zw", bio: "Passion for Chemistry and encouraging girls in STEM." },
  { id: 4, name: "Mr. Kudakwashe Banda", role: "Mathematics Teacher", department: "Mathematics", email: "k.banda@stis.ac.zw", bio: "Specializes in pure mathematics and statistics." },
  { id: 5, name: "Mrs. Nyasha Chirwa", role: "English Teacher", department: "Humanities", email: "n.chirwa@stis.ac.zw", bio: "Teaches English literature and creative writing." },
  { id: 6, name: "Mr. Simbarashe Gata", role: "History Teacher", department: "Humanities", email: "s.gata@stis.ac.zw", bio: "Exploring history through interactive discussions." },
  { id: 7, name: "Ms. Ropafadzo Sithole", role: "Art Teacher", department: "Arts", email: "r.sithole@stis.ac.zw", bio: "Nurturing fine arts, visual design, and canvas work." },
  { id: 8, name: "Mr. Farai Ndlovu", role: "Music Teacher", department: "Arts", email: "f.ndlovu@stis.ac.zw", bio: "Choral director and classical piano instructor." },
  { id: 9, name: "Mr. Blessing Mutasa", role: "Sports Director", department: "Sports", email: "b.mutasa@stis.ac.zw", bio: "Coaching soccer, athletics, and physical education." },
];

const getDeptColor = (dept) => DEPT_COLORS[dept] || "bg-gray-100 text-gray-800 border-gray-200";

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
        backgroundImage={celebrationImage}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Department filter */}
        <div className="flex flex-wrap justify-center gap-3">
          {DEPARTMENTS.map((department) => (
            <button
              key={department}
              type="button"
              onClick={() => setActiveDepartment(department)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold font-body transition-colors duration-200 cursor-pointer ${
                activeDepartment === department
                  ? "bg-primary text-white shadow-md"
                  : "bg-surface text-textSecondary border border-border hover:bg-background hover:text-textPrimary"
              }`}
            >
              {department}
            </button>
          ))}
        </div>

        {/* Staff grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStaff.map((member) => (
            <div
              key={member.id}
              className="group overflow-hidden rounded-2xl border border-border bg-surface text-center shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5"
            >
              {/* Initials Placeholder with Gradient and Hover Reveal */}
              <div className="relative h-44 w-full flex items-center justify-center bg-gradient-to-br from-primary to-primaryDark text-white overflow-hidden select-none">
                <span className="font-heading text-3xl font-extrabold tracking-wider transition-transform duration-300 group-hover:scale-75 group-hover:opacity-0">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                
                {/* Hover overlay showing bio/email */}
                <div className="absolute inset-0 bg-primaryDark/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-white">
                  <p className="font-body text-xs leading-relaxed text-blue-100 line-clamp-3">
                    {member.bio}
                  </p>
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-4 flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primaryDark hover:bg-white transition-colors duration-200 cursor-pointer"
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="h-4.5 w-4.5" />
                  </a>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-heading text-base font-bold text-textPrimary group-hover:text-primary transition-colors duration-200">
                  {member.name}
                </h3>
                <p className="mt-1 font-body text-xs font-semibold text-textSecondary uppercase tracking-wider">{member.role}</p>
                <div className="mt-4">
                  <span className={`inline-block rounded-lg border px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider shadow-sm ${getDeptColor(member.department)}`}>
                    {member.department}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <div className="mt-16 rounded-2xl border border-border bg-surface p-12 text-center shadow-sm max-w-md mx-auto">
            <Users className="mx-auto h-12 w-12 text-textSecondary/40 mb-4" />
            <p className="font-body text-sm font-semibold text-textSecondary">
              No staff members in this department yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Staff;