import { Calendar, Clock, FileText } from "lucide-react";
import { formatDate, formatTime } from "../../utils/formatters";

const EventInfo = ({ event }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-600" />
        About This Event
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span className="text-sm">{formatDate(event.eventDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span className="text-sm">
            {formatTime(event.startTime)} – {formatTime(event.endTime)}
          </span>
        </div>
      </div>

      <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
    </div>
  );
};

export default EventInfo;