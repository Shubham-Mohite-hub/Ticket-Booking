import { Calendar, MapPin } from "lucide-react";
import BookingStatusBadge from "./BookingStatusBadge";
import Button from "../../ui/Button";

const BookingCard = ({ booking, onView, onCancel }) => {
  return (
  <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">

    {/* Banner */}

    <div className="relative h-48">

      {booking.event?.bannerImage ? (

        <img
          src={booking.event.bannerImage}
          alt={booking.event.title}
          className="w-full h-full object-cover"
        />

      ) : (

        <div className="w-full h-full bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600"></div>

      )}

      <div className="absolute inset-0 bg-black/40"></div>

      <div className="absolute top-5 right-5">

        <BookingStatusBadge status={booking.status} />

      </div>

      <div className="absolute bottom-6 left-6 text-white">

        <h2 className="text-3xl font-black">

          {booking.event?.title}

        </h2>

        <p className="opacity-90 mt-2">

          Ticket No.

          <span className="font-bold ml-2">

            TB-{booking._id.slice(-8).toUpperCase()}

          </span>

        </p>

      </div>

    </div>

    {/* Content */}

    <div className="p-6">

      <div className="grid md:grid-cols-2 gap-6">

        <div>

          <div className="flex items-center gap-3 mb-4">

            <Calendar className="text-indigo-600" size={18} />

            <div>

              <p className="text-gray-400 text-sm">

                Event Date

              </p>

              <p className="font-semibold">

                {new Date(
                  booking.event?.eventDate
                ).toLocaleDateString()}

              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <MapPin className="text-indigo-600" size={18} />

            <div>

              <p className="text-gray-400 text-sm">

                Venue

              </p>

              <p className="font-semibold">

                {booking.event?.venue?.name}

              </p>

            </div>

          </div>

        </div>

        <div>

          <p className="text-gray-400 text-sm mb-2">

            Seats

          </p>

          <div className="flex flex-wrap gap-2">

            {booking.seats.map((seat, index) => (

              <span
                key={index}
                className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl font-semibold"
              >

                R{seat.row} • S{seat.column}

              </span>

            ))}

          </div>

        </div>

      </div>

      <div className="flex items-center justify-between mt-8">

        <div>

          <p className="text-gray-400 text-sm">

            Amount Paid

          </p>

          <h3 className="text-3xl font-black text-indigo-700">

            ₹{booking.totalAmount}

          </h3>

        </div>

        <div className="flex flex-wrap gap-3">

          <Button onClick={() => onView(booking)}>

            View Details

          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              window.open(`/ticket/${booking._id}`, "_blank")
            }
          >

            Download Ticket

          </Button>

          {booking.status === "Confirmed" && (

            <Button
              variant="danger"
              onClick={() => onCancel(booking)}
            >

              Cancel

            </Button>

          )}

        </div>

      </div>

    </div>

  </div>
);
};

export default BookingCard;
