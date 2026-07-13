import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/roles";

const ORGANIZER_LINKS = [
  { to: "/organizer/dashboard", label: "Dashboard" },
  { to: "/organizer/events", label: "My Events" },
];

const ADMIN_LINKS = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/venues", label: "Venues" },
  { to: "/admin/users", label: "Users" },
];

const Sidebar = () => {
  const { user } = useAuth();

  if (!user || (user.role !== ROLES.ORGANIZER && user.role !== ROLES.ADMIN)) {
    return null;
  }

  const links = user.role === ROLES.ADMIN ? ADMIN_LINKS : ORGANIZER_LINKS;

  return (
    <aside className="w-56 bg-gray-900 text-gray-100 min-h-screen p-4">
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800"}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;