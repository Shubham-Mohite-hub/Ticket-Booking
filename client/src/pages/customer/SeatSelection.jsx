import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getSeatMapByEvent, holdSeats } from "../../api/seatApi";
import { getEventById } from "../../api/eventApi";
import { SEAT_STATUS } from "../../utils/seatStatusStyles";
import SeatMap from "../../components/customer/seatSelection/SeatMap";
import SelectionSummary from "../../components/customer/seatSelection/SelectionSummary";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

const SeatSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    setSelectedSeats([]);

    try {
      const [eventData, seatData] = await Promise.all([
        getEventById(id),
        getSeatMapByEvent(id),
      ]);

      setEvent(eventData);
      setSeats(seatData);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load seat map";
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

  const selectedSeatIds = new Set(selectedSeats.map((seat) => seat._id));

  const handleToggleSeat = (seat) => {
    if (seat.status !== SEAT_STATUS.AVAILABLE && !selectedSeatIds.has(seat._id)) {
      return;
    }

    setSelectedSeats((prev) => {
      const alreadySelected = prev.some((s) => s._id === seat._id);
      if (alreadySelected) {
        return prev.filter((s) => s._id !== seat._id);
      }
      return [...prev, seat];
    });
  };

  const handleRemoveSeat = (seat) => {
    setSelectedSeats((prev) => prev.filter((s) => s._id !== seat._id));
  };
 const total = selectedSeats.reduce(
    (sum, seat) => sum + seat.price,
    0
  );
  const handleProceed = async () => {
    setIsProcessing(true);

    try {
      const result = await holdSeats(
        id,
        selectedSeats.map((seat) => seat._id)
      );
      const seatHoldIds = result.seatHolds.map(
    hold => hold._id
);
      console.log(result);
      toast.success("Seats held! Complete your booking before the timer expires.");
      navigate(`/events/${id}/checkout`, {
    state: {
        event,
        selectedSeats,
        total,
        seatHoldIds
    }
});
    } catch (err) {
      const message = err.response?.data?.message || "Failed to hold seats. Please try again.";
      toast.error(message);
      fetchData();
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto px-6 py-8 flex-1 w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{event?.title}</h1>
          <p className="text-sm text-gray-500 mt-1">Select your seats</p>
        </div>

        {seats.length === 0 ? (
          <EmptyState title="No seats available" message="This event has no seat map yet." />
        ) : (
          <SeatMap seats={seats} selectedSeatIds={selectedSeatIds} onToggleSeat={handleToggleSeat} />
        )}
      </div>

      <SelectionSummary
        selectedSeats={selectedSeats}
        onRemove={handleRemoveSeat}
        onProceed={handleProceed}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default SeatSelection;