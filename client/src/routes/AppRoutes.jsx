import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/customer/Home";
import Events from "../pages/customer/Events";
import EventDetails from "../pages/customer/EventDetails";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";
import PlaceholderPage from "../pages/PlaceholderPage";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import MyBookings from "../pages/customer/MyBookings";
import BookingDetails from "../pages/customer/BookingDetails";
import SeatSelection from "../pages/customer/SeatSelection";
import Checkout from "../pages/customer/Checkout";
import { ROLES } from "../utils/roles";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/:id/seats" element={<SeatSelection />} />
        <Route path="/events/:id/checkout"element={<Checkout />}/>
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/bookings/:id"element={<BookingDetails />}/>

        <Route element={<RoleProtectedRoute allowedRoles={[ROLES.ORGANIZER]} />}>
          <Route path="/organizer/dashboard" element={<PlaceholderPage title="Organizer Dashboard" />} />
          <Route path="/organizer/events" element={<PlaceholderPage title="My Events" />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin/dashboard" element={<PlaceholderPage title="Admin Dashboard" />} />
          <Route path="/admin/venues" element={<PlaceholderPage title="Venues" />} />
          <Route path="/admin/users" element={<PlaceholderPage title="Users" />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;