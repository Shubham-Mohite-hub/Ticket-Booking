import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-blue-600">
        TicketBooking
      </Link>

      {isAuthenticated && (
        <div className="flex items-center gap-6">
          <Link to="/events" className="hover:text-blue-600">
            Events
          </Link>

          <Link to="/bookings" className="hover:text-blue-600">
            My Bookings
          </Link>

          <span className="text-sm text-gray-600">
            {user?.name}
          </span>

          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}

      {!isAuthenticated && (
        <div className="flex gap-4">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;