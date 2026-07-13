import { SEAT_STATUS, SEAT_STATUS_STYLES } from "../../../utils/seatStatusStyles";

const Seat = ({ seat, isSelected, onToggle }) => {
  const isAvailable = seat.status === SEAT_STATUS.AVAILABLE;
  const isClickable = isAvailable || isSelected;

  const styleClass = isSelected ? SEAT_STATUS_STYLES.selected : SEAT_STATUS_STYLES[seat.status];

  return (
    <button
      type="button"
      disabled={!isClickable}
      onClick={() => isClickable && onToggle(seat)}
      title={`Row ${seat.row}, Seat ${seat.column} · ${seat.category}`}
      className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-md border text-[11px] font-medium flex items-center justify-center transition-all duration-150 ${styleClass}`}
    >
      {seat.column}
    </button>
  );
};

export default Seat;