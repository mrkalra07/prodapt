import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return null;
  }

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Logistics Tracker</p>
        <h1>{location.pathname === "/" ? "Dashboard" : "Operations Console"}</h1>
      </div>
      <div className="topbar__actions">
        <div className="user-chip">
          <span>{user.name}</span>
          <small>{user.role}</small>
        </div>
        <Link className="button button--ghost" to="/">
          Home
        </Link>
        <button className="button button--ghost" type="button" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}
