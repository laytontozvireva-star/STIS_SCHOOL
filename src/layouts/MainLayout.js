import { Outlet } from "react-router-dom";

// Navbar and Footer will be added here in a later task.
// Keeping this layout minimal for now so routing can be verified independently.
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;