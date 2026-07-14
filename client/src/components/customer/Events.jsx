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

  // States for search and filtering
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);

  // Synchronize local search state if URL parameter changes
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearch(urlSearch);
  }, [searchParams]);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAllEvents();
      console.log("Events:", data);
      
      // Only customers should see published events
      setEvents(data.filter((event) => event.status === "Published"));
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

  // Compute available unique locations based on search matching events
  const locations = useMemo(() => {
    const uniqueLocations = new Set(
      events
        .filter((event) => {
          const lowerSearch = search.toLowerCase();
          return (
            event.title?.toLowerCase().includes(lowerSearch) ||
            event.description?.toLowerCase().includes(lowerSearch)
          );
        })
        .map((event) => event.venue?.location)
        .filter(Boolean) // Remove null or undefined locations
    );

    return [...uniqueLocations];
  }, [events, search]);

  // Handle client-side filtering
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        !search ||
        event.title?.toLowerCase().includes(search.toLowerCase()) ||
        event.venue?.name?.toLowerCase().includes(search.toLowerCase());

      const matchesLocation =
        !location || event.venue?.location === location;

      const matchesDate =
        !dateFilter ||
        (event.eventDate && 
          new Date(event.eventDate).toISOString().slice(0, 10) === dateFilter);

      return matchesSearch && matchesLocation && matchesDate;
    });
  }, [events, search, location, dateFilter]);

  // Pagination bounds logic
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));

  const paginatedEvents = filteredEvents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, location, dateFilter]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-10 mb-10 shadow-xl">
        <h1 className="text-5xl font-bold">Discover Amazing Events</h1>
        <p className="mt-4 text-lg text-indigo-100 max-w-2xl">
          Book concerts, movies, workshops and live shows with an easy and secure seat booking experience.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Available Events</p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">{events.length}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Locations</p>
          <h2 className="text-4xl font-bold text-green-600 mt-2">{locations.length}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Showing Results</p>
          <h2 className="text-4xl font-bold text-orange-500 mt-2">{filteredEvents.length}</h2>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Location Filter */}
      <div className="mb-8">
        <CategoryFilter
          locations={locations}
          selected={location}
          onChange={setLocation}
        />
      </div>

      {/* Error and Event Content States */}
      {error ? (
        <ErrorState message={error} onRetry={fetchEvents} />
      ) : (
        <>
          <EventGrid events={paginatedEvents} isLoading={isLoading} />

          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <Button
                variant="secondary"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>

              <span className="text-gray-600">
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