import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../../api/bookingApi";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import Button from "../../components/ui/Button";

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

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

      navigate("/booking-success", {
        state: {
          booking,
        },
      });
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
      <div className="min-h-screen flex justify-center items-center bg-gray-50">

        <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-lg text-center">

          <h2 className="text-2xl font-bold">
            Checkout
          </h2>

          <p className="text-gray-500 mt-4">
            No booking information found.
          </p>

          <Button
            className="w-full mt-8 py-3"
            onClick={() => navigate("/events")}
          >
            Browse Events
          </Button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">

      <div className="max-w-7xl mx-auto">

        <div className="mb-10">

          <p className="uppercase tracking-[5px] text-indigo-600 text-sm font-semibold">
            CHECKOUT
          </p>

          <h1 className="text-4xl font-black text-gray-900 mt-2">
            Confirm Your Booking
          </h1>

          <p className="text-gray-500 mt-3">
            Review your booking before completing your purchase.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}

          <div className="lg:col-span-2 space-y-8">

            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">

              <h2 className="text-3xl font-bold">
                {event.title}
              </h2>

              <div className="grid md:grid-cols-3 gap-6 mt-8">

                <div className="flex gap-3">

                  <Calendar className="text-indigo-600" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Date
                    </p>

                    <p className="font-semibold">
                      {new Date(
                        event.eventDate
                      ).toLocaleDateString()}
                    </p>

                  </div>

                </div>

                <div className="flex gap-3">

                  <Clock className="text-indigo-600" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Time
                    </p>

                    <p className="font-semibold">
                      {event.startTime}
                    </p>

                  </div>

                </div>

                <div className="flex gap-3">

                  <MapPin className="text-indigo-600" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Venue
                    </p>

                    <p className="font-semibold">
                      {event.venue?.name}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">

              <h2 className="text-2xl font-bold mb-6">
                Selected Seats
              </h2>

              <div className="flex flex-wrap gap-3">

                {seats.map((seat) => (

                  <div
                    key={seat._id}
                    className="px-5 py-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold"
                  >
                    Row {seat.row} • Seat {seat.column}
                  </div>

                ))}

              </div>

            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">

              <div className="flex items-center gap-3 mb-5">

                <ShieldCheck className="text-green-600" />

                <h2 className="text-xl font-bold">
                  Booking Protection
                </h2>

              </div>

              <p className="text-gray-600 leading-7">
                Your selected seats are temporarily reserved.
                Once payment is confirmed your booking will be
                generated instantly and your ticket will be
                available for download with a unique QR code.
              </p>

            </div>

          </div>
          {/* RIGHT SIDE */}

          <div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 sticky top-8">

              <div className="flex items-center gap-3 mb-8">

                <CreditCard className="text-indigo-600" />

                <h2 className="text-2xl font-bold">
                  Payment Summary
                </h2>

              </div>

              <div className="space-y-5">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Tickets
                  </span>

                  <span className="font-semibold">
                    {seats.length}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Price
                  </span>

                  <span className="font-semibold">
                    ₹{total}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Convenience Fee
                  </span>

                  <span className="font-semibold text-green-600">
                    FREE
                  </span>

                </div>

                <hr />

                <div className="flex justify-between items-center">

                  <span className="text-xl font-bold">
                    Total
                  </span>

                  <span className="text-3xl font-black text-indigo-600">
                    ₹{total}
                  </span>

                </div>

              </div>

              <Button
                className="w-full mt-8 py-4 text-lg"
                onClick={handleConfirmBooking}
                disabled={isBooking}
              >
                {isBooking
                  ? "Confirming Booking..."
                  : "Confirm Booking"}
              </Button>

              <div className="mt-8 border-t pt-6">

                <div className="flex items-center gap-3">

                  <ShieldCheck
                    className="text-green-600"
                    size={20}
                  />

                  <div>

                    <p className="font-semibold">
                      Secure Booking
                    </p>

                    <p className="text-sm text-gray-500">
                      Your seats are protected using our
                      secure reservation system.
                    </p>

                  </div>

                </div>

              </div>

              <div className="mt-8 bg-indigo-50 rounded-2xl p-5">

                <h3 className="font-semibold text-indigo-700">
                  What's Next?
                </h3>

                <ul className="mt-3 space-y-2 text-sm text-gray-600">

                  <li>
                    ✓ Booking confirmation will be generated
                    instantly.
                  </li>

                  <li>
                    ✓ Download your digital ticket.
                  </li>

                  <li>
                    ✓ Present the QR code at the venue entrance.
                  </li>

                </ul>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;