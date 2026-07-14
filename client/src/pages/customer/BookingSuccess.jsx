import { CheckCircle, Ticket, Download, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const booking = state?.booking;

  if (!booking) {
    navigate("/events");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-4xl">

        <div className="bg-white rounded-[32px] shadow-xl border border-gray-200 overflow-hidden">

          {/* Top Section */}

          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-12 px-8">

            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mx-auto shadow-lg">

              <CheckCircle
                className="text-green-600"
                size={56}
              />

            </div>

            <h1 className="text-4xl font-black mt-6">
              Booking Confirmed!
            </h1>

            <p className="mt-4 text-green-100 text-lg">
              Your tickets have been successfully reserved.
            </p>

          </div>

          {/* Body */}

          <div className="p-10">

            <div className="grid md:grid-cols-2 gap-8">

              {/* Booking Reference */}

              <div className="bg-gray-50 rounded-2xl border p-8">

                <p className="uppercase tracking-[3px] text-gray-500 text-sm">
                  Booking Reference
                </p>

                <h2 className="mt-4 text-2xl font-black text-indigo-700 break-all">
                  TB-{booking._id.slice(-8).toUpperCase()}
                </h2>

                <div className="mt-8">

                  <p className="text-sm text-gray-500">
                    Booking ID
                  </p>

                  <p className="mt-2 break-all font-medium">
                    {booking._id}
                  </p>

                </div>

              </div>

              {/* Next Steps */}

              <div className="bg-gray-50 rounded-2xl border p-8">

                <h2 className="text-xl font-bold mb-6">
                  What's Next?
                </h2>

                <div className="space-y-6">

                  <div className="flex gap-4">

                    <Ticket className="text-indigo-600 mt-1" />

                    <div>

                      <h3 className="font-semibold">
                        Digital Ticket Ready
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        Your QR-enabled ticket has been generated.
                      </p>

                    </div>

                  </div>

                  <div className="flex gap-4">

                    <Download className="text-indigo-600 mt-1" />

                    <div>

                      <h3 className="font-semibold">
                        Download Anytime
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        Access your ticket whenever you need it.
                      </p>

                    </div>

                  </div>

                  <div className="flex gap-4">

                    <ArrowRight className="text-indigo-600 mt-1" />

                    <div>

                      <h3 className="font-semibold">
                        Scan at Entry
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        Present your QR code at the venue entrance.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* Footer Notice */}

            <div className="mt-10 bg-indigo-50 border border-indigo-100 rounded-2xl p-6">

              <p className="text-indigo-700 font-semibold">
                Thank you for choosing TicketBooking.
              </p>

              <p className="text-gray-600 mt-2">
                Please carry a valid Government ID along with your
                digital ticket for seamless entry into the event.
              </p>

            </div>

            {/* Buttons */}

            <div className="flex flex-wrap justify-center gap-5 mt-10">

              <Button
                onClick={() =>
                  navigate(`/bookings/${booking._id}`)
                }
                className="px-8 py-3"
              >
                View Ticket
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate("/events")}
                className="px-8 py-3"
              >
                Browse More Events
              </Button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default BookingSuccess;