import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Ticket,
} from "lucide-react";

const STATUS_STYLES = {
  Published: "bg-green-500 text-white",
  Draft: "bg-yellow-500 text-white",
  Cancelled: "bg-red-500 text-white",
};

const EventDetailsHeader = ({ event }) => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[500px] overflow-hidden">

      {/* Background */}

      {event.bannerImage ? (
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600" />
      )}

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />

      {/* Back Button */}

      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition"
      >
        <ArrowLeft size={22} />
      </button>

      {/* Event Information */}

      <div className="absolute bottom-0 left-0 right-0">

        <div className="max-w-7xl mx-auto px-8 pb-10">

          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${STATUS_STYLES[event.status]}`}
          >
            {event.status}
          </span>

          <h1 className="text-5xl md:text-6xl font-black text-white mt-5 leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-6 mt-8 text-white">

            <div className="flex items-center gap-2">

              <Calendar size={20} />

              <span>
                {new Date(event.eventDate).toLocaleDateString()}
              </span>

            </div>

            <div className="flex items-center gap-2">

              <Clock size={20} />

              <span>
                {event.startTime}
              </span>

            </div>

            <div className="flex items-center gap-2">

              <MapPin size={20} />

              <span>
                {event.venue?.name}
              </span>

            </div>

          </div>

          {/* Floating Card */}

          <div className="mt-8 inline-flex items-center gap-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-5">

            <div>

              <p className="text-white/70 text-sm">
                Starting Price
              </p>

              <p className="text-3xl font-black text-white">
                ₹{event.basePrice}
              </p>

            </div>

            <div className="w-px h-14 bg-white/20"></div>

            <div className="flex items-center gap-3">

              <Ticket className="text-yellow-400" />

              <div>

                <p className="text-white/70 text-sm">
                  Booking Status
                </p>

                <p className="font-bold text-white">
                  Available
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default EventDetailsHeader;