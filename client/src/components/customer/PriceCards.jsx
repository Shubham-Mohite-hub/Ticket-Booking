import {
  Ticket,
  Crown,
  Star,
  Sparkles,
} from "lucide-react";

import { formatCurrency } from "../../utils/formatters";

const COLORS = [
  {
    bg: "from-indigo-500 to-indigo-700",
    icon: <Ticket className="w-6 h-6 text-white" />,
  },
  {
    bg: "from-pink-500 to-rose-600",
    icon: <Star className="w-6 h-6 text-white" />,
  },
  {
    bg: "from-amber-500 to-orange-600",
    icon: <Crown className="w-6 h-6 text-white" />,
  },
  {
    bg: "from-emerald-500 to-green-700",
    icon: <Sparkles className="w-6 h-6 text-white" />,
  },
];

const availabilityLabel = (available, total) => {
  if (available === 0)
    return {
      text: "Sold Out",
      className: "bg-red-100 text-red-700",
    };

  if (available / total <= 0.2)
    return {
      text: "Almost Full",
      className: "bg-yellow-100 text-yellow-700",
    };

  return {
    text: "Available",
    className: "bg-green-100 text-green-700",
  };
};

const PriceCards = ({ categories }) => {
  if (!categories?.length) return null;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-2xl font-bold">
            Ticket Categories
          </h2>

          <p className="text-gray-500">
            Select your preferred seating category
          </p>

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {categories.map((cat, index) => {

          const badge = availabilityLabel(
            cat.available,
            cat.total
          );

          const style = COLORS[index % COLORS.length];

          return (

            <div
              key={cat.category}
              className="rounded-3xl overflow-hidden border shadow-md hover:shadow-2xl hover:-translate-y-1 transition duration-300"
            >

              {/* Top */}

              <div
                className={`bg-gradient-to-r ${style.bg} p-5 text-white`}
              >

                <div className="flex justify-between items-center">

                  {style.icon}

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.className}`}
                  >
                    {badge.text}
                  </span>

                </div>

                <h3 className="mt-4 text-2xl font-bold">

                  {cat.category}

                </h3>

              </div>

              {/* Bottom */}

              <div className="p-6 bg-white">

                <p className="text-4xl font-black text-gray-900">

                  {formatCurrency(cat.price)}

                </p>

                <p className="text-gray-500 mt-2">
                  Per Ticket
                </p>

                <div className="mt-6">

                  <div className="flex justify-between text-sm mb-2">

                    <span>
                      Seats Left
                    </span>

                    <span className="font-semibold">

                      {cat.available}/{cat.total}

                    </span>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">

                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (cat.available /
                            cat.total) *
                          100
                        }%`,
                      }}
                    />

                  </div>

                </div>

              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
};

export default PriceCards;