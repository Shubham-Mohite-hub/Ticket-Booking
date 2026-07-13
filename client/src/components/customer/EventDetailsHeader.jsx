import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const STATUS_STYLES = {
  Published: "bg-emerald-100 text-emerald-700",
  Draft: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
};

const EventDetailsHeader = ({ event }) => {
  const navigate = useNavigate();

  return (
    <div className="relative h-72 md:h-96 bg-gray-900 overflow-hidden">
      {event.bannerImage ? (
        <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover opacity-70" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 opacity-90" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-white p-2.5 rounded-full"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-5xl mx-auto">
        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${STATUS_STYLES[event.status]}`}>
          {event.status}
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">{event.title}</h1>
      </div>
    </div>
  );
};

export default EventDetailsHeader;