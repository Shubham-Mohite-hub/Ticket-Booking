import ScreenIndicator from "./ScreenIndicator";
import SeatLegend from "./SeatLegend";
import SeatRow from "./SeatRow";

const SeatMap = ({ seats, selectedSeatIds, onToggleSeat }) => {
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const sortedRowNumbers = Object.keys(seatsByRow)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <ScreenIndicator />
      <SeatLegend />

      <div className="flex flex-col gap-3 items-center">
        <div className="w-full max-w-3xl space-y-3">
          {sortedRowNumbers.map((row) => (
            <SeatRow
              key={row}
              row={row}
              seats={seatsByRow[row]}
              selectedSeatIds={selectedSeatIds}
              onToggleSeat={onToggleSeat}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatMap;