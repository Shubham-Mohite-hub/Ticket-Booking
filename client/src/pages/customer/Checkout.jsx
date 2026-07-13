import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../../api/bookingApi";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Data received from SeatSelection page
  const event = state?.event;
  const seats = state?.selectedSeats || [];
  const total = state?.total || 0;
  const seatHoldIds = state?.seatHoldIds || [];
  const [isBooking, setIsBooking] = useState(false);

   const handleConfirmBooking = async () => {
  try {
    setIsBooking(true);

    const booking = await createBooking(
      event._id,
      seatHoldIds
    );

    toast.success("Booking Confirmed!");

    console.log(booking);

    navigate("/events");
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Booking failed"
    );
  } finally {
    setIsBooking(false);
  }
};

  if (!event || seats.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-6">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>

        <div className="bg-white rounded-xl shadow p-6">
          <p>No booking information found.</p>

          <Button
    className="w-full py-3"
    onClick={handleConfirmBooking}
    disabled={isBooking}
>
    {isBooking ? "Booking..." : "Confirm Booking"}
</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">

      <h1 className="text-3xl font-bold mb-8">
        Booking Summary
      </h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-6">

        <div>
          <h2 className="text-xl font-semibold">{event.title}</h2>

          <p className="text-gray-500">
            {event.venue?.name}
          </p>
        </div>

        <hr />

        <div>
          <h3 className="font-semibold mb-3">
            Selected Seats
          </h3>

          <div className="flex flex-wrap gap-2">
            {seats.map((seat) => (
              <span
                key={seat._id}
                className="px-3 py-2 rounded-lg bg-blue-100 text-blue-700"
              >
                Row {seat.row} - Seat {seat.number}
              </span>
            ))}
          </div>
        </div>

        <hr />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

       

        <Button
    className="w-full py-3"
    onClick={handleConfirmBooking}
>
    Confirm Booking
</Button>

      </div>

    </div>
  );
};

export default Checkout;