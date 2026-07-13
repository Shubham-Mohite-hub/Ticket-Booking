import { formatCurrency } from "../../utils/formatters";

const COLORS = [
  "border-indigo-200 bg-indigo-50",
  "border-pink-200 bg-pink-50",
  "border-amber-200 bg-amber-50",
  "border-emerald-200 bg-emerald-50",
];

const availabilityLabel = (available, total) => {
  if (available === 0) return { text: "Sold Out", className: "bg-red-100 text-red-700" };
  if (available / total <= 0.2) return { text: "Almost Full", className: "bg-amber-100 text-amber-700" };
  return { text: "Available", className: "bg-emerald-100 text-emerald-700" };
};

const PriceCards = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Ticket Prices</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map((cat, i) => {
          const badge = availabilityLabel(cat.available, cat.total);
          return (
            <div
              key={cat.category}
              className={`rounded-xl border p-4 ${COLORS[i % COLORS.length]}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">{cat.category}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.className}`}>
                  {badge.text}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(cat.price)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {cat.available} of {cat.total} seats left
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriceCards;