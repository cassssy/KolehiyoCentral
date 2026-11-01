import { NavLink, Outlet } from "react-router-dom";
import { applicant } from "../data";

const links = [
  { to: "/", label: "Universities", end: true },
  { to: "/applications", label: "My applications", end: false },
  { to: "/profile", label: "Profile", end: false },
  { to: "/periods", label: "Dates", end: false },
];

export function Layout() {
  return (
    <div className="app">
      <header className="topbar">
        <NavLink to="/" className="brand" end>
          Kolehiyo Central
        </NavLink>
        <nav className="nav" aria-label="Main">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <NavLink to="/profile" className="who">
          {applicant.name}
        </NavLink>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
