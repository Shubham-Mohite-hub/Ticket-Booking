import { Calendar, MapPin } from "lucide-react";
import BookingStatusBadge from "./BookingStatusBadge";
import Button from "../../ui/Button";

const BookingCard = ({ booking, onView }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">{booking.event?.title}</h2>

          <div className="mt-2 text-gray-500 space-y-1">
            <p className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(booking.event?.eventDate).toLocaleDateString()}
            </p>

            <p>{booking.event?.startTime}</p>
          </div>
        </div>

        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="mt-5">
        <p className="font-semibold">Seats</p>

        <div className="flex flex-wrap gap-2 mt-2">
          {booking.seats.map((seat, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded"
            >
              Row {seat.row} Seat {seat.column}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <h3 className="text-lg font-bold">₹{booking.totalAmount}</h3>

        <div className="flex gap-3">
          <Button onClick={() => onView(booking)}>View Details</Button>

          {booking.status === "confirmed" && (
            <Button variant="danger" onClick={() => onCancel(booking)}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
