import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../utils/constants";

const linksByRole = {
  [ROLES.CUSTOMER]: [
    { to: "/", label: "Dashboard" },
    { to: "/create-shipment", label: "Create Shipment" },
    { to: "/my-shipments", label: "My Shipments" },
    { to: "/track", label: "Track Shipment" },
  ],
  [ROLES.AGENT]: [
    { to: "/", label: "Dashboard" },
    { to: "/agent", label: "Assigned Shipments" },
    { to: "/track", label: "Track Shipment" },
  ],
  [ROLES.ADMIN]: [
    { to: "/", label: "Dashboard" },
    { to: "/admin", label: "Reports & Assignments" },
    { to: "/hubs", label: "Hub Management" },
    { to: "/track", label: "Track Shipment" },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const links = user ? linksByRole[user.role] || [] : [];

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="brand-mark">LT</span>
        <div>
          <strong>Shipment System</strong>
        </div>
      </div>

      <nav className="sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`}
            to={link.to}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
