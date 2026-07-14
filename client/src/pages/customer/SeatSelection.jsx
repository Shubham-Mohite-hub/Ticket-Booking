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

      console.log("Seat Data:", seatData);
console.log(
  "Statuses:",
  seatData.map(s => s.status)
);
      console.log("Seat Data:", seatData);

console.log(
  "Available seats:",
  seatData.filter(s => s.status === "Available").length
);

console.log(
  "Booked seats:",
  seatData.filter(s => s.status === "Booked").length
);

console.log(
  "Held seats:",
  seatData.filter(s => s.status === "Held").length
);

console.log(
  "Statuses:",
  [...new Set(seatData.map(s => s.status))]
);
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
  const isSoldOut = event?.isSoldOut;

const handleJoinWaitlist = async () => {
  try {
    await joinWaitlist(id, "Regular");

    toast.success("You've been added to the waitlist.");
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Unable to join waitlist."
    );
  }
};
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
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">{event?.title}</h1>
          <p className="text-gray-500 mt-3 text-lg">
Choose your preferred seats before proceeding to checkout.
</p>
<div className="mt-6 flex flex-wrap gap-6">

    <div className="bg-white px-5 py-3 rounded-xl shadow-sm border">

        <p className="text-gray-500 text-sm">
            Event Date
        </p>

        <p className="font-semibold">
            {new Date(event.eventDate).toLocaleDateString()}
        </p>

    </div>

    <div className="bg-white px-5 py-3 rounded-xl shadow-sm border">

        <p className="text-gray-500 text-sm">
            Time
        </p>

        <p className="font-semibold">
            {event.startTime}
        </p>

    </div>

    <div className="bg-white px-5 py-3 rounded-xl shadow-sm border">

        <p className="text-gray-500 text-sm">
            Venue
        </p>

        <p className="font-semibold">
            {event.venue?.name}
        </p>

    </div>

</div>
        </div>

        

<div className="flex justify-center gap-8 mb-8 flex-wrap">

    <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-green-500"></div>
        Available
    </div>

    <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-indigo-600"></div>
        Selected
    </div>

    <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-red-500"></div>
        Booked
    </div>

    <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-yellow-500"></div>
        Held
    </div>

</div>

        {seats.length === 0 ? (
  <EmptyState
    title="No seats available"
    message="This event has no seat map yet."
  />
) : isSoldOut ? (
  <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

    <h2 className="text-3xl font-bold mb-4">
      Event Sold Out
    </h2>

    <p className="text-gray-500 mb-8">
      All seats for this event have been booked.
      Join the waitlist and we'll notify you if a seat becomes available.
    </p>

    <button
      onClick={handleJoinWaitlist}
      className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold"
    >
      Join Waitlist
    </button>

  </div>
) : (
  <SeatMap
    seats={seats}
    selectedSeatIds={selectedSeatIds}
    onToggleSeat={handleToggleSeat}
  />
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