import { X } from "lucide-react";
import { formatCurrency } from "../../../utils/formatters";
import Button from "../../ui/Button";

const SelectionSummary = ({ selectedSeats, onRemove, onProceed, isProcessing }) => {
  const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  if (selectedSeats.length === 0) {
    return (
      <div className="sticky bottom-0 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] px-6 py-4">
        <p className="text-center text-sm text-gray-400">Select seats to continue</p>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-6 py-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1.5">
            {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} selected
          </p>
          <div className="flex flex-wrap gap-1.5">
            {selectedSeats.map((seat) => (
              <span
                key={seat._id}
                className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium pl-2.5 pr-1.5 py-1 rounded-full"
              >
                R{seat.row}-{seat.column}
                <button
                  onClick={() => onRemove(seat)}
                  className="hover:bg-indigo-100 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 sm:border-l sm:border-gray-100 sm:pl-4">
          <div>
            <p className="text-xs text-gray-400">Total</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(total)}</p>
          </div>
          <Button onClick={onProceed} isLoading={isProcessing} className="whitespace-nowrap px-6">
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectionSummary;