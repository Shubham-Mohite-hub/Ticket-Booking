import { useNavigate } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import { formatShortDate, formatCurrency } from "../../utils/formatters";

const GRADIENTS = [
  "from-indigo-500 to-purple-600",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-cyan-600",
];

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const gradient =
    GRADIENTS[
      event._id.charCodeAt(event._id.length - 1) % GRADIENTS.length
    ];

  return (
    <div
      onClick={() => navigate(`/events/${event._id}`)}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
    >
      {/* Banner */}
      <div className="relative h-48 overflow-hidden">

        {event.bannerImage ? (
          <img
            src={event.bannerImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <span className="text-5xl font-bold text-white opacity-80">
              {event.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Status */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${
              event.status === "Published"
                ? "bg-green-500 text-white"
                : event.status === "Draft"
                ? "bg-yellow-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {event.status}
          </span>
        </div>

        {/* Date */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold">
          {formatShortDate(event.eventDate)}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">

        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition">
          {event.title}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={16} />
          <span className="line-clamp-1">
            {event.venue?.name}, {event.venue?.location}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} />
          <span>
            {formatShortDate(event.eventDate)} • {event.startTime}
          </span>
        </div>

        <div className="border-t mt-5 pt-4">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Starting From
              </p>

              <p className="text-2xl font-bold text-indigo-600">
                {formatCurrency(event.basePrice)}
              </p>
            </div>

          </div>

          <button
            className="mt-5 w-full rounded-xl bg-indigo-600 text-white py-3 font-semibold hover:bg-indigo-700 transition-all"
          >
            View Details →
          </button>

        </div>

      </div>

    </div>
  );
};

export default EventCard;