import { useNavigate } from "react-router-dom";
import { Ticket } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/roles";
import Button from "../ui/Button";

const BookTicketsButton = ({ event, hasAvailability }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isCustomer = user?.role === ROLES.CUSTOMER;
  const isPublished = event.status === "Published";
  const isDisabled = !isCustomer || !isPublished || !hasAvailability;

  const getLabel = () => {
    if (!isPublished) return "Booking Unavailable";
    if (!hasAvailability) return "Sold Out";
    if (!isCustomer) return "Only Customers Can Book";
    return "Book Tickets";
  };

  return (
    <Button
      onClick={() => navigate(`/events/${event._id}/seats`)}
      disabled={isDisabled}
      className="w-full py-4 text-base font-semibold rounded-xl"
    >
      <Ticket className="w-5 h-5 mr-2" />
      {getLabel()}
    </Button>
  );
};

export default BookTicketsButton;