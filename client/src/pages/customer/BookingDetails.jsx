import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { cancelBooking } from "../../api/bookingApi";
import { getBookingById } from "../../api/bookingApi";
import Skeleton from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";

const BookingDetails = () => {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const data = await getBookingById(id);
      setBooking(data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load booking."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        Booking not found.
      </div>
    );
  }
  const handleCancelBooking = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this booking?"
  );

  if (!confirmed) return;

  try {
    await cancelBooking(id);

    toast.success("Booking cancelled successfully");

    navigate("/bookings");
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Unable to cancel booking"
    );
  }
};


  return (
    <div className="max-w-5xl mx-auto p-8">

      <div className="bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-6">
          Booking Details
        </h1>

        <div className="space-y-4">

          <div>
            <span className="font-semibold">Booking ID:</span>

            <p>{booking._id}</p>
          </div>

          <div>
            <span className="font-semibold">Event</span>

            <p>{booking.event.title}</p>
          </div>

          <div>
            <span className="font-semibold">Date</span>

            <p>
              {new Date(
                booking.event.eventDate
              ).toLocaleDateString()}
            </p>
          </div>

          <div>
            <span className="font-semibold">Time</span>

            <p>{booking.event.startTime}</p>
          </div>

          <div>
            <span className="font-semibold">Status</span>

            <p>{booking.status}</p>
          </div>

          <div>
            <span className="font-semibold">Seats</span>

            <div className="flex gap-2 flex-wrap mt-2">
              {booking.seats.map((seat, index) => (
                <span
                  key={index}
                  className="px-3 py-2 rounded bg-blue-100 text-blue-700"
                >
                  Row {seat.row} Seat {seat.column}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="font-semibold">
              Total Paid
            </span>

            <p>₹{booking.totalAmount}</p>
          </div>
          <div className="mt-8">
  <Button
    variant="danger"
    onClick={handleCancelBooking}
  >
    Cancel Booking
  </Button>
</div>

        </div>

      </div>

    </div>
  );
};


export default BookingDetails;