import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-6">

        {/* Main Navbar */}
        <div className="flex items-center justify-between py-4">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="text-2xl font-bold tracking-tight text-blue-700"
          >
            Apply<span className="text-gray-900">Now</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              to="/"
              className="font-medium text-gray-600 transition hover:text-blue-700"
            >
              Home
            </Link>

            <Link
              to="/apply"
              className="font-medium text-gray-600 transition hover:text-blue-700"
            >
              Apply Now
            </Link>

            <Link
              to="/dashboard"
              className="font-medium text-gray-600 transition hover:text-blue-700"
            >
              Dashboard
            </Link>

            <Link
              to="/admin"
              className="font-medium text-gray-600 transition hover:text-blue-700"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="rounded-lg p-2 text-2xl text-gray-700 transition hover:bg-gray-100 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden">
            <div className="flex flex-col gap-2">

              <Link
                to="/"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                Home
              </Link>

              <Link
                to="/apply"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                Apply Now
              </Link>

              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                Dashboard
              </Link>

              <Link
                to="/admin"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                Admin
              </Link>

            </div>
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;