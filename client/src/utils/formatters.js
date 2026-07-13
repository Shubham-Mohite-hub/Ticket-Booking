export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatShortDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export const formatTime = (timeString) => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  const hoursNum = parseInt(hours, 10);
  const period = hoursNum >= 12 ? "PM" : "AM";
  const displayHours = hoursNum % 12 || 12;
  return `${displayHours}:${minutes} ${period}`;
};

export const formatCurrency = (amount) => {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

export const aggregateSeatCategories = (seats) => {
  const map = new Map();

  seats.forEach((seat) => {
    if (!map.has(seat.category)) {
      map.set(seat.category, { category: seat.category, price: seat.price, total: 0, available: 0 });
    }

    const entry = map.get(seat.category);
    entry.total += 1;

    if (seat.status === "Available") {
      entry.available += 1;
    }
  });

  return Array.from(map.values()).sort((a, b) => a.price - b.price);
};