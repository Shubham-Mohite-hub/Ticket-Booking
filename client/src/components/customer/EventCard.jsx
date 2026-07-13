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
  const gradient = GRADIENTS[event._id.charCodeAt(event._id.length - 1) % GRADIENTS.length];

  return (
    <div
      onClick={() => navigate(`/events/${event._id}`)}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative h-44 overflow-hidden">
        {event.bannerImage ? (
          <img
            src={event.bannerImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-white text-3xl font-bold opacity-80">{event.title.charAt(0)}</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-gray-700">
          {formatShortDate(event.eventDate)}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {event.title}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="line-clamp-1">
            {event.venue?.name}, {event.venue?.location}
          </span>
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500">
          <Calendar className="w-4 h-4 shrink-0" />
          <span>{formatShortDate(event.eventDate)} · {event.startTime}</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">Starting from</span>
          <span className="font-bold text-indigo-600">{formatCurrency(event.basePrice)}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;