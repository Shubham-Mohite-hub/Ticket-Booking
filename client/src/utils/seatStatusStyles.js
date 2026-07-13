export const SEAT_STATUS = {
  AVAILABLE: "Available",
  HELD: "Held",
  BOOKED: "Booked",
};

export const SEAT_STATUS_STYLES = {
  [SEAT_STATUS.AVAILABLE]:
    "bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200 cursor-pointer",
  [SEAT_STATUS.HELD]:
    "bg-amber-100 text-amber-600 border-amber-300 cursor-not-allowed opacity-70",
  [SEAT_STATUS.BOOKED]:
    "bg-red-100 text-red-600 border-red-300 cursor-not-allowed opacity-70",
  selected: "bg-indigo-600 text-white border-indigo-600 cursor-pointer shadow-md scale-105",
};