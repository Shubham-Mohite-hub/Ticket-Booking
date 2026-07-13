import Seat from "./Seat";

const SeatRow = ({ row, seats, selectedSeatIds, onToggleSeat }) => {
  const sortedSeats = [...seats].sort((a, b) => a.column - b.column);
  const category = sortedSeats[0]?.category;
  const price = sortedSeats[0]?.price;

  return (
    <div className="flex items-center gap-3">
      <div className="w-24 shrink-0 text-right">
        <p className="text-sm font-semibold text-gray-700">Row {row}</p>
        <p className="text-xs text-gray-400">
          {category} · ₹{price}
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {sortedSeats.map((seat) => (
          <Seat
            key={seat._id}
            seat={seat}
            isSelected={selectedSeatIds.has(seat._id)}
            onToggle={onToggleSeat}
          />
        ))}
      </div>
    </div>
  );
};

export default SeatRow;