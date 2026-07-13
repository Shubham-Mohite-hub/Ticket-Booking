import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyBookings } from "../../api/bookingApi";
import BookingCard from "../../components/customer/bookings/BookingCard";
import Skeleton from "../../components/ui/Skeleton";
import { cancelBooking } from "../../api/bookingApi";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleView = (booking) => {
    navigate(`/bookings/${booking._id}`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-6 space-y-5">
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
      </div>
    );
  }

  const handleCancel = async (booking) => {
  if (!window.confirm("Cancel this booking?")) return;

  try {
    await cancelBooking(booking._id);

    toast.success("Booking cancelled");

    fetchBookings(); // refresh list
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Failed to cancel booking"
    );
  }
};

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">

      <h1 className="text-3xl font-bold mb-8">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-xl font-semibold">
            No bookings yet
          </h2>

          <p className="text-gray-500 mt-2">
            Book your first event.
          </p>
        </div>
      ) : (
        <div className="space-y-5">

          {bookings.map((booking) => (
            <BookingCard
    key={booking._id}
    booking={booking}
    onView={handleView}
    onCancel={handleCancel}
/>
          ))}

        </div>
      )}

    </div>
  );
};

export default MyBookings;