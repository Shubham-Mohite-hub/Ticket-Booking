import { SearchX } from "lucide-react";

const EmptyState = ({ title = "Nothing here yet", message = "Try adjusting your filters." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-gray-100 rounded-full p-5 mb-4">
        <SearchX className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-500 mt-1 max-w-sm">{message}</p>
    </div>
  );
};

export default EmptyState;