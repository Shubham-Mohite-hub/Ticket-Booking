import { useNavigate } from "react-router-dom";
import {
  Ticket,
  CheckCircle,
  XCircle,
  User,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/roles";
import Button from "../ui/Button";
import { joinWaitlist } from "../../api/waitlistApi";
import toast from "react-hot-toast";

const BookTicketsButton = ({ event, hasAvailability, categories }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isCustomer = user?.role === ROLES.CUSTOMER;
  const isPublished = event.status === "Published";
  const isDisabled = !isCustomer || !isPublished || !hasAvailability;

  const handleJoinWaitlist = async () => {
  try {
    const cheapestCategory = categories[categories.length - 1].category;
console.log(categories);
console.log(categories[0].category);
await joinWaitlist(event._id, cheapestCategory);  

    toast.success("Joined waitlist successfully!");
  } catch (err) {
  if (err.response?.status === 409) {
    toast("You're already on the waitlist.");
    return;
  }

  toast.error(
    err.response?.data?.message || "Unable to join waitlist."
  );
}
};

  const getLabel = () => {
    if (!isPublished) return "Booking Closed";
    if (!hasAvailability) return "Sold Out";
    if (!isCustomer) return "Customers Only";
    return "Book Tickets";
  };

  return (
    <div className="sticky top-28">

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

        {/* Header */}

        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">

          <p className="uppercase text-xs tracking-[3px] opacity-80">
            Ticket Booking
          </p>

          <h2 className="text-3xl font-black mt-2">
            ₹{event.basePrice}
          </h2>

          <p className="text-white/80 text-sm mt-1">
            Starting Price
          </p>

        </div>

        {/* Body */}

        <div className="p-6 space-y-5">

          <div className="flex justify-between items-center">

            <span className="text-gray-500">
              Event Status
            </span>

            {isPublished ? (
              <span className="flex items-center gap-2 text-green-600 font-semibold">
                <CheckCircle size={18} />
                Published
              </span>
            ) : (
              <span className="flex items-center gap-2 text-red-500 font-semibold">
                <XCircle size={18} />
                Closed
              </span>
            )}

          </div>

          <div className="flex justify-between items-center">

            <span className="text-gray-500">
              Seats
            </span>

            {hasAvailability ? (
              <span className="text-green-600 font-semibold">
                Available
              </span>
            ) : (
              <span className="text-red-500 font-semibold">
                Sold Out
              </span>
            )}

          </div>

          <div className="flex justify-between items-center">

            <span className="text-gray-500">
              Booking For
            </span>

            <span className="flex items-center gap-2 font-semibold">

              <User size={18} />

              {isCustomer ? "Customer" : "Restricted"}

            </span>

          </div>

          <div className="border-t pt-5">

            {!hasAvailability ? (
  <Button
    onClick={handleJoinWaitlist}
    className="w-full py-4 rounded-xl text-lg font-bold bg-orange-600 hover:bg-orange-700"
  >
    Join Waitlist
  </Button>
) : (
  <Button
    onClick={() => navigate(`/events/${event._id}/seats`)}
    disabled={!isCustomer || !isPublished}
    className="w-full py-4 rounded-xl text-lg font-bold"
  >
    <Ticket className="mr-2 h-5 w-5" />
    Book Tickets
  </Button>
)}

          </div>

          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">

            <CreditCard size={16} />

            Secure booking with instant confirmation

          </div>

        </div>

      </div>

    </div>
  );
};

export default BookTicketsButton;