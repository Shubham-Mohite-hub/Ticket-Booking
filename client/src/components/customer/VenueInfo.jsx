import { MapPin, Building2 } from "lucide-react";

const VenueInfo = ({ venue }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-indigo-600" />
        Venue
      </h3>
      <div className="flex items-start gap-2 text-gray-600">
        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
        <div>
          <p className="font-medium text-gray-800">{venue?.name}</p>
          <p className="text-sm">{venue?.location}</p>
        </div>
      </div>
    </div>
  );
};

export default VenueInfo;