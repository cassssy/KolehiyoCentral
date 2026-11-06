import { NavLink, Outlet } from "react-router-dom";
import logo from "../assets/logo.png";
import { applicant } from "../data";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/universities", label: "Universities", end: false },
  { to: "/applications", label: "My applications", end: false },
  { to: "/documents", label: "Documents", end: false },
  { to: "/scholarships", label: "Scholarships", end: false },
  { to: "/profile", label: "Profile", end: false },
  { to: "/periods", label: "Dates", end: false },
];

export function Layout() {
  return (
    <div className="app">
      <header className="topbar">
        <NavLink to="/" className="brand" end>
          <img className="brand-icon" src={logo} alt="" />
          <span>Kolehiyo Central</span>
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
        <NavLink to="/profile" className="who" aria-label={`Student profile: ${applicant.name}`}>
          <span className="who-avatar" aria-hidden="true">
            JS
          </span>
          <span className="who-meta">
            <strong className="who-name">{applicant.name}</strong>
            <span className="who-sub">{applicant.level}</span>
          </span>
        </NavLink>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
