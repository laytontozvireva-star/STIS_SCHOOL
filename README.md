# 🏫 Sir Tshobs International School (STIS)

> A full-stack school management web application built with React and Supabase.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

## 🚀 Quick Start

### 1 — Clone & install dependencies

```bash
git clone <your-repo-url>
cd stis_school
npm install
```

### 2 — Configure environment variables

Create a `.env` file in the project root (or edit the existing one):

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Get these from your [Supabase project settings → API](https://app.supabase.com).

### 3 — Set up the database

Open your [Supabase SQL Editor](https://app.supabase.com) and run the full contents of:

```
supabase/schema.sql
```

This creates all tables, RLS policies, and storage buckets in one go.

### 4 — Start the development server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Run the app in development mode with hot reload |
| `npm run build` | Build a production-optimised bundle to the `build/` folder |
| `npm test` | Launch the test runner in interactive watch mode |

---

## 🗂️ Project Structure

```
src/
├── assets/          # Images and static files
├── components/      # Reusable UI components (Hero, Card, Button, Sidebar…)
├── context/         # AuthContext (Supabase session)
├── layouts/         # Page shells — MainLayout, dashboard layouts per role
├── pages/           # Public pages + role dashboards
│   ├── dashboard/
│   │   ├── admin/   # ManageStudents, ManageNews, ManageEvents, ManageVacationPosts…
│   │   ├── teacher/ # Overview, Grades, Attendance, MyClasses
│   │   ├── student/ # Overview, Grades, Schedule, Attendance
│   │   └── parent/  # Overview, Grades
│   └── *.js         # Home, About, Academics, Events, News, Contact…
├── routes/          # AppRoutes.js — central route definitions
├── services/        # Supabase service modules (one per feature)
└── utils/           # constants.js — school name, contact info, nav links
supabase/
├── schema.sql       # Full database schema — run once in Supabase SQL Editor
└── functions/       # Edge functions (admin account provisioning)
```

---

## 🔑 User Roles

| Role | Access |
|---|---|
| **Public** | Home, About, Academics, Events, News, Contact, Gallery, Admissions |
| **Student** | Dashboard — Grades, Schedule, Attendance |
| **Teacher** | Dashboard — My Classes, Enter Grades, Attendance |
| **Parent** | Dashboard — Child's Grades & Attendance |
| **Admin** | Full dashboard — Students, Teachers, Admissions, Events, News, Vacation Posts, Gallery, Accounts |

> Admin and teacher accounts must be provisioned by an existing admin via **Create Accounts** in the admin portal. Students can self-register.

---

## ✏️ Updating Term Content (No Code Required)

Log in as **Admin** and use the dashboard to update:

| What changes each term | Admin page |
|---|---|
| School events (sports day, conferences…) | **Manage Events** |
| Vacation / holiday school programme | **Vacation Posts** → mark Active |
| News & announcements | **Manage News** |
| Gallery photos | **Manage Gallery** |

Events whose date has passed automatically move to "Past Events" — no manual archiving needed.

---

## 📍 School Location

**1063 Juru Locations, Opp. Juru Zinwa**  
Juru, Mashonaland East, Zimbabwe

📞 0717 155 557 &nbsp;|&nbsp; 💬 WhatsApp: 0717 155 557

[📌 Open in Google Maps](https://www.google.com/maps/dir/?api=1&destination=-17.6784574,31.4698984)

---

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router v6
- **Styling:** Tailwind CSS, custom design tokens
- **Backend / DB:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Icons:** Lucide React
- **Build tool:** Create React App

---

## 📄 License

This project is private and maintained by Sir Tshobs International School.
