import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

export const navLinks = [
  { id: "", title: "Hem" },
  { id: "users", title: "Användare" },
  { id: "houses", title: "Hus" },
  { id: "rooms", title: "Rum & Lokaler" },
];

export const Navbar = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <div className="bg-[#0058a3] text-[#ffdb00] font-black px-3 py-1 rounded text-xl tracking-wider">
            LOGOTYPE
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((nav) => {
            const path = nav.id === "" ? "/" : `/${nav.id}`;
            return (
              <NavLink
                key={nav.id || "home"}
                to={path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                    isActive
                      ? "bg-[#0058a3] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {nav.title}
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile Navigation Button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setToggle((prev) => !prev)}
            className="p-2 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {toggle ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Dropdown för mobil */}
      {toggle && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((nav) => {
            const path = nav.id === "" ? "/" : `/${nav.id}`;
            return (
              <NavLink
                key={nav.id || "home"}
                to={path}
                onClick={() => setToggle(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "bg-[#0058a3] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {nav.title}
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
};