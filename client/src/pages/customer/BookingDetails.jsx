import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { cancelBooking, getBookingById } from "../../api/bookingApi";
import Skeleton from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";
import {
  Calendar,
  Ticket,
  CreditCard,
  Hash,
} from "lucide-react";

const BookingDetails = () => {
  const { id } = useParams();
const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      setLoading(true);

      const data = await getBookingById(id);
      console.log(data);
      setBooking(data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load booking."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);

      await cancelBooking(id);

      toast.success("Booking cancelled successfully");

      await fetchBooking();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to cancel booking"
      );
    } finally {
      setCancelling(false);
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

  return (
    <div className="max-w-5xl mx-auto p-8">

      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">
          Booking Details
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="space-y-6">

            <div className="flex items-center gap-3">
              <Hash className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">
                  Booking ID
                </p>
                <p className="font-semibold break-all">
                  {booking._id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Ticket className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">
                  Event
                </p>
                <p className="font-semibold">
                  {booking.event.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">
                  Date
                </p>
                <p className="font-semibold">
                  {new Date(
                    booking.event.eventDate
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">
                  Time
                </p>
                <p className="font-semibold">
                  {booking.event.startTime}
                </p>
              </div>
            </div>

          </div>

          <div className="space-y-6">

            <div className="flex items-center gap-3">
              <CreditCard className="text-green-600" />
              <div>
                <p className="text-sm text-gray-500">
                  Amount Paid
                </p>

                <p className="text-2xl font-bold">
                  ₹{booking.totalAmount}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-3">
                Seats
              </p>

              <div className="flex flex-wrap gap-2">
                {booking.seats.map((seat, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
                  >
                    Row {seat.row} Seat {seat.column}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Booking Status
              </p>

              <span
                className={`inline-block mt-2 px-4 py-2 rounded-full font-semibold ${
                  booking.status === "Confirmed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {booking.status}
              </span>
            </div>

          </div>

        </div>

        <div className="mt-10 flex flex-col md:flex-row gap-4">

  {booking.status !== "Cancelled" && (
    <>
      <Button
        className="flex-1"
        onClick={() => navigate(`/ticket/${booking._id}`)}
      >
        Download Ticket
      </Button>

      <Button
        variant="danger"
        className="flex-1"
        onClick={handleCancelBooking}
        disabled={cancelling}
      >
        {cancelling ? "Cancelling..." : "Cancel Booking"}
      </Button>
    </>
  )}

  {booking.status === "Cancelled" && (
    <Button
      disabled
      className="w-full"
    >
      Booking Cancelled
    </Button>
  )}

</div>

      </div>

    </div>
  );
};

export default BookingDetails;