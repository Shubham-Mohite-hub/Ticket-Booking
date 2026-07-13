import { MapPin } from "lucide-react";

// Note: the Event schema has no genre/category field, so this filters by
// venue location (real, populated data) instead of a fabricated category.
const CategoryFilter = ({ locations, selected, onChange }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      <button
        onClick={() => onChange("")}
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selected === ""
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        All Locations
      </button>
      {locations.map((location) => (
        <button
          key={location}
          onClick={() => onChange(location)}
          className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === location
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          {location}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;