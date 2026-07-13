const LEGEND_ITEMS = [
  { label: "Available", className: "bg-emerald-100 border-emerald-300" },
  { label: "Selected", className: "bg-indigo-600 border-indigo-600" },
  { label: "Held", className: "bg-amber-100 border-amber-300" },
  { label: "Booked", className: "bg-red-100 border-red-300" },
];

const SeatLegend = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-5 mb-8">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className={`w-5 h-5 rounded-md border ${item.className}`} />
          <span className="text-sm text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SeatLegend;