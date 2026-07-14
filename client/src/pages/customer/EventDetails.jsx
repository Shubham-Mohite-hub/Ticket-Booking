import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getEventById } from "../../api/eventApi";
import { getSeatMapByEvent } from "../../api/seatApi";
import { aggregateSeatCategories } from "../../utils/formatters";
import EventDetailsHeader from "../../components/customer/EventDetailsHeader";
import EventInfo from "../../components/customer/EventInfo";
import VenueInfo from "../../components/customer/VenueInfo";
import PriceCards from "../../components/customer/PriceCards";
import BookTicketsButton from "../../components/customer/BookTicketsButton";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/common/ErrorState";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const eventData = await getEventById(id);
      setEvent(eventData);

      try {
        const seats = await getSeatMapByEvent(id);
        setCategories(aggregateSeatCategories(seats));
      } catch {
        setCategories([]);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load event details";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">
        <Skeleton className="h-96 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <ErrorState message={error || "Event not found"} onRetry={fetchData} />
      </div>
    );
  }

  const hasAvailability = categories.some((cat) => cat.available > 0);

  return (
    <div>
      <EventDetailsHeader event={event} />

      <div className="max-w-7xl mx-auto px-8 py-12 grid lg:grid-cols-[2fr_1fr] gap-10">
        <div className="space-y-8">
          <EventInfo event={event} />
          <PriceCards categories={categories} />
        </div>

       <div className="space-y-6 self-start">
          <VenueInfo venue={event.venue} />
          <BookTicketsButton
  event={event}
  hasAvailability={hasAvailability}
  categories={categories}
/>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;