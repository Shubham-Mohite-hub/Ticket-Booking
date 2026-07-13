import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllEvents } from "../../api/eventApi";
import SearchBar from "../../components/customer/SearchBar";
import CategoryFilter from "../../components/customer/CategoryFilter";
import EventGrid from "../../components/customer/EventGrid";
import ErrorState from "../../components/common/ErrorState";
import Button from "../../components/ui/Button";

const PAGE_SIZE = 8;

const Events = () => {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);

 const fetchEvents = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const data = await getAllEvents();

    console.log("Events from backend:", data);

    setEvents(data.filter((e) => e.status === "Published"));
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

  const locations = useMemo(() => {
    const set = new Set(events.map((e) => e.venue?.location).filter(Boolean));
    return Array.from(set);
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        !search ||
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.venue?.name.toLowerCase().includes(search.toLowerCase());

      const matchesLocation = !location || event.venue?.location === location;

      const matchesDate =
        !dateFilter || new Date(event.eventDate).toISOString().slice(0, 10) === dateFilter;

      return matchesSearch && matchesLocation && matchesDate;
    });
  }, [events, search, location, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const paginatedEvents = filteredEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, location, dateFilter]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Events</h1>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-8">
        <CategoryFilter locations={locations} selected={location} onChange={setLocation} />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={fetchEvents} />
      ) : (
        <>
          <EventGrid events={paginatedEvents} isLoading={isLoading} />

          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="secondary"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500 px-2">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Events;