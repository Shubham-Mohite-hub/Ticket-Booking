import { useNavigate } from "react-router-dom";
import { Search, TicketPercent } from "lucide-react";
import { useState } from "react";

const HeroBanner = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query ? `/events?search=${encodeURIComponent(query)}` : "/events");
  };

  return (
    <div className="relative bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full mb-6 border border-white/20">
          <TicketPercent className="w-4 h-4" />
          Book movies, concerts &amp; more — instantly
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
          Find Your Next
          <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            Unforgettable Experience
          </span>
        </h1>

        <p className="mt-5 text-lg text-indigo-100 max-w-xl mx-auto">
          Discover live events near you and book your seats in seconds.
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-10 max-w-xl mx-auto flex items-center bg-white rounded-full shadow-xl overflow-hidden p-1.5"
        >
          <Search className="w-5 h-5 text-gray-400 ml-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, concerts, events..."
            className="flex-1 px-3 py-2.5 text-gray-800 outline-none bg-transparent"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-medium px-6 py-2.5 rounded-full"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeroBanner;