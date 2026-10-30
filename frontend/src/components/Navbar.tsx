import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

export const navLinks = [
  { id: "", title: "Home" },
  { id: "users", title: "Användare" },
  { id: "organizations", title: "Organisationer" },
  { id: "houses", title: "Hus" },
  { id: "rooms", title: "Rooms" },
];

export const Navbar = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <nav className="w-full flex py-6 justify-between items-center relative z-50">
      {/* Logo */}
      <h1 className="text-3xl text-white font-bold">Logo</h1>

      {/* Desktop Navigation */}
      <ul className="list-none sm:flex hidden justify-end items-center flex-1 gap-10">
        {navLinks.map((nav) => {
          const path = nav.id === "" || nav.id === "home" ? "/" : `/${nav.id}`;
          return (
            <li key={nav.id || "home"}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `font-poppins cursor-pointer text-base transition-colors ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-dimWhite hover:text-white"
                  }`
                }
              >
                {nav.title}
              </NavLink>
            </li>
          );
        })}
      </ul>

			{/* Mobile Navigation */}
			<div className="sm:hidden flex flex-1 justify-end items-center">
				{/* Meny-knapp med Lucide-ikon */}
				<button
					type="button"
					onClick={() => setToggle((prev) => !prev)}
					className="text-white p-2 focus:outline-none cursor-pointer"
					aria-label="Toggle Menu">
					{toggle ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
				</button>

        {/* Dropdown / Sidebar för mobil */}
        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-slate-900 border border-slate-800 absolute top-16 right-0 mx-4 my-2 min-w-[180px] rounded-xl shadow-xl z-50`}
        >
          <ul className="list-none flex flex-col justify-end items-start flex-1 gap-4 w-full">
            {navLinks.map((nav) => {
              const path =
                nav.id === "" || nav.id === "home" ? "/" : `/${nav.id}`;
              return (
                <li key={nav.id || "home"} className="w-full">
                  <NavLink
                    to={path}
                    onClick={() => setToggle(false)}
                    className={({ isActive }) =>
                      `font-poppins text-base block w-full ${
                        isActive
                          ? "text-white font-semibold"
                          : "text-dimWhite hover:text-white"
                      }`
                    }
                  >
                    {nav.title}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};
