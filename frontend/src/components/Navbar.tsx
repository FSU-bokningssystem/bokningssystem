import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import OrganizationSelector from "./OrganizationSelector";
import { useAuth } from "../context/AuthContext";

export const navLinks = [
  { id: "", title: "Hem" },
  { id: "users", title: "Användare" },
  { id: "houses", title: "Hus" },
  { id: "rooms", title: "Rum & Lokaler" },
];

export const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const { currentUser } = useAuth();

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

        {/* Höger: Organisationsväljare + Inloggad Användare (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <OrganizationSelector />

          {currentUser && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
              <User className="w-3.5 h-3.5 text-gray-500" />
              <span>
                {currentUser.firstName} {currentUser.lastName}
              </span>
            </div>
          )}
        </div>

        {/* Mobile Navigation Button */}
        <div className="md:hidden flex items-center gap-2">
          <OrganizationSelector />
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
          {currentUser && (
            <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg border border-gray-100">
              <User className="w-4 h-4 text-gray-400" />
              <span>Inloggad som: {currentUser.firstName} {currentUser.lastName}</span>
            </div>
          )}

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