import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { getAllEvents } from "../../api/eventApi";
import HeroBanner from "../../components/customer/HeroBanner";
import EventGrid from "../../components/customer/EventGrid";
import ErrorState from "../../components/common/ErrorState";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAllEvents();
      const published = data.filter((e) => e.status === "Published");
      setEvents(published.slice(0, 8));
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load events";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <HeroBanner />

      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          <Link
            to="/events"
            className="flex items-center gap-1 text-indigo-600 font-medium hover:gap-2 transition-all"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={fetchEvents} />
        ) : (
          <EventGrid events={events} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default Home;