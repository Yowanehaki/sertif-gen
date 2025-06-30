import React from "react";
import { Link, useLocation } from "react-router";
import { Home, Upload } from "lucide-react";
import logo from "../assets/logo.png";

const navItems = [
  { title: "Dashboard", icon: <Home className="inline mr-2" size={18} /> },
  { title: "Logout", href: "/", icon: <Close className="inline mr-2" size={18} /> },
];

export default function NavigationMenu() {
  const location = useLocation();
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 shadow flex items-center justify-between">
      <div className="font-bold text-lg tracking-wide">SertifGen</div>
      <div className="space-x-4">
        <Link
          to="/"
          className={`hover:underline ${location.pathname === "/" ? "text-black" : "text-gray-200"}`}
        >
          Home
        </Link>
        <Link
          to="/form"
          className={`hover:underline ${location.pathname === "/form" ? "text-black" : "text-gray-200"}`}
        >
          Daftar Sertifikat
        </Link>
        <Link
          to="/login"
          className={`hover:underline ${location.pathname === "/login" ? "text-black" : "text-gray-200"}`}
        >
          Login
        </Link>
      </div>
    </nav>
  );
}

function MobileMenu({ location }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        className="p-2 rounded-md text-gray-700 hover:text-blue-700 hover:bg-gray-100 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open menu"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-4 top-16 w-48 bg-white border rounded-lg shadow-lg py-2 animate-fade-in-down">
          {navItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 rounded-md font-medium transition-colors text-sm
                ${location.pathname === item.href
                  ? "bg-blue-100 text-blue-700 shadow"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"}
              `}
              title={item.description}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}