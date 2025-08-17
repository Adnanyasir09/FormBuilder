import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, FilePlus } from "lucide-react";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-300 to-indigo-200 bg-clip-text text-transparent"
        >
          FormForge
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              location.pathname === "/"
                ? "bg-white text-indigo-700 shadow"
                : "text-indigo-100 hover:bg-white/10 hover:text-white"
            }`}
          >
            Home
          </Link>

          {/* CTA Button */}
          <Link
            to="/editor"
            className="ml-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-indigo-700 font-semibold text-sm shadow hover:bg-gray-100 transition"
          >
            <FilePlus size={18} />
            New Form
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-indigo-100 hover:bg-white/10"
          onClick={() => setNavOpen((o) => !o)}
          aria-label={navOpen ? "Close menu" : "Open menu"}
        >
          {navOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {navOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t shadow-md animate-slideDown">
          <nav className="flex flex-col space-y-3 px-4 py-4">
            <Link
              to="/"
              onClick={() => setNavOpen(false)}
              className={`px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-800 hover:bg-gray-100"
              }`}
            >
              Home
            </Link>

            <Link
              to="/editor"
              onClick={() => setNavOpen(false)}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow hover:opacity-90 transition"
            >
              <FilePlus size={18} />
              New Form
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
