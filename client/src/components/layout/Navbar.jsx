import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  Menu,
  User,
  CalendarDays,
  Ticket,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "text-indigo-600 font-semibold"
      : "text-gray-600 hover:text-indigo-600";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200">

      <div className="max-w-7xl mx-auto h-20 px-8 flex items-center justify-between">

        {/* LEFT */}

        <div className="flex items-center gap-8">

          <Link
to="/"
onClick={() => window.scrollTo(0, 0)}
>
            <div className="h-11 w-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <Ticket className="text-white" size={20} />
            </div>

            <div>
              <h1 className="font-black text-2xl tracking-tight">
                Ticket<span className="text-indigo-600">Hub</span>
              </h1>
            </div>
          </Link>

          {/* SEARCH */}

          <div className="hidden lg:flex items-center bg-gray-100 rounded-xl px-4 h-12 w-[420px]">

            <Search size={18} className="text-gray-500" />

            <input
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      navigate(`/events?search=${search}`);
    }
  }}
  placeholder="Search Movies, Concerts, Sports..."
  className="bg-transparent flex-1 px-3 outline-none text-sm"
/>
          </div>

        </div>

        {/* RIGHT */}

        {isAuthenticated ? (
          <div className="flex items-center gap-8">

            <Link
              to="/events"
              className={`${isActive("/events")} transition`}
            >
              Events
            </Link>

            <Link
              to="/bookings"
              className={`${isActive("/bookings")} transition`}
            >
              My Bookings
            </Link>

            {/* USER */}

            <div
onClick={() => navigate("/profile")}
className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
>

              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">

                <User className="text-white" size={18} />

              </div>

              <div className="hidden md:block">

                <p className="text-xs text-gray-500">
                  Welcome
                </p>

                <p className="font-semibold leading-4">
                  {user?.name}
                </p>

              </div>

            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 transition px-5 py-2.5 rounded-xl font-semibold"
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>
        ) : (
          <div className="flex items-center gap-4">

            <Link
              to="/login"
              className="font-medium text-gray-600 hover:text-indigo-600"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-2.5 rounded-xl font-semibold"
            >
              Register
            </Link>

          </div>
        )}

      </div>

      {/* SECOND NAVIGATION */}

      

    </header>
  );
};

export default Navbar;