import Skeleton from "../ui/Skeleton";

const EventCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
};

export default EventCardSkeleton;