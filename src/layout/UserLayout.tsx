// src/layout/UserLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar.tsx";

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="p-6 ">
        <Outlet />
      </main>
    </div>
  );
}
